import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Resolve env vars: Cloudflare Workers bindings take priority, process.env works locally
    let cfEnv: Record<string, string> = {};
    try {
      const ctx = await getCloudflareContext({ async: true });
      cfEnv = (ctx.env ?? {}) as Record<string, string>;
    } catch (_) {}
    const apiKey = cfEnv.GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured on this deployment." }, { status: 500 });
    }

    const systemPrompt = `You are a cybersecurity and journalism credibility expert. Analyze the news domain provided.
Determine its credibility, historical bias, and risk of misinformation.
Respond STRICTLY in JSON format with exactly these keys:
- "source": the domain name provided.
- "trust_score": an integer between 0 and 100 representing credibility (e.g., 90+ for reuters.com, <30 for known fake news sites).
- "bias": a short string describing political or sensational bias (e.g., "Neutral", "Left-leaning", "High", "Extreme").
- "risk": strictly "LOW", "MEDIUM", or "HIGH".
- "details": an array of exactly 5 objects representing specific checks. Each object must have:
  - "label": string (e.g., "HTTPS Enforced", "Domain Age", "Blacklist Check", "Citation Quality", "WHOIS Transparency")
  - "value": string (e.g., "Yes", "15+ years", "Clean", "High", "Public")
  - "ok": boolean indicating if this check passed (true) or failed/flagged (false)

Do not output anything other than the JSON object. Use your knowledge cutoff to estimate the domain's reputation.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze the domain: ${domain}` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return NextResponse.json({ error: "Failed to check source" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Source check route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

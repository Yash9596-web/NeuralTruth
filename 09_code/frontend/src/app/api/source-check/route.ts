import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// ─── Resolve all available Groq API keys ──────────────────────────────────────
function resolveGroqKeys(cfEnv: Record<string, string>): string[] {
  const keys = [
    // GROQ_API_KEY1 = user's new key (fresh quota) — try first
    cfEnv.GROQ_API_KEY1  || process.env.GROQ_API_KEY1  || "",
    // GROQ_API_KEY = original key (may be exhausted) — fallback
    cfEnv.GROQ_API_KEY   || process.env.GROQ_API_KEY   || "",
    // Extra slots for future keys
    cfEnv.GROQ_API_KEY_2 || process.env.GROQ_API_KEY_2 || "",
    cfEnv.GROQ_API_KEY_3 || process.env.GROQ_API_KEY_3 || "",
  ];
  return keys.filter(Boolean);
}

// ─── Groq call: key fallback + model fallback on rate-limit ───────────────────
async function groqFetch(
  keys: string[],
  payload: object,
  fallbackModel?: string
): Promise<{ ok: boolean; data?: object; error?: string; usedFallback?: boolean }> {
  const primaryModel = (payload as { model: string }).model;
  const models = fallbackModel ? [primaryModel, fallbackModel] : [primaryModel];

  for (const model of models) {
    const isFallback = model !== primaryModel;
    for (const key of keys) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, model }),
      });

      if (res.ok) {
        const data = await res.json();
        return { ok: true, data, usedFallback: isFallback };
      }

      const errText = await res.text();
      let errMsg = errText;
      try { errMsg = JSON.parse(errText)?.error?.message || errText; } catch (_) {}

      if (res.status === 429) {
        console.warn(`Rate-limited on model ${model}: ${errMsg.slice(0, 80)}`);
        continue; // try next key
      }

      return { ok: false, error: errMsg.slice(0, 300) }; // non-429 error, stop
    }
    // All keys exhausted on this model — try next model
    console.warn(`All keys exhausted on ${model}, trying fallback model...`);
  }

  return {
    ok: false,
    error: "Daily token limit reached. Quota resets every 24 hours — please try again later.",
  };
}

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Try to extract a clean domain name if the user pasted a full URL or text containing a URL
    let targetDomain = domain.trim();
    const urlMatch = targetDomain.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      try {
        targetDomain = new URL(urlMatch[0]).hostname;
        // Strip www. if present
        if (targetDomain.startsWith('www.')) {
          targetDomain = targetDomain.slice(4);
        }
      } catch (_) {}
    } else {
      // If it looks like a url without http
      try {
        if (!targetDomain.includes(' ') && targetDomain.includes('.')) {
          let testUrl = targetDomain.startsWith('http') ? targetDomain : `https://${targetDomain}`;
          targetDomain = new URL(testUrl).hostname;
          if (targetDomain.startsWith('www.')) {
            targetDomain = targetDomain.slice(4);
          }
        }
      } catch (_) {}
    }

    // Resolve env vars
    let cfEnv: Record<string, string> = {};
    try {
      const ctx = getCloudflareContext();
      cfEnv = (ctx.env ?? {}) as Record<string, string>;
    } catch (_) {
      // Falls back to process.env
    }

    const groqKeys = resolveGroqKeys(cfEnv);
    if (groqKeys.length === 0) {
      return NextResponse.json({ error: "No Groq API keys configured on this deployment." }, { status: 500 });
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

    const response = await groqFetch(
      groqKeys,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze the domain: ${targetDomain}` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      },
      "llama-3.1-8b-instant" // Fallback model
    );

    if (!response.ok) {
      return NextResponse.json({ error: `${response.error}` }, { status: 500 });
    }

    const data = response.data as { choices: { message: { content: string } }[] };
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Source check route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

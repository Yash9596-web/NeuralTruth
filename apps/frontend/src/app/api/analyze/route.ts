import { NextResponse } from "next/server";

// ─── Tavily web search helper ─────────────────────────────────────────────────
async function webSearch(query: string, tavilyKey: string): Promise<string> {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey,
        query,
        search_depth: "advanced",
        max_results: 5,
        include_answer: true,
        include_raw_content: false,
      }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    const snippets = (data.results || [])
      .map((r: { title: string; url: string; content: string }) =>
        `SOURCE: ${r.title} (${r.url})\nSNIPPET: ${r.content?.slice(0, 400)}`
      )
      .join("\n\n");
    const answer = data.answer ? `TAVILY SUMMARY: ${data.answer}\n\n` : "";
    return answer + snippets;
  } catch {
    return "";
  }
}

// ─── Simple regex HTML scraper ─────────────────────────────────────────────────
async function scrapeUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) return "";
    const html = await res.text();

    // Remove scripts and styles
    let cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

    // Extract text from <p> tags
    const pMatches = cleaned.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const paragraphs = pMatches
      .map(p => p.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim())
      .filter(t => t.length > 30);

    if (paragraphs.length === 0) {
      // Fallback: extract from body
      const bodyMatch = cleaned.match(/<body\b[^>]*>([\s\S]*?)<\/body>/gi);
      if (bodyMatch) {
        return bodyMatch[0]
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 8000);
      }
    }

    return paragraphs.join("\n\n").slice(0, 8000);
  } catch (error) {
    console.error("Scraper helper error:", error);
    return "";
  }
}

// ─── Main route ───────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: "Text is too short to analyze." }, { status: 400 });
    }

    let articleText = text;
    let isUrl = false;
    try {
      const trimmed = text.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        new URL(trimmed);
        isUrl = true;
      }
    } catch (_) {}

    if (isUrl) {
      const scraped = await scrapeUrl(text.trim());
      if (scraped && scraped.trim().length > 50) {
        articleText = scraped;
      } else {
        return NextResponse.json({ error: "Could not extract readable article text from the URL. Please verify the link is accessible." }, { status: 400 });
      }
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const tavilyKey = process.env.TAVILY_API_KEY || "";

    // ── Step 1: Extract key claims for web search ──────────────────────────
    let webEvidence = "";
    if (tavilyKey) {
      // Ask Groq to extract the main claim to search for
      const claimRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Extract the single most important factual claim from the article text. Return ONLY a short search query (max 15 words) suitable for Google. Return nothing else.",
            },
            { role: "user", content: articleText.slice(0, 1000) },
          ],
          temperature: 0,
          max_tokens: 60,
        }),
      });

      if (claimRes.ok) {
        const claimData = await claimRes.json();
        const searchQuery = claimData.choices?.[0]?.message?.content?.trim();
        if (searchQuery) {
          webEvidence = await webSearch(searchQuery, tavilyKey);
        }
      }
    }

    // ── Step 2: Full analysis with strict prompt ────────────────────────────
    const systemPrompt = `You are a highly skeptical, professional AI fact-checker and misinformation analyst with the critical rigor of a senior investigative journalist.

Your job is to determine if the given text is FAKE or REAL news. You must be STRICT and SKEPTICAL — never assume something is real just because it sounds plausible.

## RED FLAGS that strongly indicate FAKE news:
- Extraordinary, unverified claims ("scientists confirm", "government hiding", "secret cure")
- Emotional or sensational language designed to trigger outrage or fear
- Vague sourcing ("according to sources", "experts say" with no named experts)
- Claims that contradict scientific consensus
- Conspiracy theory framing
- Clickbait-style exaggerations
- Statistics without named, verifiable studies
- Medical/health claims not from peer-reviewed journals
- Political claims that are overly one-sided or inflammatory

## SCORING RULES:
- If ANY of the above red flags are present → lean FAKE, confidence 70-99%
- If the claim is extraordinary and you find NO corroborating web evidence → FAKE, confidence 85-99%
- If claims are verified by multiple trusted sources in web evidence → REAL, confidence 80-95%
- If text is ambiguous but has suspicious framing → FAKE, confidence 60-75%
- NEVER assign REAL with confidence > 90% unless strong web evidence confirms it
- NEVER assign REAL to conspiracy theories, even if they sound plausible

## IMPORTANT:
- You MUST use the web evidence provided (if any) to cross-check claims
- If web evidence contradicts the article → mark FAKE with high confidence
- If web evidence confirms the article → mark REAL with appropriate confidence
- If no web evidence → use your knowledge but be MORE skeptical

Respond STRICTLY in JSON format with exactly these keys:
{
  "prediction": "FAKE" or "REAL",
  "confidence": integer 0-100,
  "risk_level": "HIGH", "MEDIUM", or "LOW",
  "suspicious_sentences": ["up to 3 most suspicious/misleading sentences from the text, empty array if genuinely REAL"],
  "reasoning": "2-3 sentence explanation of why you classified it this way and what key signals you found"
}

Do NOT output anything other than the JSON object.`;

    const userContent = webEvidence
      ? `ARTICLE TEXT:\n${articleText}\n\n---\nWEB SEARCH EVIDENCE:\n${webEvidence}\n\n---\nNow analyze the article using the web evidence above. If web evidence contradicts the article, mark it FAKE.`
      : `ARTICLE TEXT:\n${articleText}\n\n---\nNo web evidence available. Be extra skeptical in your analysis.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.05,
        response_format: { type: "json_object" },
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return NextResponse.json({ error: "Failed to analyze text. Please try again." }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    // Validate structure
    if (!parsed.prediction || !["FAKE", "REAL"].includes(parsed.prediction)) {
      throw new Error("Invalid model response structure");
    }

    return NextResponse.json({
      prediction: parsed.prediction,
      confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
      risk_level: parsed.risk_level || (parsed.prediction === "FAKE" ? "HIGH" : "LOW"),
      suspicious_sentences: Array.isArray(parsed.suspicious_sentences) ? parsed.suspicious_sentences : [],
      reasoning: parsed.reasoning || "",
      web_searched: !!webEvidence,
    });

  } catch (error) {
    console.error("Analysis route error:", error);
    return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 });
  }
}

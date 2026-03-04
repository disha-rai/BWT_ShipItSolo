import { NextResponse } from "next/server";

type InputBody = {
  code: string;
  note: string;
};

type AiOutput = {
  welcome: string;
  summary: string[];
  analysis: string;
  nextStepExplanation: string;
  codeDraft: string;
  hypeLine: string;
};

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const body = await req.json().catch(() => null) as unknown;
    if (!isValidInputBody(body)) {
      const t = Date.now() - start;
      console.log(`[resume] ${t}ms`);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { code, note } = body;

    const prompt = createPrompt({ code, note });
    const apiKey = process.env.TRAE_API_KEY;
    const aiUrl = process.env.TRAE_API_URL ?? "https://api.trae.ai/v1/prompt";

    let output: AiOutput | null = null;

    if (apiKey) {
      try {
        const res = await fetch(aiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ prompt }),
          cache: "no-store",
        });

        if (res.ok) {
          const text = await res.text();
          output = parseAiJson(text);
        }
      } catch {
        output = null;
      }
    }

    if (output) {
      const t = Date.now() - start;
      console.log(`[resume] ${t}ms`);
      return NextResponse.json(output);
    }

    {
      const t = Date.now() - start;
      console.log(`[resume] ${t}ms`);
      return NextResponse.json(buildFallback());
    }
  } catch {
    const t = Date.now() - start;
    console.log(`[resume] ${t}ms`);
    return NextResponse.json(buildFallback());
  }
}

function createPrompt({ code, note }: InputBody): string {
  return `
You are PhantomFlow — an elite senior developer who helps teammates resume flow instantly after interruptions.

The user was interrupted mid-task.

Your job:
1. Reconstruct what they were trying to accomplish.
2. Infer the likely problem or goal.
3. Suggest the most logical next step.
4. Generate ready-to-copy code if possible.
5. Sound natural and confident.

Return STRICT JSON ONLY in this exact format:
{
  "welcome": "short, confident welcome back message (max 15 words)",
  "summary": ["bullet 1", "bullet 2", "bullet 3"],
  "analysis": "brief reasoning about what they were solving",
  "nextStepExplanation": "clear actionable next step explanation",
  "codeDraft": "clean improved or next-step code",
  "hypeLine": "natural spoken motivational line under 20 words"
}

Rules:
- No markdown.
- No code fences.
- No commentary outside JSON.
- If unsure, make intelligent assumptions.
- Keep summary concise.
- Make hypeLine feel human, not robotic.

User Note:
${note}

User Code:
${code}
`;
}

function parseAiJson(text: string): AiOutput | null {
  const trimmed = text.trim();
  const candidates: string[] = [];
  candidates.push(trimmed);
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    candidates.push(trimmed.slice(first, last + 1));
  }
  for (const c of candidates) {
    try {
      const parsed = JSON.parse(c) as Partial<AiOutput>;
      if (isValidAiOutput(parsed)) {
        return {
          welcome: parsed.welcome!,
          summary: parsed.summary!,
          analysis: parsed.analysis!,
          nextStepExplanation: parsed.nextStepExplanation!,
          codeDraft: parsed.codeDraft!,
          hypeLine: parsed.hypeLine!,
        };
      }
    } catch {
      continue;
    }
  }
  return null;
}

function isValidAiOutput(obj: unknown): obj is AiOutput {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  const summary = o.summary;
  const isSummaryValid =
    Array.isArray(summary) && summary.every((s: unknown) => typeof s === "string");
  return (
    typeof o.welcome === "string" &&
    isSummaryValid &&
    typeof o.analysis === "string" &&
    typeof o.nextStepExplanation === "string" &&
    typeof o.codeDraft === "string" &&
    typeof o.hypeLine === "string"
  );
}

function buildFallback(): AiOutput {
  return {
    welcome: "Welcome back! Let’s pick up right where you left off.",
    summary: ["You were iterating on your code using your latest note."],
    analysis: "",
    nextStepExplanation: "Make one focused improvement based on your note and test it.",
    codeDraft: "",
    hypeLine: "You’ve got this—small steps, strong momentum.",
  };
}

function isValidInputBody(body: unknown): body is InputBody {
  if (typeof body !== "object" || body === null) return false;
  const o = body as Record<string, unknown>;
  return typeof o.code === "string" && typeof o.note === "string";
}

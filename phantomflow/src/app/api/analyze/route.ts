"use server";
import { NextResponse } from "next/server";

function detectStopped(lines: string[]): string {
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (!l) continue;
    if (/\/\/\s*todo|#\s*todo|\/\*\s*todo/i.test(l)) return l;
    if (/^\w+\s*=\s*$/.test(l)) return l;
    if (/^(let|const|var)\s+\w+\s*;?$/.test(l)) return l;
    if (/^(int|float|double|char)\s+\w+\s*;?$/.test(l)) return l;
    if (/^public\s+static\s+\w+\s+\w+\(.*\)\s*\{$/.test(l)) return l;
    if (/^\w+\s+\w+\(.*\)\s*\{$/.test(l)) return l;
    if (/^def\s+\w+\(.*\)\s*:$/.test(l)) return l;
    if (/^for\s*\(.*$/.test(l)) return l;
    if (/^while\s*\(.*$/.test(l)) return l;
    if (/^try\s*\{$/.test(l)) return l;
  }
  return lines[lines.length - 1] || "";
}

function nextStepSuggestion(code: string): string {
  const lower = code.toLowerCase();
  if (/(int|double|float)\s+\w+\s*;/.test(lower) || /(let|const|var)\s+\w+\s*;?/.test(lower) || /\b[a-z]\s*=\s*\d+/.test(lower)) {
    return "Define addTwoNumbers(a, b) and return a + b; add a simple test with sample inputs.";
  }
  if (/def\s+\w+\(.*\)\s*:$/.test(lower) || /public\s+static\s+\w+\s+\w+\(.*\)\s*\{/.test(lower) || /^\w+\s+\w+\(.*\)\s*\{/.test(lower)) {
    return "Complete the function body and return the computed result; add one unit test.";
  }
  if (/scanf\(|cin|scanner|input\(/.test(lower)) {
    return "Parse inputs, compute the intended result, and print/return the output for verification.";
  }
  if (/bfs|dfs|queue|stack/.test(lower)) {
    return "Finish traversal logic and return the visited order or target condition.";
  }
  if (/sort\(|sorted\(|std::sort|collections\.sort/.test(lower)) {
    return "Implement sorting and verify order with a small example.";
  }
  return "Identify goal and implement a minimal function to compute and return a result.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code: string = body?.code ?? "";
    const lines = code.split(/\r?\n/);
    const stoppedAt = detectStopped(lines);
    const nextStep = nextStepSuggestion(code);
    const payload = {
      stoppedAt,
      nextStep,
      confidence: 0.8,
    };
    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

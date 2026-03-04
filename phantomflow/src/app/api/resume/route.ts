"use server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code: string = body?.code ?? "";
    const notes: string = body?.notes ?? "";
    const problem: string = body?.problem ?? "";

    const lower = `${code}\n${notes}\n${problem}`.toLowerCase();
    const summary: string[] = [];
    if (lower.includes("jwt")) summary.push("Auth focus with JWT handling");
    if (lower.includes("middleware")) summary.push("Middleware behavior and request lifecycle");
    if (lower.includes("fetch(") || lower.includes("axios")) summary.push("Network calls and API integration");
    if (lower.includes("usestate") || lower.includes("useeffect")) summary.push("React state and side effects");
    if (lower.includes("tailwind") || lower.includes("className")) summary.push("Styling and UI details");
    if (summary.length === 0) summary.push("General refactor and iteration on code");

    let nextStep = "Document intent and write a small failing test for the next behavior.";
    let draftedCode = "";
    if (lower.includes("jwt") && lower.includes("middleware")) {
      nextStep = "Add robust refresh token handling and expiry checks in middleware.";
      draftedCode =
        `export async function validateAuth(req: Request) {\n` +
        `  const token = getJwtFromHeader(req);\n` +
        `  if (!token) return { ok: false, reason: "missing" };\n` +
        `  const decoded = verifyJwt(token);\n` +
        `  if (isExpired(decoded)) {\n` +
        `    const refreshed = await refreshToken(decoded);\n` +
        `    if (!refreshed) return { ok: false, reason: "expired" };\n` +
        `    attachToken(req, refreshed);\n` +
        `  }\n` +
        `  return { ok: true };\n` +
        `}\n`;
    } else if (lower.includes("fetch(") || lower.includes("axios")) {
      nextStep = "Implement retry strategy and typed responses for network calls.";
      draftedCode =
        `async function getData(url: string) {\n` +
        `  for (let i = 0; i < 3; i++) {\n` +
        `    try { const res = await fetch(url); if (res.ok) return res.json(); }\n` +
        `    catch {}\n` +
        `  }\n` +
        `  throw new Error("Network failed");\n` +
        `}\n`;
    } else if (lower.includes("usestate") || lower.includes("useeffect")) {
      nextStep = "Extract a reducer for predictable state transitions and test the transitions.";
      draftedCode =
        `type State = { loading: boolean; data?: unknown; error?: string };\n` +
        `type Action = { type: "START" } | { type: "SUCCESS"; payload: unknown } | { type: "ERROR"; error: string };\n` +
        `function reducer(state: State, action: Action): State {\n` +
        `  switch (action.type) {\n` +
        `    case "START": return { ...state, loading: true };\n` +
        `    case "SUCCESS": return { ...state, loading: false, data: action.payload };\n` +
        `    case "ERROR": return { ...state, loading: false, error: action.error };\n` +
        `    default: return state;\n` +
        `  }\n` +
        `}\n`;
    } else {
      draftedCode = `function nextStep() {\n  return true;\n}\n`;
    }

    const payload = {
      greeting: "Welcome back — resuming your flow.",
      summary,
      nextStep,
      draftedCode,
      confidence: 0.78,
    };
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

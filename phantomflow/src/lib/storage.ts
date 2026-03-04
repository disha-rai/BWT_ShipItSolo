const SNAP_KEY = "phantomflow:snapshots";
const SESSION_KEY = "phantomflow:session";
const STREAK_KEY = "phantomflow:streak";

import type { Snapshot, Session } from "./types";

export function getSnapshots(): Snapshot[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SNAP_KEY);
  return raw ? (JSON.parse(raw) as Snapshot[]) : [];
}

export function saveSnapshots(next: Snapshot[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SNAP_KEY, JSON.stringify(next));
}

export function addSnapshot(s: Snapshot) {
  const next = [...getSnapshots(), s];
  saveSnapshots(next);
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export function startSession(name?: string): Session {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`;
  const session: Session = { id, startedAt: new Date().toISOString(), name };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(STREAK_KEY) ?? "0");
}
export function bumpStreak() {
  if (typeof window === "undefined") return;
  const prev = getStreak();
  window.localStorage.setItem(STREAK_KEY, String(prev + 1));
}

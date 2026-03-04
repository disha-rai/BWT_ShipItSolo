export type Snapshot = {
  code: string;
  note: string;
};

const KEY = "phantomflow:snapshot";

export function saveSnapshot(data: Snapshot) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify(data);
    window.localStorage.setItem(KEY, payload);
  } catch {}
}

export function loadSnapshot(): Snapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (isSnapshot(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function clearSnapshot() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}

function isSnapshot(v: unknown): v is Snapshot {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.code === "string" && typeof o.note === "string";
}

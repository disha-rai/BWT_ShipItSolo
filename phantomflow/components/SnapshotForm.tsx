"use client";

import { useCallback, useState } from "react";
import ResumeCard from "./ResumeCard";
import VoicePlayer from "./VoicePlayer";
import { saveSnapshot, loadSnapshot, clearSnapshot, Snapshot } from "../lib/localStorage";

type Result = {
  welcome: string;
  summary: string[];
  analysis: string;
  nextStepExplanation: string;
  codeDraft: string;
  hypeLine: string;
};

export default function SnapshotForm() {
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const onSave = useCallback(() => {
    setError("");
    const snapshot: Snapshot = { code, note };
    saveSnapshot(snapshot);
  }, [code, note]);

  const onBack = useCallback(async () => {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const snap = loadSnapshot();
      if (!snap) {
        setError("No snapshot found.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(snap),
      });
      const data = (await res.json()) as Result;
      setResult(data);
    } catch {
      setError("Request failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onClear = useCallback(() => {
    clearSnapshot();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm text-zinc-300">Note</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none ring-0 focus:border-zinc-700"
          placeholder="One-line note"
        />
      </div>
      <div className="space-y-3">
        <label className="block text-sm text-zinc-300">Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-48 w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-zinc-700"
          placeholder="Paste your code"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          className="inline-flex items-center rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
        >
          Save Snapshot
        </button>
        <button
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Restoring..." : "I'm Back"}
        </button>
        <button
          onClick={onClear}
          className="inline-flex items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-900"
        >
          Clear
        </button>
      </div>
      {error ? <div className="text-sm text-red-400">{error}</div> : null}
      {result ? (
        <div className="space-y-4">
          <ResumeCard data={result} />
          <VoicePlayer text={result.hypeLine} />
        </div>
      ) : null}
    </div>
  );
}

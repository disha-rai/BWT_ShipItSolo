"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
const MatrixRain = dynamic(() => import("../../components/MatrixRain"), { ssr: false });
import GlassCard from "../../components/GlassCard";
import NeonButton from "../../components/NeonButton";
import { Coffee, Sparkles, FolderPlus, Camera, Play } from "lucide-react";
import ResumeCard, { type ResumeResult } from "../../components/ResumeCard";
import { analyze } from "../../lib/analyze";
import Modal from "../../components/Modal";
import { Toast } from "../../components/Toast";
import confetti from "canvas-confetti";
import { addSnapshot, bumpStreak, getSession, getSnapshots, getStreak, startSession } from "../../lib/storage";
import type { Snapshot } from "../../lib/types";


export default function DashboardPage() {
  const [session, setSession] = useState(getSession());
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [stopped, setStopped] = useState<string>("");
  const [nextStep, setNextStep] = useState<string>("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [inactivityOpen, setInactivityOpen] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const [nextToast, setNextToast] = useState(false);

  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  const minutesActive = useMemo(() => {
    if (!session) return 0;
    const started = new Date(session.startedAt).getTime();
    return Math.max(0, Math.floor((now.getTime() - started) / 60000));
  }, [session, now]);

  const snapshots = typeof window === "undefined" ? [] : getSnapshots();
  const streak = typeof window === "undefined" ? 0 : getStreak();

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const inactivityTimer = setTimeout(() => {
      setInactivityOpen(true);
      if (canSpeak) {
        const utter = new SpeechSynthesisUtterance("Yo legend, snapshot before you dip?");
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find((v) => /Google US English/i.test(v.name)) || voices[0];
        if (preferred) utter.voice = preferred;
        utter.rate = 1.05;
        utter.pitch = 1.02;
        utter.volume = 0.95;
        window.speechSynthesis.speak(utter);
      }
    }, 20 * 60 * 1000);
    return () => clearTimeout(inactivityTimer);
  }, [session, canSpeak]);

  useEffect(() => {
    async function detectClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 60 && !code.trim()) {
          setShowSuggest(true);
        }
      } catch {
      }
    }
    detectClipboard();
  }, [code]);

  const onStartSession = () => {
    const s = startSession();
    setSession(s);
  };

  const onSnapshot = () => {
    if (!session) return;
    const snap: Snapshot = {
      id: session.id,
      timestamp: new Date().toISOString(),
      code,
      note,
    };
    addSnapshot(snap);
    bumpStreak();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 } });
    setNote("");
    setShowSuggest(false);
    const ai = analyze(code, note);
    setResult(ai);
    setNextToast(true);
    setTimeout(() => setNextToast(false), 2000);
  };

  const onResume = async () => {
    setLoading(true);
    setResult(null);
    setStopped("");
    setNextStep("");
    await new Promise((r) => setTimeout(r, 800));
    try {
      const snaps = getSnapshots().filter((s) => s.id === session?.id);
      const latest = snaps.length ? snaps[snaps.length - 1] : { code, note };
      console.log("Sending snapshot:", latest);
      const resp = await fetch("/api/resume", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: latest.code ?? code, notes: latest.note ?? note, problem: "" }),
      });
      const data = await resp.json();
      console.log("Received response:", data);
      const ai: ResumeResult = {
        greeting: data.greeting,
        summary: Array.isArray(data.summary) ? data.summary : [String(data.summary ?? "")].filter(Boolean),
        draftCode: data.draftedCode ?? "",
        hypeMessage: "Locked in — ship mode activated ⚡",
      };
      setResult(ai);
    } catch {
    }
    try {
      const resp2 = await fetch("/api/analyze", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const extra = await resp2.json();
      if (extra?.stoppedAt) setStopped(extra.stoppedAt);
      if (extra?.nextStep) setNextStep(extra.nextStep);
    } catch {}
    setLoading(false);
    if (canSpeak && result) {
      const utter = new SpeechSynthesisUtterance(`${result.greeting}. ${result.hypeMessage}`);
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => /Google US English/i.test(v.name)) || voices[0];
      if (preferred) utter.voice = preferred;
      utter.rate = 1.05;
      utter.pitch = 1.02;
      utter.volume = 0.95;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MatrixRain />
      <header className="container mx-auto max-w-6xl px-4 py-10 text-center">
        <h1 className="mx-auto bg-gradient-to-r from-cyan-400 via-violet-400 to-sky-400 bg-clip-text text-4xl font-extrabold tracking-[0.2em] text-transparent sm:text-5xl">
          PHANTOMFLOW
        </h1>
        <p className="mt-3 text-sm sm:text-base opacity-80">Your Flow State, Preserved</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs opacity-70" suppressHydrationWarning>
          <Coffee className="size-4" />
          <span>
            {snapshots.filter((s) => s.id === session?.id).length} Snapshots • Reclaimed ~
            {streak * 23} min 🔥 • Active {minutesActive}m
          </span>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlassCard>
            <div className="border-b border-foreground/20 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold">Capture Before You Step Away</h2>
            </div>
            <div className="space-y-4 p-5">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your current file or selected code here from your IDE..."
                rows={12}
                className="w-full resize-y rounded-lg border border-foreground/25 bg-background/70 p-3 text-sm outline-none ring-2 ring-transparent placeholder:opacity-60 focus:ring-foreground/40"
              />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Quick note: e.g. 'Debugging JWT expiry in middleware'"
                className="w-full rounded-lg border border-foreground/25 bg-background/70 p-3 text-sm outline-none ring-2 ring-transparent placeholder:opacity-60 focus:ring-foreground/40"
              />
              <div className="flex flex-wrap gap-2">
                <NeonButton glow="cyan" onClick={onStartSession}>
                  <FolderPlus className="mr-2 size-4" />
                  Start New Session
                </NeonButton>
                <NeonButton glow="violet" onClick={onSnapshot} disabled={!session}>
                  <Camera className="mr-2 size-4" />
                  TAKE SNAPSHOT
                </NeonButton>
                <NeonButton glow="blue" onClick={onResume} disabled={!session || loading}>
                  <Play className="mr-2 size-4" />
                  I&apos;M BACK – RESUME FLOW
                </NeonButton>
              </div>
              {loading && (
                <div className="mt-2 grid gap-3">
                  <div className="h-24 animate-pulse rounded-lg border border-foreground/20 bg-foreground/[0.06]" />
                  <div className="h-12 animate-pulse rounded-lg border border-foreground/20 bg-foreground/[0.06]" />
                </div>
              )}
            </div>
          </GlassCard>

          <div className="space-y-4">
            {(stopped || nextStep) && (
              <GlassCard className="p-4">
                {stopped && (
                  <div className="mb-2 text-sm">
                    <div className="text-xs opacity-70">You Stopped At</div>
                    <pre className="mt-1 max-h-20 overflow-auto rounded-md border border-foreground/20 bg-foreground/[0.05] p-2 text-xs">
                      {stopped}
                    </pre>
                  </div>
                )}
                {nextStep && (
                  <div className="text-sm">
                    <div className="text-xs opacity-70">Next Step</div>
                    <p className="mt-1">{nextStep}</p>
                  </div>
                )}
              </GlassCard>
            )}
            {result ? (
              <ResumeCard
                result={result}
                onCopy={() => {
                  if (!result?.draftCode) return;
                  navigator.clipboard.writeText(result.draftCode).catch(() => {});
                }}
                onSpeak={() => {}}
                canSpeak={canSpeak}
              />
            ) : (
              <GlassCard className="p-6 text-sm opacity-80">Resume insights will appear here.</GlassCard>
            )}

            <div className="space-y-2">
              <h3 className="text-sm uppercase tracking-wider opacity-70">Recent Snapshots</h3>
              <div className="grid gap-3">
                {snapshots
                  .filter((s) => s.id === session?.id)
                  .slice()
                  .reverse()
                  .map((s, idx) => (
                    <GlassCard key={`${s.timestamp}-${idx}`} className="p-4">
                      <div className="flex items-center justify-between text-xs opacity-70">
                        <span>{new Date(s.timestamp).toLocaleString()}</span>
                        <span>Session: {s.id.slice(0, 8)}</span>
                      </div>
                      <pre className="mt-2 max-h-40 overflow-auto rounded-md border border-foreground/20 bg-foreground/[0.05] p-3 text-xs">
                        {s.code.slice(0, 600)}
                      </pre>
                      {s.note && <p className="mt-2 text-sm opacity-90">{s.note}</p>}
                    </GlassCard>
                  ))}
                {snapshots.filter((s) => s.id === session?.id).length === 0 && (
                  <p className="text-sm opacity-70">No snapshots yet for this session.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Toast message="Clipboard has code — snapshot this?" show={showSuggest} />
      <Toast message="Next step drafted — check right panel" show={nextToast} />
      <Modal open={inactivityOpen} title="Snapshot reminder" onClose={() => setInactivityOpen(false)}>
        Yo legend, snapshot before you dip?
      </Modal>
      <footer className="pb-10 text-center text-xs opacity-60">
        <div className="inline-flex items-center gap-2">
          <Sparkles className="size-3" /> Built for 2030 devs
        </div>
      </footer>
    </div>
  );
}

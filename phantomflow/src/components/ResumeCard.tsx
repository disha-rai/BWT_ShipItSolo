"use client";
import { CheckCircle2, Clipboard, Volume2 } from "lucide-react";
import { useState } from "react";

export type ResumeResult = {
  greeting: string;
  summary: string[];
  draftCode: string;
  hypeMessage: string;
};

type Props = {
  result: ResumeResult;
  onCopy: () => void;
  onSpeak: () => void;
  canSpeak: boolean;
};

export default function ResumeCard({ result, onCopy, onSpeak, canSpeak }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const speak = () => {
    if (!canSpeak) return;
    const full = `${result.greeting}. ${result.hypeMessage}`;
    const utter = new SpeechSynthesisUtterance(full);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /Google US English/i.test(v.name)) || voices[0];
    if (preferred) utter.voice = preferred;
    utter.rate = 1.05;
    utter.pitch = 1.02;
    utter.volume = 0.95;
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="rounded-xl border border-foreground/30 bg-background/60 shadow-[0_0_30px_rgba(139,92,246,0.35)]">
      <div className="border-b border-foreground/20 p-5">
        <h2 className="text-2xl font-bold tracking-tight">{result.greeting}</h2>
      </div>
      <div className="space-y-4 p-5">
        <ul className="space-y-2">
          {result.summary?.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-5 text-green-400" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <div className="relative">
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              aria-label="Copy code"
              className="inline-flex items-center rounded-md border border-foreground/20 bg-background/70 px-3 py-1 text-sm hover:bg-foreground/10"
              onClick={onCopy}
            >
              <Clipboard className="mr-2 size-4" />
              Copy
            </button>
            <button
              aria-label="Speak"
              className="inline-flex items-center rounded-md border border-foreground/20 bg-background/70 px-3 py-1 text-sm hover:bg-foreground/10 disabled:opacity-50"
              onClick={() => {
                speak();
                onSpeak();
              }}
              disabled={!canSpeak}
            >
              <Volume2 className="mr-2 size-4" />
              {speaking ? "Playing…" : "Replay"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-md border border-foreground/20 bg-foreground/[0.06] p-4 text-sm">
            <code>{result.draftCode}</code>
          </pre>
        </div>
        <p className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-base italic text-transparent">
          {result.hypeMessage}
        </p>
        {!canSpeak && (
          <span className="inline-block rounded-md border border-foreground/20 px-2 py-1 text-xs">
            Voice unavailable in this browser
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="h-2 w-full rounded-full bg-foreground/10">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-400 to-sky-400" />
        </div>
        <p className="mt-1 text-xs opacity-70">Confidence</p>
      </div>
    </div>
  );
}

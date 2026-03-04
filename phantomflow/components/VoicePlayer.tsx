"use client";

import { useEffect, useRef } from "react";

type Props = {
  text: string;
};

export default function VoicePlayer({ text }: Props) {
  const lastText = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!text || text === lastText.current) return;
    lastText.current = text;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch {}
  }, [text]);

  return null;
}

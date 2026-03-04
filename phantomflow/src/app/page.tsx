"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
const MatrixRain = dynamic(() => import("../components/MatrixRain"), { ssr: false });
import NeonButton from "../components/NeonButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MatrixRain />
      <main className="container mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="mx-auto bg-gradient-to-r from-cyan-400 via-violet-400 to-sky-400 bg-clip-text text-5xl font-extrabold tracking-[0.2em] text-transparent sm:text-6xl">
          PHANTOMFLOW
        </h1>
        <p className="mt-4 text-base opacity-80">Your Flow Time Machine</p>
        <p className="mx-auto mt-2 max-w-xl text-sm opacity-70">
          Preserve your developer intent, snapshot code before interruptions, and resume flow
          with a hyped AI colleague and real voice vibes.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <NeonButton glow="violet" size="lg">Enter Dashboard</NeonButton>
          </Link>
          <a href="https://vercel.com/new" target="_blank" rel="noreferrer">
            <NeonButton glow="cyan" size="lg">Deploy</NeonButton>
          </a>
        </div>
      </main>
    </div>
  );
}

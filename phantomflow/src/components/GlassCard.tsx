"use client";
import { cn } from "../lib/utils";

export default function GlassCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "rounded-xl border border-cyan-400/25 bg-background/40 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-2xl",
        "hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-shadow",
        className
      )}
    />
  );
}

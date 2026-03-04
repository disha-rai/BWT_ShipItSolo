"use client";
import { cn } from "../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  glow?: "cyan" | "violet" | "blue";
  size?: "md" | "lg";
};

export default function NeonButton({ className, glow = "violet", size = "md", ...rest }: Props) {
  const glowColor =
    glow === "cyan"
      ? "shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]"
      : glow === "blue"
      ? "shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]"
      : "shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)]";
  const sizeCls = size === "lg" ? "h-11 px-5 text-sm" : "h-10 px-4 text-sm";
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background transition disabled:opacity-50",
        glowColor,
        sizeCls,
        className
      )}
    />
  );
}

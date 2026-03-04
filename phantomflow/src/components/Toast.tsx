"use client";
export function Toast({ message, show }: { message: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-violet-400/30 bg-background/70 px-4 py-2 text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)]">
      {message}
    </div>
  );
}

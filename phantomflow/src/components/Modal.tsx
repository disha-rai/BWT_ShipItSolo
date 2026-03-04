"use client";
type Props = {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-xl border border-cyan-400/25 bg-background/80 p-5 text-foreground shadow-[0_0_30px_rgba(56,189,248,0.25)]">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <div className="text-sm opacity-90">{children}</div>
        <div className="mt-4 flex justify-end">
          <button
            className="inline-flex h-10 items-center justify-center rounded-md border border-foreground/20 px-4 text-sm hover:bg-foreground/10"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

type Data = {
  welcome: string;
  summary: string[];
  analysis: string;
  nextStepExplanation: string;
  codeDraft: string;
  hypeLine: string;
};

export default function ResumeCard({ data }: { data: Data }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow">
      <div className="text-lg font-medium">{data.welcome}</div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-300">
        {data.summary.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      <div className="mt-4 whitespace-pre-wrap text-zinc-200">{data.analysis}</div>
      <div className="mt-4 whitespace-pre-wrap text-zinc-200">{data.nextStepExplanation}</div>
      <div className="mt-4">
        <pre className="overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm text-zinc-100">
          <code>{data.codeDraft}</code>
        </pre>
      </div>
    </div>
  );
}

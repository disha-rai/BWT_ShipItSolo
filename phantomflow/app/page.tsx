import SnapshotForm from "../components/SnapshotForm";

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">PhantomFlow</h1>
        <p className="mt-2 text-zinc-400">Save a snapshot and restore flow when you return.</p>
        <div className="mt-8">
          <SnapshotForm />
        </div>
      </div>
    </main>
  );
}

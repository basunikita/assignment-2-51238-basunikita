import Link from "next/link";

export default function Placeholder({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm underline underline-offset-4">
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Coming soon.</p>
    </main>
  );
}

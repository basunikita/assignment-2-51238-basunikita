import Link from "next/link";
import { SECTION_GROUPS } from "./sections";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">A Week of Workouts</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Three mood boards, a design system built from each, and the final site.
      </p>
      {SECTION_GROUPS.map((group) => (
        <section key={group.heading} className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            {group.heading}
          </h2>
          <ul className="mt-3 space-y-2">
            {group.sections.map((section) => (
              <li key={section.href}>
                <Link href={section.href} className="text-lg underline underline-offset-4">
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

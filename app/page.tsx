import Link from "next/link";
import type { ReactNode } from "react";
import { HUB_DISPLAY_FONTS } from "./fonts/hub";
import { MOODS } from "./moods";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100";
const CARD = `flex items-center justify-between gap-3 rounded-xl border border-zinc-300 px-4 py-3 transition-colors hover:border-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:bg-zinc-900 ${FOCUS}`;
const SWATCH_EDGE = "ring-1 ring-inset ring-zinc-900/15 dark:ring-zinc-100/25";

function HubSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-[11px] text-white dark:bg-zinc-100 dark:text-zinc-900">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <p className="text-sm text-zinc-500">MPCS 51238 · UI/UX &amp; Visual Design</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">A Week of Workouts</h1>
      <p className="mt-3 max-w-prose text-zinc-600 dark:text-zinc-400">
        A beginner&apos;s week of gym strength work and cardio: three moods, a design system built from
        each, and the site.
      </p>

      <HubSection step={1} title="Mood boards">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOODS.map((mood) => (
            <li key={mood.slug}>
              <Link href={`/mood-boards/${mood.slug}/`} className={CARD}>
                <span className="flex" aria-hidden="true">
                  {mood.swatches.slice(0, 4).map((swatch) => (
                    <span
                      key={swatch.token}
                      className={`h-7 w-7 first:rounded-l-md last:rounded-r-md ${SWATCH_EDGE}`}
                      style={{ background: swatch.hex }}
                    />
                  ))}
                </span>
                <span className="font-medium whitespace-nowrap">
                  {mood.name} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </HubSection>

      <HubSection step={2} title="Design systems">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOODS.map((mood) => (
            <li key={mood.slug}>
              <Link href={`/design-systems/${mood.slug}/`} className={CARD}>
                <span className={`flex items-center gap-2 ${HUB_DISPLAY_FONTS[mood.slug]}`} aria-hidden="true">
                  <span className="text-2xl leading-none" style={{ fontFamily: mood.fonts.display }}>
                    Aa
                  </span>
                  {mood.swatches.slice(0, 3).map((swatch) => (
                    <span
                      key={swatch.token}
                      className={`h-3 w-3 rounded-full ${SWATCH_EDGE}`}
                      style={{ background: swatch.hex }}
                    />
                  ))}
                </span>
                <span className="font-medium whitespace-nowrap">
                  {mood.name} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-zinc-500">Each one built from its mood board.</p>
      </HubSection>

      <HubSection step={3} title="Your site">
        <Link
          href="/workout-week/"
          className={`inline-flex rounded-full bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 ${FOCUS}`}
        >
          Open A Week of Workouts <span aria-hidden="true">&nbsp;→</span>
        </Link>
      </HubSection>
    </main>
  );
}

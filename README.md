# A Week of Workouts

MPCS 51238 assignment 2: three mood boards, a design system built from each mood board, and
a final site that presents a week of workouts. The home page links to all seven.

It is a static [Next.js](https://nextjs.org) 16 site (`output: "export"` in `next.config.ts`).
`npm run build` writes plain HTML, CSS and JS to `out/`.

## Layout

| Route | Source | What it is |
|---|---|---|
| `/` | `app/page.tsx` | The hub. Each mood's palette, roles, fonts and contrast pairs live in `app/moods.ts`; fonts load in `app/fonts.ts` |
| `/mood-boards/<mood>/` | `app/mood-boards/<mood>/` | Mood boards: `sunrise`, `editorial`, `plate-room`. Shared layout in `app/mood-boards/_components/` |
| `/design-systems/<mood>/` | `app/design-systems/<mood>/page.tsx` | Design system *mood*, built from its mood board (placeholder for now) |
| `/workout-week/` | `app/workout-week/page.tsx` | The final site (placeholder for now) |

## Commands

```bash
npm run dev     # http://localhost:3000
npm run lint
npm test        # clean static build, then the checks in tests/
npm run build   # static export to out/
```

## Photos

Mood-board photos are free Unsplash photos saved into `public/mood-boards/<mood>/`. The script
refuses Unsplash+ photos and prints the entry for `app/mood-boards/<mood>/photos.ts`:

```bash
scripts/unsplash.sh search "treadmill window"
scripts/unsplash.sh get sunrise <photo-id> treadmill-window
```

Rewrite each printed `alt` by hand so it describes the photo plainly.

## Installing on the IMC network

The public npm registry is blocked there, so point npm at the internal mirror for each
install:

```bash
export npm_config_registry=https://imc-npm-proxy.trading.imc.intra/repository/npm-proxy/
export NODE_OPTIONS=--use-system-ca
npm ci
```

`package-lock.json` keeps `registry.npmjs.org` URLs so that Vercel and other machines can
install from it. npm swaps in the mirror's host when the variable above is set. If an
install writes mirror URLs into the lockfile, change them back before committing.

# ReFair

A 4-screen demo (Home → Clean → Analyze → Report) built to look and feel like
real, shipped software rather than a prototype.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`, CSS-first config — no `tailwind.config.js`)
- shadcn/ui (component source, not a package — lives in `src/components/ui`)
- Recharts — charts (bar/line/pie/donut)
- react-grid-layout — draggable/resizable dashboard grid
- Framer Motion — page transitions, panel animation
- lucide-react — icons
- React Router — Home / Clean / Analyze / Report

## Design tokens

Defined as CSS variables on `:root` in `src/index.css`, and mapped onto
shadcn's semantic tokens (`--background`, `--primary`, etc.) so every shadcn
component themes itself automatically. Don't hardcode these hex values in
components — reference the CSS variables (or the Tailwind utilities they
back, e.g. `bg-primary`, `text-foreground`).

```
--ink:    #101B33   (headings, primary text, dark surfaces)
--paper:  #F7F9FC   (background — cool white, not cream)
--blue:   #2E5EAA   (primary accent — buttons, links, primary chart series)
--sky:    #5B8DEF   (secondary accent — second chart series, highlights)
--sage:   #4C8C6B   (positive/verified signal)
--brick:  #C1503A   (flagged/warning signal)
--steel:  #7C8798   (secondary text, borders)
--line:   #E1E6EE   (hairline borders)
```

Deliberately a deeper, more considered blue (cobalt-leaning, not
electric/SaaS-default), a cool near-white rather than a warm cream, and a
blue-tinted near-black (not pure black) — so the palette reads as one
considered system.

**Typography:** Fraunces (serif, `font-heading`) for headings — carries
personality. Inter (`font-sans`) for body/UI text, applied globally via
`<body>`. IBM Plex Mono (`font-mono`) for numeric data values only — tabular
figures, never decorative use. All three are loaded from Google Fonts in
`index.html`.

**Motion principles:** panels slide in with spring easing (not linear),
charts animate their bars/lines in on mount, hover states are subtle
(opacity/border shifts, not big scale jumps), page transitions fade + slide
slightly rather than hard-cutting.

## Project structure

```
src/
  components/
    ui/            <- shadcn components (generated via shadcn CLI)
    charts/        <- Recharts wrapper components (BarChartCard, DonutChartCard, etc.)
    layout/        <- Topbar, Sidebar, PageShell
  pages/
    Home.tsx
    Clean.tsx
    Analyze.tsx
    Report.tsx
  data/
    mockDataset.ts <- the Grab Food demo data, typed
  lib/
    utils.ts
  App.tsx          <- router setup
  main.tsx
```

Mock data lives in `src/data/mockDataset.ts` — reuse it, don't reinvent new
numbers.

## Build Log

- **Report page** — built out `src/pages/Report.tsx`: dark `--ink` cover
  (badge, title, dataset name), then Executive summary / What we cleaned and
  why / Key findings (2-col grid) / stat row / Recommendations cards, ending
  in Download PDF (`window.print()`) + Back to home. Key findings and
  recommendations are computed from `topRestaurants`, `ordersByArea`,
  `deliveryTrend`, and `cancellationByArea` rather than hardcoded, so the
  numbers stay consistent if the mock dataset changes. Moved the cleaning
  `changeLog` out of `Clean.tsx` and into `mockDataset.ts` (exported) so
  Report can reuse the exact same change log instead of duplicating it.
- **Clean page — quality grid fix** — the 6-dimension quality grid in
  `Clean.tsx` is now `md:grid-cols-3` (exactly 3×2, was `md:grid-cols-2`).
  The real overlap bug wasn't the CSS grid itself (row auto-sizing already
  handles expanded cards fine) — it was chart internals with hardcoded pixel
  widths that didn't fit the narrower 3-column card: `DeliveryBoxPlot` and
  `ScoreBar` used a fixed-width `BarChart` instead of `ResponsiveContainer`,
  and `ConsistencyBar`'s "Before" chart used a column layout with
  `interval={0}` axis tick labels that collided once the card got narrow.
  Fixed by making every chart width-responsive (`ResponsiveContainer`
  width="100%") and rebuilding `ConsistencyBar` as stacked horizontal bars
  (labels in a fixed-width `YAxis` column that wraps instead of colliding)
  rather than side-by-side vertical bar charts. Verified by scripting
  Playwright to expand each of the 6 cards individually and all at once, at
  1280px/800px/mobile widths, in both the quality-report and completed
  (before/after) states.
- **Analyze page — navigation, settings panel, polish** — `Analyze.tsx`'s
  toolbar "Present" button was decorative; renamed to "View Report" and
  wired to a real `Link` to `/report`, plus added a "← Back" `Link` to `/`.
  Both render as genuine anchors (`Button` with `render={<Link />}`), not
  click handlers that go nowhere. `ChartCard`'s settings `Sheet` was using
  shadcn's default modal overlay (`bg-black/10` + backdrop-blur), which
  dimmed the dashboard behind it; added an `overlay` prop to `SheetContent`
  (default `true`, so other future sheets keep the normal backdrop) and set
  it `false` here, plus `modal={false}` on the `Sheet` root so the dashboard
  stays fully visible *and* interactive behind the panel. Rebuilt the panel
  body as an `Accordion` with "Chart Properties" (open by default — title
  input that live-updates the card's displayed title while the sheet is
  open, and a 7-option chart-type icon grid: Bar/Line/Pie/Donut/Combo/
  Horizontal Bar/Table), a collapsible "X-Axis" section (Label + Column
  dropdown sourced from the dataset's dimension columns), a "Group by
  (optional)" dropdown (intentionally non-functional per spec), and a
  collapsible "Values (1)" section showing the metric label read-only.
  `GenericChart.tsx` gained `pie`, `combo`, and `horizontalBar` render cases
  to back the three new chart-type options. Cancel and the sheet's X button
  both discard the draft and revert to the committed config; Save commits
  it via the existing `onUpdate` callback. Added restrained polish to
  `ChartCard`'s wrapping `Card` — soft shadow, a hover lift with a
  primary-ring color shift, and a 3px top accent bar in the chart's active
  series color. Verified with Playwright: confirmed the element under the
  cursor behind an open settings panel is real dashboard content (not an
  overlay), confirmed title edits appear live and revert on Cancel/commit
  on Save, confirmed both nav links land on `/report` and `/` respectively,
  and programmatically checked all `.react-grid-item` bounding boxes for
  pairwise overlap before/after dragging and resizing cards (none found).
- **Clean page — card redesign, real overlap fixes, polish** — the earlier
  "3×2 grid" fix didn't actually resolve the reported cramping, because the
  collapsed card header packed status icon + name + "Confirmed" badge +
  score + chevron onto one ~280px line; once a dimension was confirmed the
  badge collided with the name and score. Restructured each card into a
  stacked layout instead: status chip + name, then a large score with a
  Healthy/Flagged/Confirmed pill, then the progress bar, then the note —
  each on its own row with explicit gaps, so nothing competes for
  horizontal space. Cards got `min-h-[188px]` (a floor, not padding — the
  natural content height is ~186px), the grid gap went `gap-4` → `gap-6`
  (24px), and the note is `line-clamp-2` with a `min-h` so variable-length
  notes can't change card height unpredictably.
  Two genuine text overlaps were found by scripting a pairwise
  bounding-box collision check over every leaf text node (including SVG
  `<text>`) rather than eyeballing screenshots: `CompletenessBar`'s x-axis
  label sat on top of its legend (fixed by promoting the label to an HTML
  caption above the chart), and `ConsistencyBar`'s long axis labels were
  being word-wrapped by Recharts into `<tspan>`s whose boxes overlapped.
  `ConsistencyBar` is now plain CSS/Framer bars instead of Recharts — for
  three data points it's simpler, and unlike a fixed-pixel `YAxis width` it
  stays readable at narrow card widths (labels truncate, value counts never
  clip). `ScoreBar` was likewise rewritten from a Recharts `BarChart` into a
  lightweight animated CSS bar so it can live in the always-visible card
  header. Polish: soft shadow + hover elevation on the 6 cards, brick/sage
  status accents, a tinted uppercase table header on the dataset profile,
  and staggered Framer Motion entrance animations. Verified the collision
  check passes for every card expanded individually, in combination, all
  six at once, with and without Confirmed badges, at 1440/1280/1024/900/
  800/390px.
- **Analyze page — Back button was already present** — reported as missing,
  but the `← Back` link added in the previous fix was in the JSX and
  working: it renders at x=16 in the toolbar with `href="/"`, is visible
  with no `display`/`opacity`/`z-index` problem at every width from 1024 to
  1680, and `elementFromPoint` at its center resolves to the anchor. The
  stale view was almost certainly a browser tab held by a dev server
  started before the change landed. Switched it from `variant="ghost"` to
  `variant="outline"` so it reads as a distinct control rather than plain
  text next to the title.
- **Global UI polish pass — consistent visual quality and branding across
  all pages** — Home had already hit the target visual bar (soft shadows,
  hover states, meaningful accent colors, restrained motion); this pass
  brought Clean, Analyze, and Report up to the same level and fixed logo
  inconsistency across all four. Logo: Clean and Report headers were
  showing a text-only "ReFair" wordmark instead of the real `logo-full.png`
  asset Home already used — replaced both with the actual logo, linked to
  `/`. Analyze's toolbar was tight (Back button + title + action icons
  already competing for space), so it got the icon-only `logo-icon.png`
  mark instead, placed before the Back button and also linked to `/`.
  Verified with Playwright that all three logo links actually navigate to
  `/`, not just that the asset renders. Clean: the dataset-overview table,
  the post-confirm Summary card, and the before/after "Cleaning complete"
  card were plain `<Card>`s with no shadow — added the same
  `shadow-sm`/hover treatment used by the quality-dimension cards so the
  whole page reads as one system. Analyze: the KPI strip was flat
  `border + bg-card` rectangles — added `shadow-sm ring-1 ring-foreground/10`
  plus a restrained `hover:shadow-md` (no lift, to avoid adding motion
  noise to an already-busy screen); the chat panel got a subtle left-edge
  shadow and an accent-tinted icon badge matching the KPI icons; the chart
  settings `Sheet` no longer looks like a default flush-edge panel — it's
  now a floating card (`rounded-2xl`, bordered, `shadow-2xl`, inset by
  `12px` from the viewport edges via `data-[side=right]:` overrides on
  `SheetContent`), confirmed via computed-style inspection since the
  effect is subtle in a full-page screenshot. Report (previously
  unpolished): swapped the text logo for the real asset, added a soft
  drop shadow under the dark cover section for depth, and gave every
  section card, the key-findings tiles, and the stat row the same
  `shadow-sm` + calm `hover:shadow-md` treatment (no translate/lift,
  since this page is meant to read as a finished document rather than an
  interactive dashboard). Verified all four pages at 1280px and 900px with
  Playwright: confirmed exactly one logo `<img>` renders in each page's
  header/toolbar, ran the pairwise text-bounding-box overlap check from
  the Clean-page fix across every page (the only flagged pairs were
  false positives — wrapped heading line-boxes and axis-aligned boxes
  around Recharts' rotated bar-chart tick labels, confirmed clean via a
  cropped screenshot), and exercised the Clean "confirm all fixes"
  completed state and the Analyze chart-settings sheet open state, not
  just each page's default view.
- **Fix Analyze layout — chat and settings coexist, dashboard polish
  pass** — the chart-settings `Sheet` added in the earlier Analyze polish
  pass was positioned `fixed` at the right edge of the viewport, which is
  exactly where the chat panel lives; even with `overlay={false}` and
  `modal={false}` keeping the dashboard interactive underneath, the panel
  still floated directly on top of the chat column, so opening chart
  settings visually hid it. Fixed by removing the Sheet/modal entirely:
  `ChartCard.tsx` no longer owns any settings UI or open state — it's now
  a pure display component that calls an `onOpenSettings(id)` prop and
  takes `active`/`previewTitle` props for highlighting itself and showing
  a live-edited title. The settings form was extracted into a new
  `ChartSettingsPanel.tsx` and lifted to `Analyze.tsx`, which now tracks
  `settingsChartId` + `previewTitle` and renders the panel as a normal
  sibling flex column between the chart grid and the chat sidebar —
  `chart grid | settings (320px, AnimatePresence width-animates in/out) |
  chat (340px, permanent)`. Because it's real layout instead of an
  overlay, both columns are simultaneously visible and independently
  interactive: verified with Playwright by opening a chart's settings,
  confirming the chat column's bounding box and the settings column's
  bounding box don't overlap, then interacting with both at once — sent a
  suggested-question message in chat and typed a new chart title in
  settings in the same session, confirming the chat message appended
  correctly *and* the card's title live-updated, and that Cancel closes
  the settings column, reverts the title, and leaves chat untouched.
  Dashboard polish to match Home's bar: KPI cards now carry a per-metric
  accent (`--blue`/`--sky`/`--steel`/`--brick`, matching what each metric
  means) as both a subtle `color-mix` background tint and an icon-badge
  color, with a staggered fade-up mount animation; chart cards get the
  same stagger as a fade+scale mount animation, applied to an inner
  wrapper div rather than the grid item itself so it doesn't fight
  react-grid-layout's own positioning transform on the outer element; the
  active chart (the one whose settings are open) now gets a visible
  `ring-primary` highlight so it's clear which card the settings column
  belongs to.
- **Add upload + processing step to Clean and Analyze entry points** —
  both `/clean` and `/analyze`, when reached directly from Home, used to
  jump straight to a fully-processed result with no upload step, which
  broke the "real workflow" illusion. Added a shared
  `src/components/upload/UploadFlow.tsx`: a dropzone (drag-and-drop plus a
  "Browse files" button, `accept=".csv,.xlsx,.xls"`, filename/size shown
  in a file chip once picked — the file is never actually parsed, just its
  `name`/`size` read off the browser `File` object) that transitions into
  a scripted ~1.9s processing state (3 sequential status messages
  cross-fading via `AnimatePresence`, a spinning `Loader2`, and a
  linear-fill progress bar timed to match), then calls `onComplete
  (fileName)`. Both pages hold their own `uploadedFileName` state and
  render `UploadFlow` in place of their normal content until it resolves;
  `Clean.tsx` also feeds the picked filename into the "Dataset" stat
  (`uploadedFileName ?? datasetOverview.name`) instead of the hardcoded
  `grab_food_orders_march.csv`, while the mock data itself stays fixed
  regardless of what was "uploaded," per spec. The copy is framed
  differently per entry point — Clean says "Upload your dataset" /
  "we'll profile it for quality issues automatically" with steps
  `Reading file… → Scanning data quality… → Almost done…`; Analyze (direct
  entry) says "Upload your clean dataset" / "we'll build your dashboard
  automatically" with steps `Reading file… → Validating structure… →
  Preparing dashboard…`, since that path assumes the data is already
  clean. The one thing this couldn't be is a blanket "show upload on every
  /analyze visit": reaching Analyze via Clean's "Continue to Analyze" (or
  the header's "Skip to Analyze") must NOT re-prompt for a file, since the
  user already uploaded one at the start of the Clean flow. Solved with
  React Router location state — both of those links now pass `state={{
  skipUpload: true }}`, and `Analyze.tsx` reads
  `location.state?.skipUpload` to decide whether it needs its own upload
  step (`needsUpload = !skippedUpload && !uploadedFileName`); a direct
  visit or reload has no state and correctly falls back to requiring
  upload. Verified end-to-end with Playwright rather than just
  typechecking: Home → Clean tool card → dropped a real file via
  `setInputFiles` → confirmed the file chip, all three processing
  messages in sequence, and the Dataset-overview stat showing the actual
  picked filename; then Confirm-all → Continue to Analyze and confirmed
  the upload state was skipped and the dashboard rendered directly; and
  separately Home → Analyze tool card → confirmed the "already-clean"
  copy, the same processing sequence, and the dashboard landing correctly
  afterward.

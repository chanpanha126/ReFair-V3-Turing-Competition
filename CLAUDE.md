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

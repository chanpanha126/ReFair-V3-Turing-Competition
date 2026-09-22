# ReFair Demo — Production-Quality Rebuild Plan

This rebuilds the same 4-screen demo (Home → Clean → Analyze → Report) using a real
frontend stack instead of hand-rolled HTML/CSS/JS — aimed specifically at looking and
feeling like real, shipped software, not a prototype.

---

## 1. Stack, and why

| Tool | Why this one |
|---|---|
| **Vite + React + TypeScript** | Fast dev loop, the standard modern setup — lets Claude Code iterate visually fast and catch type errors as it builds |
| **Tailwind CSS** | Utility styling, consistent spacing/sizing without hand-writing CSS files |
| **shadcn/ui** | Not a component *library* you import — it's polished, accessible component source (Button, Sheet, Tabs, Select, Dialog, Accordion) that you own and customize. This is what real B2B SaaS products (Linear, Vercel dashboard, etc.) are often built on — it's the single biggest lever for "looks production-ready" |
| **Recharts** | Real charting library — proper bar/line/pie/donut with built-in smooth animation, replacing the hand-drawn SVG bars from the last version |
| **react-grid-layout** | Purpose-built drag-and-resize dashboard grid library — this is the closest real match to the reference screenshot's behavior (draggable, resizable chart cards) |
| **Framer Motion** | Page transitions, panel slide-ins, chart entrance animation — this is what makes it *feel* real instead of static |
| **lucide-react** | Icon set — clean, consistent, modern |
| **React Router** | Multi-screen navigation (Home / Clean / Analyze / Report) |

Don't substitute a "simpler" charting/grid library to save setup time — these two (Recharts, react-grid-layout) are specifically what close the gap with the reference screenshot's behavior.

---

## 2. Design system (carry forward, refine)

```
--ink:    #101B33   (headings, primary text, dark surfaces)
--paper:  #F7F9FC   (background — cool white, not cream)
--blue:   #2E5EAA   (primary accent — buttons, links, primary chart series)
--sky:    #5B8DEF   (secondary accent — used for a second chart series, highlights)
--sage:   #4C8C6B   (positive/verified signal)
--brick:  #C1503A   (flagged/warning signal)
--steel:  #7C8798   (secondary text, borders)
--line:   #E1E6EE   (hairline borders)
```

Avoid the generic Tailwind `blue-600` look — this is a deliberately deeper, more considered blue (cobalt-leaning, not electric/SaaS-default), paired with a cool near-white rather than a warm cream, and the near-black is blue-tinted (`#101B33`), not pure black — so the whole palette reads as one considered system, not "add blue to a Tailwind template."

Typography: **Fraunces** (serif, headings — carries personality), **Inter** or **IBM Plex Sans** (body/UI), **IBM Plex Mono** (data values only — tabular figures, not decorative).

Motion principles: panels slide in with a spring easing (not linear), charts animate their bars/lines in on mount, hover states are subtle (opacity/border shifts, not big scale jumps), page transitions fade+slide slightly rather than hard-cutting.

Set all colors as CSS variables on `:root` so shadcn's theming system picks them up — don't hardcode hex values in components.

---

## 3. Project structure

```
src/
  components/
    ui/            <- shadcn components live here (generated via shadcn CLI)
    charts/        <- Recharts wrapper components (BarChartCard, DonutChartCard, etc.)
    layout/         <- Topbar, Sidebar, PageShell
  pages/
    Home.tsx
    Clean.tsx
    Analyze.tsx
    Report.tsx
  data/
    mockDataset.ts  <- the Grab Food demo data, typed
  lib/
    utils.ts
  App.tsx           <- router setup
  main.tsx
```

---

## 4. Reference data (reuse this — don't let Claude Code invent new numbers)

```ts
// Dataset: grab_food_orders_march.csv (fictional/illustrative)
// 12,480 rows before cleaning -> 12,419 after

export const qualityDimensions = [
  { name: 'Completeness', score: 92, ok: false, note: '8.4% missing in driver_rating' },
  { name: 'Uniqueness',   score: 99, ok: true,  note: '61 near-duplicate rows found' },
  { name: 'Validity',     score: 99, ok: true,  note: '2 rows with malformed timestamps' },
  { name: 'Accuracy',     score: 96, ok: true,  note: '14 delivery-time outliers flagged' },
  { name: 'Consistency',  score: 88, ok: false, note: '"Lucky Burger" written 3 ways' },
  { name: 'Timeliness',   score: 100, ok: true, note: 'Most recent record: 2 days ago' },
];

export const topRestaurants = [
  { name: 'Lucky Burger', revenue: 41200 },
  { name: 'Pho House', revenue: 34900 },
  { name: 'Bayon Fry', revenue: 28700 },
  { name: 'Green Salad Co', revenue: 19800 },
  { name: 'Khmer Grill', revenue: 12400 },
];

export const ordersByArea = [
  { area: 'BKK1', orders: 4340 },
  { area: 'Toul Kork', orders: 3120 },
  { area: 'Chamkarmon', orders: 2480 },
  { area: 'Sen Sok', orders: 1890 },
  { area: 'Daun Penh', orders: 589 },
];

export const deliveryTrend = [
  { day: 'Mon', minutes: 24 }, { day: 'Tue', minutes: 26 }, { day: 'Wed', minutes: 25 },
  { day: 'Thu', minutes: 27 }, { day: 'Fri', minutes: 29 }, { day: 'Sat', minutes: 34 },
  { day: 'Sun', minutes: 31 },
];

export const cancellationByArea = [
  { area: 'BKK1', rate: 3.1 }, { area: 'Toul Kork', rate: 5.4 }, { area: 'Chamkarmon', rate: 4.8 },
  { area: 'Sen Sok', rate: 9.8 }, { area: 'Daun Penh', rate: 4.2 },
];

export const kpis = { gmv: 284120, orders: 12419, avgDeliveryMin: 27.4, cancellationRate: 6.1 };

// For the dataset overview / profile table on the Clean page
export const datasetOverview = {
  name: 'grab_food_orders_march.csv',
  description: 'Order-level delivery records for Grab Food, Phnom Penh, March 2026. Each row is one order, covering the restaurant, order value, delivery time, driver rating, customer area, payment method, and status.',
  rowCount: 12480,
  columnCount: 9,
  columns: [
    { name: 'order_id', type: 'string', nonNull: '100%', unique: 12480, note: 'Unique identifier' },
    { name: 'restaurant_name', type: 'string', nonNull: '100%', unique: 47, note: '3 spelling variants found' },
    { name: 'order_value', type: 'number', nonNull: '100%', unique: '—', note: 'Mean $22.80, right-skewed' },
    { name: 'delivery_time_mins', type: 'number', nonNull: '100%', unique: '—', note: 'Mean 27.4, 14 outliers' },
    { name: 'driver_rating', type: 'number (1-5)', nonNull: '91.6%', unique: '—', note: '8.4% missing, MAR' },
    { name: 'customer_area', type: 'string', nonNull: '100%', unique: 5, note: 'Phnom Penh districts' },
    { name: 'payment_method', type: 'string', nonNull: '100%', unique: 3, note: 'Card / Cash / Wallet' },
    { name: 'order_timestamp', type: 'datetime', nonNull: '99.98%', unique: '—', note: '2 malformed rows' },
    { name: 'status', type: 'string', nonNull: '100%', unique: 2, note: 'Completed / Cancelled' },
  ],
};

// Box plot data for delivery_time_mins (Accuracy / outlier detection)
export const deliveryTimeBoxplot = {
  min: 8, q1: 19, median: 25, q3: 33, max: 58,
  outliers: [61, 64, 67, 71, 73, 78, 82, 85, 88, 91, 95, 99, 103, 110],
};
```

---

## 5. Build prompts — use in order with Claude Code / Antigravity

### Prompt 0 — Scaffold + design system

```
Set up a new Vite + React + TypeScript project. Then:

1. Install and configure Tailwind CSS
2. Initialize shadcn/ui (run its init command) and add these components:
   button, card, sheet, tabs, accordion, input, select, badge, separator, table
3. Install: recharts, react-grid-layout, framer-motion, lucide-react, react-router-dom
4. Set up the design system as CSS variables in the global stylesheet, using
   these exact values: [paste the color block from Section 2 of this doc]
5. Load Fraunces, Inter, and IBM Plex Mono from Google Fonts. Fraunces for
   headings, Inter for body text, IBM Plex Mono ONLY for numeric data values
   (not decorative use)
6. Set up React Router with four empty routed pages: Home, Clean, Analyze, Report
7. Create src/data/mockDataset.ts with exactly this data: [paste Section 4 in full]
8. Create a CLAUDE.md file at the project root with: the tech stack list, the
   design token values, the project folder structure, a one-line reminder that
   mock data lives in src/data/mockDataset.ts and should not be reinvented, and
   an empty "## Build Log" section at the bottom for future session notes

Do not build any page content yet — this step is scaffold and design tokens only.
Show me the project running with four empty routed pages before we continue.
```

**Verify before continuing:** `npm run dev` works, all four routes navigate, fonts load, Tailwind + shadcn components are available, `CLAUDE.md` exists at the project root and reads back correctly.

---

### Prompt 1 — Home screen

```
Context: read CLAUDE.md first for the design tokens and project structure.

Build the Home page. Minimalist, confident, product-like — no hackathon
branding, no "imagine this scenario" framing, minimal copy. This should read
like the landing page of a real, already-shipped SaaS product.

Content, in order:
1. A short nav bar: logo/wordmark "ReFair" on the left, nothing cluttered on
   the right (maybe just a single "Get started" button)
2. A slogan section: one short, confident headline in Fraunces (something
   like "Clean data. Clear insight." or similarly tight — write 2-3 options
   and pick the strongest), and a single-sentence subhead in Inter. No
   paragraph-length copy.
3. A "How it works" section: 3 simple steps shown horizontally with icons —
   Upload, Clean, Analyze — each with a 3-5 word label and one short line,
   not a paragraph
4. A tools section: two cards, "Clean" and "Analyze," each minimal — an
   icon, a short title, one line of description, and a "→" link. These link
   to /clean and /analyze respectively.
5. A minimal footer

Use generous whitespace. Do not use a badge, tag, or callout box. Do not
mention a hackathon, a company scenario, or "imagine you're a business
analyst" anywhere on this page — keep all of that out of the UI copy
entirely. This page should look like it could be on Stripe's or Linear's
website in terms of restraint and confidence, adapted to the blue color
system from the global stylesheet.
```

---

### Prompt 2 — Clean screen

```
Context: read CLAUDE.md first, including the Build Log for what's already built.

Build the Clean page. This has three sections in the overview state, plus a
separate completed (before/after) state — build all of it.

SECTION 1 — Dataset overview (new, goes above the quality cards):
- Use datasetOverview from mockDataset.ts
- Show the dataset name, the plain-English description, and rowCount/columnCount
  as small stats
- Below that, a profile table (like a pandas .describe() / data-profiling
  output) listing every column: name, type, % non-null, unique count, and a
  short note — use datasetOverview.columns. Use a clean shadcn Table
  component, with the type shown as a small Badge (different color per type:
  string/number/datetime)
- This section establishes "what this data actually is" before any quality
  scoring happens — a reader should understand the dataset's shape and
  subject matter just from this section

SECTION 2 — Data quality report:
- The 6-dimension grid as before (qualityDimensions), each a shadcn
  Accordion that expands to show a Recharts visualization + reasoning + 
  Confirm/Edit buttons
- For the Accuracy/outlier dimension specifically: build an actual BOX PLOT
  (min, Q1, median, Q3, max, with individual outlier points plotted beyond
  the whiskers) using deliveryTimeBoxplot from mockDataset.ts. Recharts
  doesn't have a built-in box plot type — build one using a ComposedChart
  (a Bar for the Q1-Q3 box, Line/ErrorBar for the whiskers, Scatter for the
  individual outlier points) or a small custom SVG component if that's
  cleaner. Label the axis in minutes. This is a real statistical chart, not
  a histogram — get the box plot shape right (box = IQR, whiskers = min/max
  within 1.5xIQR, dots = outliers beyond that)
- For Completeness: a horizontal stacked bar showing missingness split by
  order status (completed vs cancelled), as before
- For Consistency: a simple before/after value comparison (small bar
  showing row counts per spelling variant, collapsing into one bar after
  the fix)
- Below the grid: the plain-English summary card, then "Confirm all
  recommended fixes"

SECTION 3 — Completed (before/after) state, shown after confirming:
- A before/after comparison that includes ACTUAL CHARTS, not just a text
  table. Specifically: a paired/grouped bar chart showing before vs after
  values side-by-side for: missing driver_rating count, duplicate row count,
  restaurant name variant count — so the improvement is visually obvious at
  a glance, not just read as numbers
- Keep the text change log below the chart as supporting detail
- "Download cleaned CSV" and "Continue to Analyze →" buttons

Use real Recharts components throughout — the box plot is the one exception
that needs custom construction since Recharts has no native box plot type.
```

---

### Prompt 3 — Analyze screen (the centerpiece — spend the most effort here)

```
Context: read CLAUDE.md first, including the Build Log.

Build the Analyze page. This is the most important screen — reference a real
BI dashboard editor (Databox/Klipfolio-style): a KPI strip, a draggable/
resizable chart grid, a chart settings panel, and a chat sidebar.

Layout:
- A toolbar at the top: dashboard title ("Grab Food · March performance"),
  and decorative icon buttons (Settings, Theme, Filters, Data) on the left,
  "Saving..." indicator + Present + Share buttons on the right (these can be
  non-functional, just visually present)
- KPI strip: 4 cards using the kpis object (GMV, Orders, Avg delivery time,
  Cancellation rate), each with a small icon badge
- The main chart grid, built with react-grid-layout, draggable AND resizable
  (real functionality, not simulated) containing 4 chart cards using
  topRestaurants (bar), ordersByArea (donut/pie), deliveryTrend (line),
  cancellationByArea (bar) — all rendered with Recharts, with smooth mount
  animation
- Each chart card has a gear/settings icon in its header. Clicking it opens
  a shadcn Sheet (slide-out panel from the right) with: an editable chart
  title (Input), a chart type picker (a grid of buttons: Bar / Line / Donut /
  Table, each with an icon, using shadcn's toggle/button group pattern), and
  Save/Cancel buttons. Changing the chart type should genuinely re-render
  that specific chart using the SAME underlying data in the new visual form
  (bar data can become a line, a donut, or a table — write a generic
  chart-type-switch function that takes {categories, values} and a type, and
  returns the right Recharts component)
- A "+ Add chart" card in the grid that adds a new chart (use a
  payment-method-split dataset: Card 6800, Cash 3600, Wallet 2019)
- A small color palette switcher (4-5 preset swatches) that recolors the
  single-series charts (bar/line) live
- A chat panel on the right (or as a tab alongside the settings Sheet — your
  call on which layout reads cleaner): styled like a real assistant panel,
  with 2 pre-scripted Q&A exchanges visible on load ("Why are delivery times
  worse in Sen Sok?" / answer referencing the deliveryTrend and
  cancellationByArea data), two clickable suggested-question chips, and a
  text input that accepts a typed question and returns a generic scripted
  fallback response with a short typing-indicator delay (Framer Motion) for
  realism

This is the screen that most needs to look like real, polished software —
take your time on spacing, animation timing, and making the drag/resize feel
genuinely smooth, not janky.
```

---

### Prompt 4 — Report screen

```
Context: read CLAUDE.md first, including the Build Log.

Build the Report page: an auto-generated-looking report combining the
cleaning results and analysis insights.

- A dark (--ink background) cover section with a badge ("Auto-generated
  report"), title, and dataset name
- Sections (each a card): Executive summary, "What we cleaned and why" (a
  list pulling from the Clean page's change log), Key findings (referencing
  topRestaurants, ordersByArea, deliveryTrend, cancellationByArea insights,
  laid out in a two-column grid), a small stat row (the 4 KPIs again, smaller),
  and a Recommendation section
- "Download PDF" (secondary) and "Back to home" (primary) buttons at the bottom

Keep this page calmer/less busy than Analyze — it's meant to read like a
finished document, not an interactive tool.
```

---

### Prompt 5 — Polish pass (do this last, after all 4 screens work)

```
Context: read CLAUDE.md first, including the full Build Log.

Do a global polish pass across all four pages:

1. Add page transition animation on route change (Framer Motion
   AnimatePresence — fade + slight slide, ~200ms)
2. Check responsive behavior at a laptop width (1280px) and a smaller
   window (900px) — the Analyze grid especially needs to reflow sensibly
3. Add subtle loading states where data "loads" (a brief skeleton or fade-in
   on each page mount) so nothing pops in abruptly
4. Do a full pass checking hover/focus states on every interactive element
   are present and consistent
5. Double check the color/type tokens from Section 2 are used consistently
   everywhere — no stray default Tailwind colors slipping in

This is a refinement pass — don't restructure anything, just tighten what's
already built.
```

---

## 6. Running and presenting it

**After every prompt above:** tell Claude Code to append a short entry to `CLAUDE.md`'s Build Log — what was built, any decision worth remembering — before you move to the next prompt. This is what keeps a later session (or a fresh one, if context gets confused) grounded in what already exists instead of guessing or rebuilding.

**Local development:** `npm install && npm run dev` — runs at `localhost:5173` by default.

**For the actual pitch:** don't present from `localhost`. Build a production bundle (`npm run build`) and deploy it — Vercel or Netlify both offer a free tier and a one-command deploy from a Vite project, giving you a real `https://` URL instead of localhost. A real URL reads as more credible to judges than a local dev server, and protects you if anything's flaky with your laptop on stage (you can pull it up on a phone as backup).

**If you get stuck or a session's context gets confused:** the same rule as before — start a fresh Claude Code/Antigravity session and open with "read this build plan doc first," rather than trying to push through a confused session.

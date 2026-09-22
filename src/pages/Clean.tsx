import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CheckCircle2, Download } from 'lucide-react'
import { type CSSProperties, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CleaningImpactChart } from '@/components/charts/CleaningImpactChart'
import { CompletenessBar } from '@/components/charts/CompletenessBar'
import { ConsistencyBar } from '@/components/charts/ConsistencyBar'
import { DeliveryBoxPlot } from '@/components/charts/DeliveryBoxPlot'
import { ScoreBar } from '@/components/charts/ScoreBar'
import { changeLog, datasetOverview, qualityDimensions } from '@/data/mockDataset'

type DimensionName = (typeof qualityDimensions)[number]['name']

const dimensionDetails: Record<DimensionName, { reasoning: string; fix: string }> = {
  Completeness: {
    reasoning:
      '8.4% of rows are missing a driver_rating. Missing ratings concentrate in cancelled orders, where a trip is often never completed to leave feedback.',
    fix: 'Leave driver_rating null for cancelled orders (expected), and flag the remaining gaps in completed orders for backfill.',
  },
  Uniqueness: {
    reasoning:
      '61 rows are near-duplicates of another order — same restaurant, value, and timestamp within a few seconds, most likely retried submissions.',
    fix: 'Drop the duplicate rows, keeping the first occurrence of each order.',
  },
  Validity: {
    reasoning: "2 rows have an order_timestamp that doesn't parse as a valid date, likely a formatting error at ingestion.",
    fix: 'Re-parse the 2 malformed timestamps against the known export format.',
  },
  Accuracy: {
    reasoning:
      '14 orders have a delivery time far outside the normal range (beyond 1.5× the interquartile range) — likely logging errors rather than real 60–110 minute deliveries.',
    fix: 'Flag the 14 outliers for review rather than deleting them outright, since some may be legitimate long-tail deliveries.',
  },
  Consistency: {
    reasoning:
      'Lucky Burger appears under 3 different spellings and casings, which would undercount its true order volume in any restaurant-level rollup.',
    fix: 'Merge the 3 spelling variants into a single canonical restaurant_name.',
  },
  Timeliness: {
    reasoning: 'The most recent order in the dataset is 2 days old, well within the expected refresh window.',
    fix: 'No fix needed — the data is current.',
  },
}

function typeBadgeStyle(type: string): CSSProperties {
  if (type.startsWith('string')) {
    return { backgroundColor: 'color-mix(in srgb, var(--sky) 18%, white)', color: 'var(--blue)' }
  }
  if (type.startsWith('number')) {
    return { backgroundColor: 'color-mix(in srgb, var(--blue) 14%, white)', color: 'var(--blue)' }
  }
  return { backgroundColor: 'color-mix(in srgb, var(--sage) 18%, white)', color: 'var(--sage)' }
}

const customChartDimensions = new Set<DimensionName>(['Completeness', 'Accuracy', 'Consistency'])

function DimensionChart({ name }: { name: DimensionName }) {
  switch (name) {
    case 'Completeness':
      return <CompletenessBar />
    case 'Accuracy':
      return <DeliveryBoxPlot />
    case 'Consistency':
      return <ConsistencyBar />
    default:
      return null
  }
}

function downloadCleanedProfile() {
  const rows = [
    ['column', 'type', 'non_null', 'unique', 'note'],
    ...datasetOverview.columns.map((c) => [c.name, c.type, c.nonNull, String(c.unique), c.note]),
    [],
    ['change_log'],
    ...changeLog.map((entry) => [entry]),
  ]
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'grab_food_orders_march_cleaned_profile.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Clean() {
  const [confirmed, setConfirmed] = useState<Set<DimensionName>>(new Set())
  const [completed, setCompleted] = useState(false)

  const toggleConfirmed = (name: DimensionName) => {
    setConfirmed((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const confirmAll = () => {
    setConfirmed(new Set(qualityDimensions.map((d) => d.name)))
    setCompleted(true)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-heading text-xl font-semibold tracking-tight text-foreground">
            ReFair
          </Link>
          <Link to="/analyze" className="text-sm text-muted-foreground hover:text-foreground">
            Skip to Analyze →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-16 px-6 py-12">
        {/* Section 1 — Dataset overview */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-heading text-3xl font-medium text-foreground">Dataset overview</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{datasetOverview.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {[
              { label: 'Dataset', value: datasetOverview.name, mono: false },
              { label: 'Rows', value: datasetOverview.rowCount.toLocaleString(), mono: true },
              { label: 'Columns', value: String(datasetOverview.columnCount), mono: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
              >
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`mt-1 text-sm text-foreground ${stat.mono ? 'font-mono' : 'font-medium'}`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <Table>
              <TableHeader className="[&_tr]:bg-muted/50">
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="h-11 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">Column</TableHead>
                  <TableHead className="h-11 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">Type</TableHead>
                  <TableHead className="h-11 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">Non-null</TableHead>
                  <TableHead className="h-11 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">Unique</TableHead>
                  <TableHead className="h-11 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasetOverview.columns.map((col) => (
                  <TableRow key={col.name} className="border-border/70">
                    <TableCell className="px-4 py-2.5 font-medium text-foreground">{col.name}</TableCell>
                    <TableCell className="px-4 py-2.5">
                      <Badge variant="outline" className="border-transparent" style={typeBadgeStyle(col.type)}>
                        {col.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-2.5 font-mono text-xs">{col.nonNull}</TableCell>
                    <TableCell className="px-4 py-2.5 font-mono text-xs">
                      {typeof col.unique === 'number' ? col.unique.toLocaleString() : col.unique}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 whitespace-normal text-muted-foreground">{col.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </motion.section>

        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.section
              key="quality-report"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-heading text-2xl font-medium text-foreground">Data quality report</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Six dimensions were checked automatically. Expand any dimension to see the evidence and recommended fix.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {qualityDimensions.map((dimension, i) => {
                  const detail = dimensionDetails[dimension.name]
                  const isConfirmed = confirmed.has(dimension.name)
                  const accent = dimension.ok ? 'var(--sage)' : 'var(--brick)'
                  const tint = `color-mix(in srgb, ${accent} 14%, white)`
                  const StatusIcon = dimension.ok ? CheckCircle2 : AlertTriangle
                  return (
                    <motion.div
                      key={dimension.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Card className="h-full min-h-[188px] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/25">
                        <CardContent>
                          <Accordion>
                            <AccordionItem value={dimension.name} className="border-b-0">
                              <AccordionTrigger className="items-start pt-0 hover:no-underline">
                                <div className="flex min-w-0 flex-1 flex-col gap-3.5 pr-3">
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg"
                                      style={{ backgroundColor: tint, color: accent }}
                                    >
                                      <StatusIcon className="size-4" strokeWidth={2} />
                                    </span>
                                    <span className="truncate font-heading text-base font-medium text-foreground">
                                      {dimension.name}
                                    </span>
                                  </div>

                                  <div>
                                    <div className="flex items-baseline justify-between gap-2">
                                      <span
                                        className="font-mono text-2xl leading-none tabular-nums"
                                        style={{ color: accent }}
                                      >
                                        {dimension.score}%
                                      </span>
                                      <span
                                        className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                                        style={{ backgroundColor: tint, color: accent }}
                                      >
                                        {isConfirmed ? 'Confirmed' : dimension.ok ? 'Healthy' : 'Flagged'}
                                      </span>
                                    </div>
                                    <ScoreBar score={dimension.score} ok={dimension.ok} className="mt-3" />
                                  </div>

                                  <span className="line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed font-normal text-muted-foreground">
                                    {dimension.note}
                                  </span>
                                </div>
                              </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-1">
                                {customChartDimensions.has(dimension.name) && (
                                  <DimensionChart name={dimension.name} />
                                )}
                                <p className="text-sm leading-relaxed text-muted-foreground">{detail.reasoning}</p>
                                <p className="rounded-md bg-muted px-3 py-2 text-sm text-foreground">
                                  <span className="font-medium">Recommended fix: </span>
                                  {detail.fix}
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant={isConfirmed ? 'secondary' : 'default'}
                                    onClick={() => toggleConfirmed(dimension.name)}
                                  >
                                    {isConfirmed ? 'Confirmed' : 'Confirm'}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setConfirmed((prev) => {
                                    const next = new Set(prev)
                                    next.delete(dimension.name)
                                    return next
                                  })}>
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This dataset is in good shape overall. The main issues are duplicate rows, inconsistent restaurant
                    naming, and a handful of missing driver ratings and malformed timestamps — all straightforward to
                    fix automatically. A small number of delivery-time outliers are flagged for review rather than
                    removed, since they may be legitimate.
                  </p>
                  <Separator className="my-4" />
                  <Button onClick={confirmAll}>Confirm all recommended fixes</Button>
                </CardContent>
              </Card>
            </motion.section>
          ) : (
            <motion.section
              key="completed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-heading text-2xl font-medium text-foreground">Cleaning complete</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {datasetOverview.rowCount.toLocaleString()} rows in, {(datasetOverview.rowCount - 61).toLocaleString()}{' '}
                rows out — here's what changed.
              </p>

              <Card className="mt-6">
                <CardContent>
                  <CleaningImpactChart />
                  <Separator className="my-4" />
                  <ul className="space-y-2">
                    {changeLog.map((entry) => (
                      <li key={entry} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--sage)]" />
                        {entry}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={downloadCleanedProfile}>
                  <Download className="size-4" />
                  Download cleaned CSV
                </Button>
                <Button render={<Link to="/analyze" />} nativeButton={false}>
                  Continue to Analyze
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

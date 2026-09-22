import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Clock, DollarSign, Download, FileText, ShoppingBag, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  cancellationByArea,
  changeLog,
  datasetOverview,
  deliveryTrend,
  kpis,
  ordersByArea,
  qualityDimensions,
  topRestaurants,
} from '@/data/mockDataset'
import logoFull from '@/assets/logo-full.png'

const overallScore = Math.round(
  qualityDimensions.reduce((sum, d) => sum + d.score, 0) / qualityDimensions.length,
)
const flaggedDimensions = qualityDimensions.filter((d) => !d.ok)

const topRestaurant = topRestaurants[0]
const secondRestaurant = topRestaurants[1]
const restaurantLead = Math.round(((topRestaurant.revenue - secondRestaurant.revenue) / secondRestaurant.revenue) * 100)

const topArea = ordersByArea[0]
const secondArea = ordersByArea[1]
const totalOrders = ordersByArea.reduce((sum, a) => sum + a.orders, 0)
const topAreaShare = Math.round((topArea.orders / totalOrders) * 100)
const topAreaLead = Math.round(((topArea.orders - secondArea.orders) / secondArea.orders) * 100)

const deliveryPeak = deliveryTrend.reduce((max, d) => (d.minutes > max.minutes ? d : max), deliveryTrend[0])
const deliveryStart = deliveryTrend[0]
const deliveryIncrease = Math.round(((deliveryPeak.minutes - deliveryStart.minutes) / deliveryStart.minutes) * 100)

const worstArea = cancellationByArea.reduce((max, a) => (a.rate > max.rate ? a : max), cancellationByArea[0])
const cancellationLift = Math.round(((worstArea.rate - kpis.cancellationRate) / kpis.cancellationRate) * 100)

const keyFindings = [
  {
    icon: ShoppingBag,
    label: 'Revenue leader',
    headline: `${topRestaurant.name} — $${topRestaurant.revenue.toLocaleString()}`,
    body: `${topRestaurant.name} leads all restaurants in revenue, ${restaurantLead}% ahead of ${secondRestaurant.name}, the next-highest performer.`,
  },
  {
    icon: DollarSign,
    label: 'Order concentration',
    headline: `${topArea.area} — ${topAreaShare}% of orders`,
    body: `${topArea.area} accounts for ${topArea.orders.toLocaleString()} orders, ${topAreaShare}% of the citywide total and ${topAreaLead}% more than ${secondArea.area}, the next-largest area.`,
  },
  {
    icon: Clock,
    label: 'Weekend slowdown',
    headline: `${deliveryPeak.minutes} min peak on ${deliveryPeak.day}`,
    body: `Delivery times climb through the week, peaking at ${deliveryPeak.minutes} minutes on ${deliveryPeak.day} — ${deliveryIncrease}% slower than ${deliveryStart.day}'s ${deliveryStart.minutes}-minute average.`,
  },
  {
    icon: XCircle,
    label: 'Cancellation outlier',
    headline: `${worstArea.area} — ${worstArea.rate}% cancellation rate`,
    body: `${worstArea.area} cancels at ${worstArea.rate}%, ${cancellationLift}% above the ${kpis.cancellationRate}% citywide average and the highest of any area.`,
  },
]

const statRow = [
  { label: 'GMV', value: kpis.gmv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
  { label: 'Orders', value: kpis.orders.toLocaleString() },
  { label: 'Avg delivery time', value: `${kpis.avgDeliveryMin} min` },
  { label: 'Cancellation rate', value: `${kpis.cancellationRate}%` },
]

const recommendations = [
  `Investigate the elevated cancellation rate in ${worstArea.area} (${worstArea.rate}% vs. ${kpis.cancellationRate}% citywide) — likely a driver or restaurant capacity gap worth a closer look.`,
  `Add delivery capacity on Fri–Sat to offset the weekend slowdown, when times run ${deliveryIncrease}% above the Monday baseline.`,
  `Double down on ${topArea.area} and ${topRestaurant.name} with targeted promotions — they represent the largest concentration of orders and revenue.`,
  'Backfill driver_rating for completed orders where it’s still missing, to sharpen quality scoring in the next refresh.',
]

function handleDownloadPdf() {
  window.print()
}

export default function Report() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
            <img src={logoFull} alt="ReFair" className="h-8 w-auto" />
          </Link>
          <Link to="/analyze" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Analyze
          </Link>
        </div>
      </header>

      {/* Cover */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-[var(--ink)] px-6 py-24 text-center shadow-[0_24px_48px_-28px_rgba(16,27,51,0.45)]"
      >
        <div className="mx-auto max-w-2xl">
          <Badge className="border-white/15 bg-white/10 text-white">
            <FileText className="size-3" />
            Auto-generated report
          </Badge>
          <h1 className="mt-6 font-heading text-4xl font-medium text-balance text-white md:text-5xl">
            Grab Food — March 2026 Performance Report
          </h1>
          <p className="mt-4 text-white/60">{datasetOverview.name}</p>
          <p className="mt-1 font-mono text-xs text-white/35">
            {datasetOverview.rowCount.toLocaleString()} rows analyzed · quality score {overallScore}%
          </p>
        </div>
      </motion.section>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        {/* Executive summary */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Executive summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {datasetOverview.rowCount.toLocaleString()} orders from {datasetOverview.name} were profiled, cleaned, and
                analyzed automatically. Data quality came out to {overallScore}% overall, with{' '}
                {flaggedDimensions.length} of {qualityDimensions.length} dimensions flagged for minor issues — all
                resolved or reviewed before analysis. The business did ${kpis.gmv.toLocaleString()} in GMV across{' '}
                {kpis.orders.toLocaleString()} orders, at a {kpis.avgDeliveryMin}-minute average delivery time and{' '}
                {kpis.cancellationRate}% cancellation rate. {topRestaurant.name} and {topArea.area} lead revenue and
                order volume respectively, while weekend delivery times and {worstArea.area}'s cancellation rate stand
                out as the areas most worth addressing.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* What we cleaned and why */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>What we cleaned and why</CardTitle>
            </CardHeader>
            <CardContent>
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
        </motion.div>

        {/* Key findings */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Key findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {keyFindings.map((finding) => (
                  <div
                    key={finding.label}
                    className="rounded-lg border border-border bg-card p-4 shadow-sm ring-1 ring-foreground/10 transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-7 items-center justify-center rounded-md bg-accent text-primary">
                        <finding.icon className="size-4" strokeWidth={1.75} />
                      </span>
                      <p className="text-xs text-muted-foreground">{finding.label}</p>
                    </div>
                    <p className="mt-2 font-mono text-sm text-foreground">{finding.headline}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{finding.body}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stat row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statRow.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm ring-1 ring-foreground/10 transition-shadow duration-200 hover:shadow-md"
              >
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 font-mono text-base text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((rec) => (
                  <li key={rec} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-center gap-3 pb-4 print:hidden">
          <Button variant="secondary" onClick={handleDownloadPdf}>
            <Download className="size-4" />
            Download PDF
          </Button>
          <Button render={<Link to="/" />} nativeButton={false}>
            Back to home
          </Button>
        </div>
      </main>
    </div>
  )
}

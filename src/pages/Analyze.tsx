import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Database,
  DollarSign,
  FileBarChart,
  Plus,
  Settings,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  SunMoon,
  XCircle,
} from 'lucide-react'
import { type Layout, GridLayout, useContainerWidth } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChartCard, type ChartConfig } from '@/components/analyze/ChartCard'
import { ChatPanel } from '@/components/analyze/ChatPanel'
import { SINGLE_SERIES_PALETTE } from '@/components/charts/GenericChart'
import { Button } from '@/components/ui/button'
import { cancellationByArea, deliveryTrend, kpis, ordersByArea, topRestaurants } from '@/data/mockDataset'

const initialCharts: ChartConfig[] = [
  {
    id: 'top-restaurants',
    title: 'Top restaurants by revenue',
    type: 'bar',
    categories: topRestaurants.map((r) => r.name),
    values: topRestaurants.map((r) => r.revenue),
    valueFormatter: (v) => `$${v.toLocaleString()}`,
    valueLabel: 'Total Revenue',
    xAxisColumn: 'restaurant_name',
    xAxisLabel: 'Restaurant',
  },
  {
    id: 'orders-by-area',
    title: 'Orders by area',
    type: 'donut',
    categories: ordersByArea.map((a) => a.area),
    values: ordersByArea.map((a) => a.orders),
    valueFormatter: (v) => v.toLocaleString(),
    valueLabel: 'Orders',
    xAxisColumn: 'customer_area',
    xAxisLabel: 'Area',
  },
  {
    id: 'delivery-trend',
    title: 'Delivery time trend',
    type: 'line',
    categories: deliveryTrend.map((d) => d.day),
    values: deliveryTrend.map((d) => d.minutes),
    valueFormatter: (v) => `${v} min`,
    valueLabel: 'Avg Delivery Time (min)',
    xAxisColumn: 'order_timestamp',
    xAxisLabel: 'Day',
  },
  {
    id: 'cancellation-by-area',
    title: 'Cancellation rate by area',
    type: 'bar',
    categories: cancellationByArea.map((a) => a.area),
    values: cancellationByArea.map((a) => a.rate),
    valueFormatter: (v) => `${v}%`,
    valueLabel: 'Cancellation Rate',
    xAxisColumn: 'customer_area',
    xAxisLabel: 'Area',
  },
]

const initialLayout: Layout = [
  { i: 'top-restaurants', x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
  { i: 'orders-by-area', x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
  { i: 'delivery-trend', x: 0, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
  { i: 'cancellation-by-area', x: 6, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
  { i: 'add-chart', x: 0, y: 8, w: 6, h: 4, static: true, isResizable: false },
]

const kpiCards = [
  { label: 'GMV', value: kpis.gmv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), icon: DollarSign },
  { label: 'Orders', value: kpis.orders.toLocaleString(), icon: ShoppingBag },
  { label: 'Avg delivery time', value: `${kpis.avgDeliveryMin} min`, icon: Clock },
  { label: 'Cancellation rate', value: `${kpis.cancellationRate}%`, icon: XCircle },
]

const toolbarIcons = [
  { icon: Settings, label: 'Settings' },
  { icon: SunMoon, label: 'Theme' },
  { icon: SlidersHorizontal, label: 'Filters' },
  { icon: Database, label: 'Data' },
]

export default function Analyze() {
  const { width, containerRef } = useContainerWidth()
  const [charts, setCharts] = useState<ChartConfig[]>(initialCharts)
  const [layout, setLayout] = useState<Layout>(initialLayout)
  const [colorIndex, setColorIndex] = useState(0)

  const activeColor = SINGLE_SERIES_PALETTE[colorIndex].value

  const updateChart = (
    id: string,
    updates: Partial<Pick<ChartConfig, 'title' | 'type' | 'xAxisColumn' | 'xAxisLabel'>>,
  ) => {
    setCharts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const addPaymentMethodChart = () => {
    const newId = `payment-method-${Date.now()}`
    setCharts((prev) => [
      ...prev,
      {
        id: newId,
        title: 'Payment method split',
        type: 'donut',
        categories: ['Card', 'Cash', 'Wallet'],
        values: [6800, 3600, 2019],
        valueFormatter: (v) => v.toLocaleString(),
        valueLabel: 'Orders',
        xAxisColumn: 'payment_method',
        xAxisLabel: 'Payment method',
      },
    ])
    setLayout((prev) => {
      const addChartItem = prev.find((item) => item.i === 'add-chart')!
      const others = prev.filter((item) => item.i !== 'add-chart')
      return [
        ...others,
        { i: newId, x: addChartItem.x, y: addChartItem.y, w: 6, h: 4, minW: 3, minH: 3 },
        { ...addChartItem, y: addChartItem.y + 4 },
      ]
    })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" render={<Link to="/" />} nativeButton={false}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <h1 className="border-l border-border pl-3 font-heading text-lg font-medium text-foreground">
            Grab Food · March performance
          </h1>
          <div className="ml-2 flex items-center gap-0.5 border-l border-border pl-3">
            {toolbarIcons.map((item) => (
              <Button key={item.label} variant="ghost" size="icon-sm" title={item.label}>
                <item.icon className="size-4" />
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <motion.span
              className="size-1.5 rounded-full bg-[var(--sage)]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
            />
            Saving…
          </span>
          <Button variant="outline" size="sm" render={<Link to="/report" />} nativeButton={false}>
            <FileBarChart className="size-3.5" />
            View Report
          </Button>
          <Button size="sm">
            <Share2 className="size-3.5" />
            Share
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Main content */}
        <div className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-7 items-center justify-center rounded-md bg-accent text-primary">
                    <kpi.icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
                <p className="mt-2 font-mono text-xl text-foreground">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Chart grid header + palette switcher */}
          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium text-foreground">Charts</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Chart color</span>
              {SINGLE_SERIES_PALETTE.map((swatch, i) => (
                <button
                  key={swatch.name}
                  type="button"
                  title={swatch.name}
                  onClick={() => setColorIndex(i)}
                  className="size-5 rounded-full ring-offset-2 ring-offset-background transition-shadow"
                  style={{
                    backgroundColor: swatch.value,
                    boxShadow: colorIndex === i ? `0 0 0 2px ${swatch.value}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div ref={containerRef} className="mt-4">
            <GridLayout
              layout={layout}
              onLayoutChange={setLayout}
              width={width}
              gridConfig={{ cols: 12, rowHeight: 70, margin: [16, 16], containerPadding: [0, 0], maxRows: Infinity }}
              dragConfig={{ handle: '.card-drag-handle', cancel: '.no-drag' }}
              resizeConfig={{ handles: ['se'] }}
            >
              {charts.map((chart) => (
                <div key={chart.id}>
                  <ChartCard config={chart} color={activeColor} onUpdate={updateChart} />
                </div>
              ))}
              <div key="add-chart">
                <button
                  type="button"
                  onClick={addPaymentMethodChart}
                  className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Plus className="size-5" />
                  <span className="text-sm font-medium">Add chart</span>
                </button>
              </div>
            </GridLayout>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-[340px] shrink-0">
          <ChatPanel />
        </div>
      </div>
    </div>
  )
}

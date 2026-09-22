import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'combo' | 'horizontalBar' | 'table'

export interface ChartTypeSwitchInput {
  categories: string[]
  values: number[]
}

export const DONUT_PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export const SINGLE_SERIES_PALETTE = [
  { name: 'Blue', value: 'var(--blue)' },
  { name: 'Sky', value: 'var(--sky)' },
  { name: 'Sage', value: 'var(--sage)' },
  { name: 'Brick', value: 'var(--brick)' },
  { name: 'Steel', value: 'var(--steel)' },
]

const tooltipStyle = { fontSize: 12, borderColor: 'var(--line)', borderRadius: 8 }
const axisTick = { fontSize: 11, fill: 'var(--steel)' }

/**
 * Generic chart-type switch: takes the same {categories, values} data and
 * renders whichever Recharts visualization the caller asks for, so changing
 * a chart's type re-renders the same underlying data in a new visual form.
 */
export function renderChartByType(
  { categories, values }: ChartTypeSwitchInput,
  type: ChartType,
  color: string,
  valueFormatter: (value: number) => string = (v) => v.toLocaleString(),
) {
  const data = categories.map((category, i) => ({ category, value: values[i] }))

  switch (type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
            <XAxis dataKey="category" tick={axisTick} interval={0} angle={data.length > 4 ? -20 : 0} textAnchor={data.length > 4 ? 'end' : 'middle'} height={data.length > 4 ? 40 : 24} />
            <YAxis tick={axisTick} width={40} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => valueFormatter(Number(v))} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      )
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
            <XAxis dataKey="category" tick={axisTick} />
            <YAxis tick={axisTick} width={40} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => valueFormatter(Number(v))} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      )
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie data={data} dataKey="value" nameKey="category" outerRadius="85%" paddingAngle={1} isAnimationActive={false}>
              {data.map((entry, i) => (
                <Cell key={entry.category} fill={DONUT_PALETTE[i % DONUT_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => valueFormatter(Number(v))} />
          </PieChart>
        </ResponsiveContainer>
      )
    case 'donut':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie data={data} dataKey="value" nameKey="category" innerRadius="55%" outerRadius="85%" paddingAngle={2} isAnimationActive={false}>
              {data.map((entry, i) => (
                <Cell key={entry.category} fill={DONUT_PALETTE[i % DONUT_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => valueFormatter(Number(v))} />
          </PieChart>
        </ResponsiveContainer>
      )
    case 'combo':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
            <XAxis dataKey="category" tick={axisTick} interval={0} angle={data.length > 4 ? -20 : 0} textAnchor={data.length > 4 ? 'end' : 'middle'} height={data.length > 4 ? 40 : 24} />
            <YAxis tick={axisTick} width={40} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => valueFormatter(Number(v))} />
            <Bar dataKey="value" fill={color} fillOpacity={0.55} radius={[4, 4, 0, 0]} barSize={data.length > 6 ? 14 : 26} isAnimationActive />
            <Line type="monotone" dataKey="value" stroke="var(--ink)" strokeWidth={2} dot={{ r: 3, fill: 'var(--ink)' }} isAnimationActive />
          </ComposedChart>
        </ResponsiveContainer>
      )
    case 'horizontalBar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
            <XAxis type="number" tick={axisTick} />
            <YAxis type="category" dataKey="category" tick={axisTick} width={88} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => valueFormatter(Number(v))} />
            <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      )
    case 'table':
      return (
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.category}>
                  <TableCell className="font-medium text-foreground">{row.category}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{valueFormatter(row.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
  }
}

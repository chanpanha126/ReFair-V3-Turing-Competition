import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { datasetOverview, qualityDimensions } from '@/data/mockDataset'

const driverRatingColumn = datasetOverview.columns.find((c) => c.name === 'driver_rating')!
const missingPct = 100 - Number.parseFloat(driverRatingColumn.nonNull)
const missingBefore = Math.round(datasetOverview.rowCount * (missingPct / 100))

const uniquenessNote = qualityDimensions.find((d) => d.name === 'Uniqueness')!.note
const duplicateBefore = Number.parseInt(uniquenessNote, 10)

const metrics = [
  { label: 'Missing driver_rating', data: [{ name: 'Before', value: missingBefore }, { name: 'After', value: 0 }] },
  { label: 'Duplicate rows', data: [{ name: 'Before', value: duplicateBefore }, { name: 'After', value: 0 }] },
  { label: 'Name variants', data: [{ name: 'Before', value: 3 }, { name: 'After', value: 1 }] },
]

export function CleaningImpactChart() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p className="mb-1 text-center text-xs font-medium text-muted-foreground">{metric.label}</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={metric.data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--steel)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--steel)' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderColor: 'var(--line)', borderRadius: 8 }}
                formatter={(value) => Number(value).toLocaleString()}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {metric.data.map((entry) => (
                  <Cell key={entry.name} fill={entry.name === 'Before' ? 'var(--brick)' : 'var(--sage)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}

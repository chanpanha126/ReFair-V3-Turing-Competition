import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { datasetOverview, kpis } from '@/data/mockDataset'

// driver_rating is 91.6% non-null -> 8.4% missing. The dataset doesn't break
// missingness down by order status directly, so the split below is derived
// proportionally from the known order volume (kpis.orders / cancellationRate)
// rather than invented outright.
const driverRatingColumn = datasetOverview.columns.find((c) => c.name === 'driver_rating')!
const missingPct = 100 - Number.parseFloat(driverRatingColumn.nonNull)
const missingTotal = Math.round(datasetOverview.rowCount * (missingPct / 100))
const cancelledOrders = Math.round(kpis.orders * (kpis.cancellationRate / 100))
const missingCancelled = Math.round(missingTotal * (cancelledOrders / kpis.orders))
const missingCompleted = missingTotal - missingCancelled

const data = [
  {
    name: 'driver_rating',
    Completed: missingCompleted,
    Cancelled: missingCancelled,
  },
]

export function CompletenessBar() {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-muted-foreground">Missing driver_rating rows</p>
      <ResponsiveContainer width="100%" height={116}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--steel)' }} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            contentStyle={{ fontSize: 12, borderColor: 'var(--line)', borderRadius: 8 }}
            formatter={(value) => Number(value).toLocaleString()}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconSize={9} />
          <Bar dataKey="Completed" stackId="a" fill="var(--sky)" radius={[4, 0, 0, 4]} />
          <Bar dataKey="Cancelled" stackId="a" fill="var(--brick)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

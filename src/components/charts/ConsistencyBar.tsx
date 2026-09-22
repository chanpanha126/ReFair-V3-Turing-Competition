import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { datasetOverview, topRestaurants } from '@/data/mockDataset'

// The dataset doesn't carry per-variant row counts, so the ~1,807 rows are
// estimated from Lucky Burger's known revenue and the dataset's mean order
// value ($22.80, from datasetOverview), then split across the 3 known
// spelling variants in a simple weighted pattern.
const luckyBurger = topRestaurants.find((r) => r.name === 'Lucky Burger')!
const meanOrderValue = 22.8
const totalOrders = Math.round(luckyBurger.revenue / meanOrderValue)

const before = [
  { name: 'Lucky Burger', rows: Math.round(totalOrders * 0.62) },
  { name: 'lucky burger', rows: Math.round(totalOrders * 0.26) },
  { name: 'LUCKY BURGER', rows: totalOrders - Math.round(totalOrders * 0.62) - Math.round(totalOrders * 0.26) },
]

function VariantRow({ name, rows, color, delay }: { name: string; rows: number; color: string; delay: number }) {
  return (
    <li className="flex items-center gap-2">
      <span className="w-[40%] shrink-0 truncate text-[11px] text-muted-foreground">{name}</span>
      <span className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
        <motion.span
          className="block h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(rows / totalOrders) * 100}%` }}
          transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </span>
      <span className="w-9 shrink-0 text-right font-mono text-[10px] text-foreground">{rows.toLocaleString()}</span>
    </li>
  )
}

export function ConsistencyBar() {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Before — {datasetOverview.columns.find((c) => c.name === 'restaurant_name')!.note}
        </p>
        <ul className="space-y-1.5">
          {before.map((row, i) => (
            <VariantRow key={row.name} name={row.name} rows={row.rows} color="var(--sky)" delay={i * 0.08} />
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <ArrowDown className="size-4 shrink-0" />
        <p className="text-xs font-medium">After — merged into one canonical name</p>
      </div>

      <ul>
        <VariantRow name="Lucky Burger" rows={totalOrders} color="var(--sage)" delay={0.3} />
      </ul>
    </div>
  )
}

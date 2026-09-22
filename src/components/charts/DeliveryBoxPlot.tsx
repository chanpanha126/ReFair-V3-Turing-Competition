import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { deliveryTimeBoxplot } from '@/data/mockDataset'

const { min, q1, median, q3, max, outliers } = deliveryTimeBoxplot
const domainMax = Math.ceil(Math.max(max, ...outliers) / 10) * 10 + 10

interface BoxShapeProps {
  x: number
  y: number
  width: number
  height: number
}

function BoxPlotShape(props: unknown) {
  const { x, y, width, height } = props as BoxShapeProps
  const pxPerUnit = height / domainMax
  const yFor = (value: number) => y + (domainMax - value) * pxPerUnit

  const cx = x + width / 2
  const boxWidth = width * 0.46
  const boxX = cx - boxWidth / 2
  const capWidth = boxWidth * 0.5

  return (
    <g>
      {/* whiskers */}
      <line x1={cx} x2={cx} y1={yFor(min)} y2={yFor(q1)} stroke="var(--steel)" strokeWidth={1.5} />
      <line x1={cx} x2={cx} y1={yFor(q3)} y2={yFor(max)} stroke="var(--steel)" strokeWidth={1.5} />
      {/* whisker caps */}
      <line x1={cx - capWidth / 2} x2={cx + capWidth / 2} y1={yFor(min)} y2={yFor(min)} stroke="var(--steel)" strokeWidth={1.5} />
      <line x1={cx - capWidth / 2} x2={cx + capWidth / 2} y1={yFor(max)} y2={yFor(max)} stroke="var(--steel)" strokeWidth={1.5} />
      {/* box (IQR) */}
      <rect
        x={boxX}
        y={yFor(q3)}
        width={boxWidth}
        height={yFor(q1) - yFor(q3)}
        fill="var(--sky)"
        fillOpacity={0.35}
        stroke="var(--blue)"
        strokeWidth={1.5}
        rx={3}
      />
      {/* median */}
      <line x1={boxX} x2={boxX + boxWidth} y1={yFor(median)} y2={yFor(median)} stroke="var(--ink)" strokeWidth={2} />
      {/* outliers */}
      {outliers.map((value, i) => {
        const jitter = ((i % 5) - 2) * 4
        return (
          <circle
            key={value}
            cx={cx + jitter}
            cy={yFor(value)}
            r={3}
            fill="var(--brick)"
            fillOpacity={0.75}
            stroke="var(--paper)"
            strokeWidth={0.5}
          />
        )
      })}
    </g>
  )
}

export function DeliveryBoxPlot() {
  const data = [{ name: 'delivery_time_mins', domainMax }]

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
          <XAxis dataKey="name" tickFormatter={() => 'Delivery time'} tick={{ fontSize: 11, fill: 'var(--steel)' }} />
          <YAxis
            domain={[0, domainMax]}
            tick={{ fontSize: 11, fill: 'var(--steel)' }}
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--steel)' }}
          />
          <Bar dataKey="domainMax" fill="transparent" isAnimationActive={false} shape={BoxPlotShape} />
        </BarChart>
      </ResponsiveContainer>

      <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <div className="flex gap-1">
          <dt>Min</dt>
          <dd className="font-mono text-foreground">{min}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Q1</dt>
          <dd className="font-mono text-foreground">{q1}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Median</dt>
          <dd className="font-mono text-foreground">{median}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Q3</dt>
          <dd className="font-mono text-foreground">{q3}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Max</dt>
          <dd className="font-mono text-foreground">{max}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Outliers</dt>
          <dd className="font-mono text-brick">{outliers.length}</dd>
        </div>
      </dl>
    </div>
  )
}

import { Settings2 } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartType, renderChartByType } from '@/components/charts/GenericChart'

export interface ChartConfig {
  id: string
  title: string
  type: ChartType
  categories: string[]
  values: number[]
  valueFormatter?: (value: number) => string
  /** Human label for the metric being plotted, e.g. "Total Revenue". */
  valueLabel?: string
  /** Dataset column the x-axis is drawn from, e.g. "restaurant_name". */
  xAxisColumn?: string
  xAxisLabel?: string
}

interface ChartCardProps {
  config: ChartConfig
  color: string
  /** True while this card's settings are the ones open in the settings column. */
  active?: boolean
  /** Live draft title from an open settings panel, shown instead of the committed title. */
  previewTitle?: string | null
  onOpenSettings: (id: string) => void
}

export function ChartCard({ config, color, active = false, previewTitle, onOpenSettings }: ChartCardProps) {
  const displayTitle = previewTitle ?? config.title

  return (
    <Card
      className={cn(
        'group/chart-card relative flex h-full flex-col overflow-hidden shadow-sm ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/25',
        active && 'shadow-lg ring-2 ring-primary/50',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: color }} />
      <CardHeader className="card-drag-handle flex-row items-center justify-between gap-2 border-b border-border/70 pb-3">
        <CardTitle className="cursor-grab truncate active:cursor-grabbing">{displayTitle}</CardTitle>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="no-drag shrink-0"
          onClick={() => onOpenSettings(config.id)}
        >
          <Settings2 className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="no-drag min-h-0 flex-1 pt-3">
        {renderChartByType({ categories: config.categories, values: config.values }, config.type, color, config.valueFormatter)}
      </CardContent>
    </Card>
  )
}

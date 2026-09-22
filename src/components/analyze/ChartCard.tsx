import {
  BarChart3,
  BarChartHorizontal,
  ChartNoAxesCombined,
  Donut,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Settings2,
  Table as TableIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
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

const TYPE_OPTIONS: { type: ChartType; label: string; icon: typeof BarChart3 }[] = [
  { type: 'bar', label: 'Bar', icon: BarChart3 },
  { type: 'line', label: 'Line', icon: LineChartIcon },
  { type: 'pie', label: 'Pie', icon: PieChartIcon },
  { type: 'donut', label: 'Donut', icon: Donut },
  { type: 'combo', label: 'Combo', icon: ChartNoAxesCombined },
  { type: 'horizontalBar', label: 'Horizontal Bar', icon: BarChartHorizontal },
  { type: 'table', label: 'Table', icon: TableIcon },
]

const X_AXIS_COLUMNS = ['restaurant_name', 'customer_area', 'payment_method', 'order_timestamp', 'status']

interface ChartCardProps {
  config: ChartConfig
  color: string
  onUpdate: (
    id: string,
    updates: Partial<Pick<ChartConfig, 'title' | 'type' | 'xAxisColumn' | 'xAxisLabel'>>,
  ) => void
}

export function ChartCard({ config, color, onUpdate }: ChartCardProps) {
  const [open, setOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState(config.title)
  const [draftType, setDraftType] = useState<ChartType>(config.type)
  const [draftXAxisLabel, setDraftXAxisLabel] = useState(config.xAxisLabel ?? '')
  const [draftXAxisColumn, setDraftXAxisColumn] = useState(config.xAxisColumn ?? X_AXIS_COLUMNS[0])
  const [draftGroupBy, setDraftGroupBy] = useState<string | undefined>(undefined)

  const openSheet = () => {
    setDraftTitle(config.title)
    setDraftType(config.type)
    setDraftXAxisLabel(config.xAxisLabel ?? '')
    setDraftXAxisColumn(config.xAxisColumn ?? X_AXIS_COLUMNS[0])
    setDraftGroupBy(undefined)
    setOpen(true)
  }

  const handleSave = () => {
    onUpdate(config.id, {
      title: draftTitle.trim() || config.title,
      type: draftType,
      xAxisColumn: draftXAxisColumn,
      xAxisLabel: draftXAxisLabel,
    })
    setOpen(false)
  }

  // While the sheet is open, the title preview tracks the draft so edits are
  // visible immediately; on cancel/close the card falls back to the
  // committed config, discarding the unsaved draft.
  const displayTitle = open ? draftTitle || config.title : config.title

  return (
    <Card className="group/chart-card relative flex h-full flex-col overflow-hidden shadow-sm ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/25">
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: color }} />
      <CardHeader className="card-drag-handle flex-row items-center justify-between gap-2 border-b border-border/70 pb-3">
        <CardTitle className="cursor-grab truncate active:cursor-grabbing">{displayTitle}</CardTitle>
        <Button variant="ghost" size="icon-sm" className="no-drag shrink-0" onClick={openSheet}>
          <Settings2 className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="no-drag min-h-0 flex-1 pt-3">
        {renderChartByType({ categories: config.categories, values: config.values }, config.type, color, config.valueFormatter)}
      </CardContent>

      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetContent
          overlay={false}
          className="flex flex-col overflow-hidden border border-border shadow-2xl data-[side=right]:inset-y-3 data-[side=right]:right-3 data-[side=right]:h-[calc(100%-1.5rem)] data-[side=right]:rounded-2xl"
        >
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle>Chart settings</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <Accordion defaultValue={['properties']} className="gap-0">
              <AccordionItem value="properties">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  Chart Properties
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor={`title-${config.id}`} className="text-xs font-medium text-muted-foreground">
                        Chart title
                      </label>
                      <Input id={`title-${config.id}`} value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Chart type</p>
                      <div className="grid grid-cols-3 gap-2">
                        {TYPE_OPTIONS.map((opt) => (
                          <Button
                            key={opt.type}
                            type="button"
                            variant={draftType === opt.type ? 'default' : 'outline'}
                            className="h-auto flex-col gap-1 px-1 py-2.5"
                            onClick={() => setDraftType(opt.type)}
                          >
                            <opt.icon className="size-4" />
                            <span className="text-[11px] leading-tight">{opt.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="x-axis">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  X-Axis
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor={`xlabel-${config.id}`} className="text-xs font-medium text-muted-foreground">
                        Label
                      </label>
                      <Input
                        id={`xlabel-${config.id}`}
                        placeholder="e.g. Restaurant"
                        value={draftXAxisLabel}
                        onChange={(e) => setDraftXAxisLabel(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Column</p>
                      <Select value={draftXAxisColumn} onValueChange={(v) => setDraftXAxisColumn(v as string)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {X_AXIS_COLUMNS.map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <div className="border-b border-border py-3">
                <p className="text-sm font-medium text-foreground">Group by <span className="font-normal text-muted-foreground">(optional)</span></p>
                <div className="mt-2">
                  <Select value={draftGroupBy} onValueChange={(v) => setDraftGroupBy(v as string)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Search or select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      {X_AXIS_COLUMNS.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <AccordionItem value="values" className="border-b-0">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  Values (1)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                      {config.valueLabel ?? 'Value'}
                    </span>
                    <span className="text-xs text-muted-foreground">SUM</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <SheetFooter className="flex-row justify-end gap-2 border-t border-border">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  )
}

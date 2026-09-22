import {
  BarChart3,
  BarChartHorizontal,
  ChartNoAxesCombined,
  Donut,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table as TableIcon,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type ChartType } from '@/components/charts/GenericChart'
import type { ChartConfig } from './ChartCard'

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

interface ChartSettingsPanelProps {
  config: ChartConfig
  color: string
  onUpdate: (
    id: string,
    updates: Partial<Pick<ChartConfig, 'title' | 'type' | 'xAxisColumn' | 'xAxisLabel'>>,
  ) => void
  onClose: () => void
  /** Called on every keystroke so the corresponding ChartCard can preview the title live. */
  onDraftTitleChange: (title: string) => void
}

export function ChartSettingsPanel({ config, color, onUpdate, onClose, onDraftTitleChange }: ChartSettingsPanelProps) {
  const [draftTitle, setDraftTitle] = useState(config.title)
  const [draftType, setDraftType] = useState<ChartType>(config.type)
  const [draftXAxisLabel, setDraftXAxisLabel] = useState(config.xAxisLabel ?? '')
  const [draftXAxisColumn, setDraftXAxisColumn] = useState(config.xAxisColumn ?? X_AXIS_COLUMNS[0])
  const [draftGroupBy, setDraftGroupBy] = useState<string | undefined>(undefined)

  // Mounted fresh per chart id (the parent keys this component by config.id), so
  // this only needs to push the initial title once, not react to config changes.
  useEffect(() => {
    onDraftTitleChange(draftTitle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftTitle])

  const handleSave = () => {
    onUpdate(config.id, {
      title: draftTitle.trim() || config.title,
      type: draftType,
      xAxisColumn: draftXAxisColumn,
      xAxisLabel: draftXAxisLabel,
    })
    onClose()
  }

  return (
    <div className="flex h-full w-[320px] flex-col bg-popover text-sm text-popover-foreground">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-heading text-base font-medium text-foreground">Chart settings</h2>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

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
            <p className="text-sm font-medium text-foreground">
              Group by <span className="font-normal text-muted-foreground">(optional)</span>
            </p>
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

      <div className="flex justify-end gap-2 border-t border-border p-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

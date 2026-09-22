// Dataset: grab_food_orders_march.csv (fictional/illustrative)
// 12,480 rows before cleaning -> 12,419 after

export interface QualityDimension {
  name: string
  score: number
  ok: boolean
  note: string
}

export const qualityDimensions: QualityDimension[] = [
  { name: 'Completeness', score: 92, ok: false, note: '8.4% missing in driver_rating' },
  { name: 'Uniqueness', score: 99, ok: true, note: '61 near-duplicate rows found' },
  { name: 'Validity', score: 99, ok: true, note: '2 rows with malformed timestamps' },
  { name: 'Accuracy', score: 96, ok: true, note: '14 delivery-time outliers flagged' },
  { name: 'Consistency', score: 88, ok: false, note: '"Lucky Burger" written 3 ways' },
  { name: 'Timeliness', score: 100, ok: true, note: 'Most recent record: 2 days ago' },
]

export interface TopRestaurant {
  name: string
  revenue: number
}

export const topRestaurants: TopRestaurant[] = [
  { name: 'Lucky Burger', revenue: 41200 },
  { name: 'Pho House', revenue: 34900 },
  { name: 'Bayon Fry', revenue: 28700 },
  { name: 'Green Salad Co', revenue: 19800 },
  { name: 'Khmer Grill', revenue: 12400 },
]

export interface OrdersByArea {
  area: string
  orders: number
}

export const ordersByArea: OrdersByArea[] = [
  { area: 'BKK1', orders: 4340 },
  { area: 'Toul Kork', orders: 3120 },
  { area: 'Chamkarmon', orders: 2480 },
  { area: 'Sen Sok', orders: 1890 },
  { area: 'Daun Penh', orders: 589 },
]

export interface DeliveryTrendPoint {
  day: string
  minutes: number
}

export const deliveryTrend: DeliveryTrendPoint[] = [
  { day: 'Mon', minutes: 24 },
  { day: 'Tue', minutes: 26 },
  { day: 'Wed', minutes: 25 },
  { day: 'Thu', minutes: 27 },
  { day: 'Fri', minutes: 29 },
  { day: 'Sat', minutes: 34 },
  { day: 'Sun', minutes: 31 },
]

export interface CancellationByArea {
  area: string
  rate: number
}

export const cancellationByArea: CancellationByArea[] = [
  { area: 'BKK1', rate: 3.1 },
  { area: 'Toul Kork', rate: 5.4 },
  { area: 'Chamkarmon', rate: 4.8 },
  { area: 'Sen Sok', rate: 9.8 },
  { area: 'Daun Penh', rate: 4.2 },
]

export interface Kpis {
  gmv: number
  orders: number
  avgDeliveryMin: number
  cancellationRate: number
}

export const kpis: Kpis = { gmv: 284120, orders: 12419, avgDeliveryMin: 27.4, cancellationRate: 6.1 }

// For the dataset overview / profile table on the Clean page
export interface DatasetColumn {
  name: string
  type: string
  nonNull: string
  unique: number | string
  note: string
}

export interface DatasetOverview {
  name: string
  description: string
  rowCount: number
  columnCount: number
  columns: DatasetColumn[]
}

export const datasetOverview: DatasetOverview = {
  name: 'grab_food_orders_march.csv',
  description:
    'Order-level delivery records for Grab Food, Phnom Penh, March 2026. Each row is one order, covering the restaurant, order value, delivery time, driver rating, customer area, payment method, and status.',
  rowCount: 12480,
  columnCount: 9,
  columns: [
    { name: 'order_id', type: 'string', nonNull: '100%', unique: 12480, note: 'Unique identifier' },
    { name: 'restaurant_name', type: 'string', nonNull: '100%', unique: 47, note: '3 spelling variants found' },
    { name: 'order_value', type: 'number', nonNull: '100%', unique: '—', note: 'Mean $22.80, right-skewed' },
    { name: 'delivery_time_mins', type: 'number', nonNull: '100%', unique: '—', note: 'Mean 27.4, 14 outliers' },
    { name: 'driver_rating', type: 'number (1-5)', nonNull: '91.6%', unique: '—', note: '8.4% missing, MAR' },
    { name: 'customer_area', type: 'string', nonNull: '100%', unique: 5, note: 'Phnom Penh districts' },
    { name: 'payment_method', type: 'string', nonNull: '100%', unique: 3, note: 'Card / Cash / Wallet' },
    { name: 'order_timestamp', type: 'datetime', nonNull: '99.98%', unique: '—', note: '2 malformed rows' },
    { name: 'status', type: 'string', nonNull: '100%', unique: 2, note: 'Completed / Cancelled' },
  ],
}

// Cleaning change log — shown on the Clean page's completed state and
// summarized on the Report page
export const changeLog: string[] = [
  'Dropped 61 near-duplicate rows',
  'Re-parsed 2 malformed order_timestamp values',
  'Flagged 14 delivery-time outliers for review (kept, not deleted)',
  'Merged 3 spelling variants of "Lucky Burger" into one canonical name',
  'Left driver_rating null for cancelled orders; flagged remaining gaps in completed orders for backfill',
]

// Box plot data for delivery_time_mins (Accuracy / outlier detection)
export interface DeliveryTimeBoxplot {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: number[]
}

export const deliveryTimeBoxplot: DeliveryTimeBoxplot = {
  min: 8,
  q1: 19,
  median: 25,
  q3: 33,
  max: 58,
  outliers: [61, 64, 67, 71, 73, 78, 82, 85, 88, 91, 95, 99, 103, 110],
}

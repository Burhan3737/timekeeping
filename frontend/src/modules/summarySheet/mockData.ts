import type { SummaryRow, SummaryTotals } from './types'

// Returns Monday of the current week
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}

export function getCurrentWeekDates(): string[] {
  const monday = getMondayOfWeek(new Date())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

const WEEK = getCurrentWeekDates()
const [mon, tue, wed, thu, fri, sat] = WEEK

export const MOCK_SUMMARY_ROWS: SummaryRow[] = [
  {
    userId: 'u3',
    userName: 'James Tran',
    jobRole: 'Field Operator',
    locationName: 'North Yard',
    dailyHours: { [mon]: 8.0, [tue]: 8.5, [wed]: 7.5, [thu]: 8.5, [fri]: 8.5, [sat]: 0 },
    weeklyTotal: 41.0,
    chargeCodeBreakdown: {
      [mon]: { 'PROJ-42': 4.0, 'CC-1001': 4.0 },
      [tue]: { 'PROJ-42': 3.5, 'CC-1001': 3.5, 'OT-EMRG': 1.5 },
      [wed]: { 'CC-1002': 7.5 },
      [thu]: { 'PROJ-42': 8.5 },
      [fri]: { 'PROJ-42': 6.0, 'CC-1001': 2.5 },
    },
  },
  {
    userId: 'u4',
    userName: 'Maria Santos',
    jobRole: 'Senior Operator',
    locationName: 'North Yard',
    dailyHours: { [mon]: 8.0, [tue]: 8.0, [wed]: 8.0, [thu]: 7.5, [fri]: 7.0, [sat]: 0 },
    weeklyTotal: 38.5,
    chargeCodeBreakdown: {
      [mon]: { 'PROJ-42': 8.0 },
      [tue]: { 'PROJ-42': 4.0, 'CC-1001': 4.0 },
      [wed]: { 'CC-1001': 8.0 },
      [thu]: { 'CC-1002': 7.5 },
      [fri]: { 'PROJ-43': 7.0 },
    },
  },
  {
    userId: 'u5',
    userName: 'Chen Wei',
    jobRole: 'Field Operator',
    locationName: 'East Terminal',
    dailyHours: { [mon]: 8.0, [tue]: 7.5, [wed]: 9.5, [thu]: 7.0, [fri]: 0, [sat]: 0 },
    weeklyTotal: 32.0,
    chargeCodeBreakdown: {
      [mon]: { 'PROJ-43': 8.0 },
      [tue]: { 'PROJ-43': 4.0, 'CC-1002': 3.5 },
      [wed]: { 'PROJ-43': 9.5 },
      [thu]: { 'CC-1001': 7.0 },
    },
  },
  {
    userId: 'u6',
    userName: 'Priya Nair',
    jobRole: 'Field Operator',
    locationName: 'Site Alpha',
    dailyHours: { [mon]: 7.5, [tue]: 7.5, [wed]: 7.5, [thu]: 7.5, [fri]: 6.5, [sat]: 0 },
    weeklyTotal: 36.5,
    chargeCodeBreakdown: {
      [mon]: { 'CC-1001': 7.5 },
      [tue]: { 'CC-1001': 4.0, 'CC-1002': 3.5 },
      [wed]: { 'CC-1002': 7.5 },
      [thu]: { 'PROJ-43': 7.5 },
      [fri]: { 'CC-1001': 6.5 },
    },
  },
]

export function computeTotals(rows: SummaryRow[], dates: string[]): SummaryTotals {
  const dailyTotals: Record<string, number> = {}
  dates.forEach((d) => {
    dailyTotals[d] = rows.reduce((sum, r) => sum + (r.dailyHours[d] ?? 0), 0)
  })
  const grandTotal = rows.reduce((sum, r) => sum + r.weeklyTotal, 0)
  return { dailyTotals, grandTotal }
}

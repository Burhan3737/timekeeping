export interface SummaryRow {
  userId: string
  userName: string
  jobRole: string
  locationName: string
  dailyHours: Record<string, number>        // YYYY-MM-DD → hours
  weeklyTotal: number
  chargeCodeBreakdown: Record<string, Record<string, number>>  // date → { chargeCode → hours }
}

export interface SummaryTotals {
  dailyTotals: Record<string, number>  // date → total hours across all employees
  grandTotal: number
}

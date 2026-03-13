# Summary Sheet

## Overview

The summary sheet provides date-range reports of time entry data. Supervisors and data entry clerks use this to generate weekly summaries of hours worked per employee, broken down by charge code and day. Supports export for manual data transfer to enterprise systems.

## Dependencies

- **Data Models**: `TimeSession`, `TimeEntry`, `User`, `ChargeCode`, `Location`
- **Shared Components**: PageHeader, FilterBar, DataTable, TimeGrid24hr, StatCard
- **Shared Utilities**: `dateUtils` (getWeekRange, getDateRange), `formatters`
- **Modules**: time-sessions

## User Stories

1. As a supervisor, I want to generate a weekly summary report for my team showing hours per employee per day.
2. As a supervisor, I want to filter by date range, location, and employee.
3. As a data entry clerk, I want to view approved summary data to transcribe into the enterprise system.
4. As a supervisor, I want to see hours broken down by charge code.
5. As a supervisor, I want to export/print the summary report.

## View Layer

### Components

**SummarySheetPage** (`modules/summarySheet/components/SummarySheetPage.tsx`)
- PageHeader: title "Summary Sheet", subtitle "Weekly summary reports", action: "Export" button
- FilterBar: Date range (default: current week Mon–Sun), Location, Employee
- Summary table: Rows = employees, Columns = days of the week + Total
- Expandable rows showing charge code breakdown per day
- TimeGrid24hr for visual daily view (optional toggle)

**SummaryTable** (`modules/summarySheet/components/SummaryTable.tsx`)
- Custom MUI Table (not DataTable — needs row grouping/expansion)
- Header: Employee | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Total
- Each cell: hours worked that day
- Expandable: shows charge code + hours per code per day
- Color highlight cells where hours > 8 (daily OT) or total > 40 (weekly OT)
- Footer row: daily totals across all employees

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/reporting/summary-sheet` | SummarySheetPage | SUPERVISOR, ADMIN, DATA_ENTRY_CLERK |

## Business Logic

### Rules

1. Default date range: current work week (Monday–Sunday).
2. Only APPROVED sessions are included in the summary.
3. Hours > 8 daily highlighted with `warning.main` background tint.
4. Weekly total > 40 highlighted with `warning.main`.
5. Export generates a format suitable for printing (print CSS or CSV download).

### State

**Store**: `modules/summarySheet/store.ts`

```typescript
interface SummaryRow {
  user: User
  dailyHours: Record<string, number>     // date → hours
  weeklyTotal: number
  chargeCodeBreakdown: Record<string, Record<string, number>>  // date → { chargeCode → hours }
}

interface SummarySheetState {
  rows: SummaryRow[]
  dateRange: { start: string; end: string }
  filters: { locationId: string; userId: string }
  loading: boolean
  error: string | null
  actions: {
    fetchSummary: (startDate: string, endDate: string, filters?: Record<string, string>) => Promise<void>
    setDateRange: (start: string, end: string) => void
    setFilter: (key: string, value: string) => void
    resetFilters: () => void
    exportCSV: () => void
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/summary-sheet` | Query: `?startDate=&endDate=&locationId=&userId=` | `{ rows: SummaryRow[] }` | SUPERVISOR, ADMIN, DATA_ENTRY_CLERK |

## Acceptance Criteria

- [ ] Summary table shows employees × days with hours
- [ ] Expandable rows show charge code breakdown
- [ ] Date range filter defaults to current week
- [ ] Only approved sessions are included
- [ ] Daily hours > 8 and weekly > 40 are highlighted
- [ ] Export/print functionality works
- [ ] Filter by location and employee
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

# Shared Utilities & Business Logic

Specs for shared utility functions and core business logic.

## `shared/utils/dateUtils.ts`

```typescript
/** Format ISO date to display string — e.g., "Mar 12, 2026" */
formatDate(isoDate: string): string

/** Format HH:mm time to display — e.g., "2:30 PM" */
formatTime(time24: string): string

/** Format minutes to "Xh Ym" — e.g., 135 → "2h 15m" */
formatDuration(minutes: number): string

/** Get start (Monday) and end (Sunday) dates for the week containing the given date */
getWeekRange(date: string): { start: string; end: string }

/** Check if ISO date is today */
isToday(isoDate: string): boolean

/** Calculate difference in hours between two HH:mm strings */
diffInHours(startTime: string, endTime: string): number

/** Parse "HH:mm" string to { hours: number, minutes: number } */
parseTimeString(time: string): { hours: number; minutes: number }

/** Get array of dates in a range (inclusive) */
getDateRange(start: string, end: string): string[]

/** Format ISO date to day name — e.g., "Monday" */
getDayName(isoDate: string): string
```

## `shared/utils/formatters.ts`

```typescript
/** Convert decimal hours to HH:MM display — e.g., 8.5 → "08:30" */
hoursToHHMM(hours: number): string

/** Convert minutes to display string — e.g., 90 → "1:30" */
minutesToDisplay(minutes: number): string

/** Format user's full name */
formatUserName(user: { firstName: string; lastName: string }): string

/** Capitalize first letter */
capitalize(str: string): string
```

## `shared/utils/validators.ts`

```typescript
/** Validate that endTime > startTime (HH:mm format) */
validateTimeRange(startTime: string, endTime: string): boolean

/** Validate 4-6 digit PIN */
validatePIN(pin: string): boolean

/** Validate email format */
validateEmail(email: string): boolean

/** Validate required field is non-empty */
validateRequired(value: unknown): boolean

/** Validate time entries don't overlap within a session */
validateNoOverlap(entries: { startTime: string; endTime: string }[]): boolean
```

## `shared/utils/constants.ts`

```typescript
export const DAILY_HOUR_THRESHOLD = 8
export const WEEKLY_HOUR_THRESHOLD = 40

export const TIME_ENTRY_COLORS = {
  normal: 'primary.main',
  stepUp: 'error.main',
  overtime: 'warning.main'
} as const

export const STATUS_COLORS = {
  APPROVED: 'success',
  PENDING: 'warning',
  SUBMITTED: 'info',
  REJECTED: 'error',
  DRAFT: 'default'
} as const

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50]
```

## `logic/timeCalculations.ts`

Core business logic — decoupled from UI. Used by time-sessions, overtime, time-sheets, summary-sheet.

```typescript
/** Sum all entry durations for a date, return total hours */
calculateDailyHours(entries: { durationMinutes: number }[]): number

/** Sum daily hours across a week range */
calculateWeeklyHours(sessions: { totalHours: number }[]): number

/** Check if daily hours exceed threshold (default 8) */
isOvertimeDaily(totalHours: number, threshold?: number): boolean

/** Check if weekly hours exceed threshold (default 40) */
isOvertimeWeekly(totalHours: number, threshold?: number): boolean

/** Merge adjacent/overlapping time segments for grid display */
mergeTimeSegments(segments: { startTime: string; endTime: string }[]): { startTime: string; endTime: string }[]

/** Calculate duration in minutes between two HH:mm times */
calculateDuration(startTime: string, endTime: string): number

/** Filter job roles to only those above the given level */
getStepUpRoles(allRoles: { id: string; level: number }[], currentLevel: number): { id: string; level: number }[]
```

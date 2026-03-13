# Time Sessions

## Overview

Time sessions are the central feature of TekTracking. A time session groups all time entries for a single user on a single date. Field workers create time entries with start/stop times, a mandatory charge code, and an optional step-up role. The system auto-detects overtime (>8hr daily) and tracks session status through a submission/approval lifecycle.

This is the most complex module and the core of the application.

## Dependencies

- **Data Models**: `TimeSession`, `TimeEntry`, `User`, `ChargeCode`, `JobRole`, `Location`, `TimeSessionStatus`
- **Shared Components**: PageHeader, DataTable, FormDialog, StatusBadge, StatCard, ConfirmDialog
- **Shared Utilities**: `dateUtils`, `timeCalculations`, `validators`, `constants`
- **Modules**: users, charge-codes, job-roles, locations

## User Stories

1. As a field worker, I want to create time entries with start/stop times and charge codes to record my work.
2. As a field worker, I want to select a step-up role when I'm performing higher-grade work.
3. As a field worker, I want to see only roles above my current pay grade in the step-up dropdown.
4. As a field worker, I want to add multiple time segments per day.
5. As a field worker, I want to submit my daily time session for supervisor review.
6. As a field worker, I want to see my total hours for the day and week at a glance.

## View Layer

### Components

**TimeSessionsPage** (`modules/timeSessions/components/TimeSessionsPage.tsx`)
- PageHeader: title "Time Sessions", subtitle shows current date
- StatCards row: Today's Hours, Week Hours, Entries Today, Session Status
- Current session section with list of time entries
- "Add Entry" button
- "Submit for Review" button (when session is DRAFT)

**TimeEntryList** (`modules/timeSessions/components/TimeEntryList.tsx`)
- List/table of time entries for the current session
- Columns: Start Time, End Time, Duration, Charge Code, Step-Up Role, Overtime flag
- Row actions: Edit, Delete (only in DRAFT status)
- Color coding: normal entries (indigo), step-up (red), overtime (amber)

**TimeEntryFormDialog** (`modules/timeSessions/components/TimeEntryFormDialog.tsx`)
- FormDialog wrapper
- Fields:
  - Start Time (TimePicker, required)
  - End Time (TimePicker, required)
  - Charge Code (Select from active charge codes, required)
  - Step-Up Role (Checkbox toggle → Select from eligible roles, optional)
  - Location (auto-populated from user's primary location, editable)
  - Notes (TextField, optional)
- Step-up dropdown: only shows `JobRole` records with `level > currentUser.jobRole.level`

**SessionHistoryPage** (`modules/timeSessions/components/SessionHistoryPage.tsx`)
- DataTable of past sessions (paginated, date-sorted descending)
- Columns: Date, Total Hours, Entry Count, Status, Submitted At
- Click row to view session detail
- Filter by date range and status

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/time-sessions` | TimeSessionsPage | FIELD_WORKER, SUPERVISOR, ADMIN |
| `/time-sessions/history` | SessionHistoryPage | FIELD_WORKER, SUPERVISOR, ADMIN |
| `/time-sessions/:id` | TimeSessionsPage (detail) | FIELD_WORKER, SUPERVISOR, ADMIN |

## Business Logic

### Rules

1. **One session per user per date**: System auto-creates or retrieves session for current date.
2. **Charge code required**: Every time entry must have a charge code assigned.
3. **Time validation**: `endTime > startTime`. No overlapping entries within same session.
4. **Step-up filtering**: Only `JobRole` records with `level > user.jobRole.level` appear in dropdown.
5. **Overtime detection**: If daily total > 8 hours, `isOvertime: true` on entries exceeding threshold.
6. **Duration calculation**: `durationMinutes = diffInMinutes(startTime, endTime)`.
7. **Session totals**: `totalHours` and `entryCount` recalculated on every entry add/edit/delete.
8. **Submission lifecycle**: DRAFT → SUBMITTED (by worker). Worker cannot edit after submission.
9. **Auto-populate location**: Default to user's primary assigned location.
10. **Date awareness**: System auto-selects current date. User can navigate to past dates for editing (if DRAFT).

### State

**Store**: `modules/timeSessions/store.ts`

```typescript
interface TimeSessionsState {
  currentSession: TimeSession | null
  entries: TimeEntry[]
  sessions: TimeSession[]         // history list
  dailyHours: number
  weeklyHours: number
  loading: boolean
  error: string | null
  actions: {
    fetchOrCreateSession: (date: string) => Promise<void>
    fetchEntries: (sessionId: string) => Promise<void>
    addEntry: (data: Omit<TimeEntry, 'id' | 'sessionId' | 'durationMinutes' | 'isOvertime' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateEntry: (id: string, data: Partial<TimeEntry>) => Promise<void>
    deleteEntry: (id: string) => Promise<void>
    submitSession: (sessionId: string) => Promise<void>
    fetchSessionHistory: (params?: { startDate?: string; endDate?: string; status?: string }) => Promise<void>
    fetchWeeklyHours: () => Promise<void>
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/time-sessions/current?date=` | — | `TimeSession` (creates if none exists) | Authenticated |
| GET | `/api/time-sessions` | Query: `?userId=&startDate=&endDate=&status=` | `TimeSession[]` | Authenticated |
| GET | `/api/time-sessions/:id` | — | `TimeSession` | Authenticated |
| PATCH | `/api/time-sessions/:id/submit` | — | `TimeSession` | Owner only |
| GET | `/api/time-sessions/:id/entries` | — | `TimeEntry[]` | Authenticated |
| POST | `/api/time-sessions/:id/entries` | `{ startTime, endTime, chargeCodeId, stepUpRoleId?, locationId, notes? }` | `TimeEntry` | Owner only (DRAFT) |
| PUT | `/api/time-entries/:id` | `Partial<TimeEntry>` | `TimeEntry` | Owner only (DRAFT) |
| DELETE | `/api/time-entries/:id` | — | `{ success: true }` | Owner only (DRAFT) |
| GET | `/api/time-sessions/weekly-hours?userId=&date=` | — | `{ totalHours: number }` | Authenticated |

## Acceptance Criteria

- [ ] Field worker can create time entries with start/end time and charge code
- [ ] Step-up dropdown only shows roles above worker's current level
- [ ] Multiple entries per day are supported
- [ ] Overlapping time entries are rejected
- [ ] Daily and weekly hour totals are displayed and auto-calculated
- [ ] Overtime entries are flagged automatically when daily total > 8 hours
- [ ] Worker can submit session for review (status: DRAFT → SUBMITTED)
- [ ] Worker cannot edit entries after submission
- [ ] Session history shows past sessions with filtering
- [ ] Location auto-populated from user's assignment
- [ ] Color-coded entries: normal (indigo), step-up (red), overtime (amber)
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

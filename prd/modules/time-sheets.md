# Time Sheets

## Overview

Time sheets provide the supervisor's daily review interface. Supervisors see a 24-hour grid visualization of each worker's time entries for a selected date, then approve, edit, or reject entries. Supports bulk approval after corrections. This is where charge code and step-up role validation happens. Data Entry Clerks can view approved time sheets for manual data transfer.

## Dependencies

- **Data Models**: `TimeSession`, `TimeEntry`, `User`, `ChargeCode`, `JobRole`, `TimeSessionStatus`
- **Shared Components**: PageHeader, FilterBar, TimeGrid24hr, DataTable, StatusBadge, FormDialog, ConfirmDialog
- **Shared Utilities**: `dateUtils`, `timeCalculations`, `constants`
- **Modules**: time-sessions

## User Stories

1. As a supervisor, I want to view all workers' time entries for a selected date on a 24-hour grid.
2. As a supervisor, I want to edit a worker's charge code or step-up role to correct mistakes.
3. As a supervisor, I want to approve or reject individual time sessions.
4. As a supervisor, I want to bulk-approve all corrected sessions for a date.
5. As a data entry clerk, I want to view approved daily time sheets for manual data transfer.

## View Layer

### Components

**TimeSheetsPage** (`modules/timeSheets/components/TimeSheetsPage.tsx`)
- PageHeader: title "Time Sheets", subtitle "Daily review and approval"
- FilterBar: Date picker (defaults to today), Location filter
- "Bulk Approve" button (approves all SUBMITTED sessions for selected date)
- List of employee time sessions for selected date

**EmployeeTimeCard** (`modules/timeSheets/components/EmployeeTimeCard.tsx`)
- Card per employee showing:
  - Employee name, role, location
  - TimeGrid24hr with their time entry segments
  - Total hours, entry count, session status (StatusBadge)
  - Actions: Approve, Reject, Expand to see entry details
- Color coding: Normal=indigo (`primary.main`), Step-Up=red (`error.main`), Overtime=amber (`warning.main`)

**EntryEditDialog** (`modules/timeSheets/components/EntryEditDialog.tsx`)
- FormDialog for supervisor to edit a specific time entry
- Editable fields: Charge Code (Select), Step-Up Role (Select), Start Time, End Time
- Shows original values for reference
- Supervisor notes field for edit justification

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/reporting/time-sheets` | TimeSheetsPage | SUPERVISOR, ADMIN, DATA_ENTRY_CLERK |

## Business Logic

### Rules

1. Supervisors can only review SUBMITTED sessions (not DRAFT).
2. Supervisor edits to entries are tracked (audit trail).
3. Approval changes status: SUBMITTED → APPROVED. Rejection: SUBMITTED → REJECTED.
4. Bulk approve: approves all SUBMITTED sessions for the selected date at once.
5. Rejected sessions return to DRAFT, allowing the worker to make corrections and resubmit.
6. Data Entry Clerks have read-only access — no edit/approve/reject actions.
7. TimeGrid24hr color coding:
   - Normal time: `primary.main` (indigo)
   - Step-up time: `error.main` (red)
   - Overtime: `warning.main` (amber)

### State

**Store**: `modules/timeSheets/store.ts`

```typescript
interface TimeSheetsState {
  sessions: (TimeSession & { user: User; entries: TimeEntry[] })[]
  selectedDate: string
  locationFilter: string
  loading: boolean
  error: string | null
  actions: {
    fetchSessions: (date: string, locationId?: string) => Promise<void>
    approveSession: (sessionId: string) => Promise<void>
    rejectSession: (sessionId: string, reason?: string) => Promise<void>
    bulkApprove: (date: string, locationId?: string) => Promise<void>
    editEntry: (entryId: string, data: Partial<TimeEntry>, notes: string) => Promise<void>
    setDate: (date: string) => void
    setLocationFilter: (locationId: string) => void
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/time-sheets?date=&locationId=` | — | `(TimeSession & { user, entries })[]` | SUPERVISOR, ADMIN, DATA_ENTRY_CLERK |
| PATCH | `/api/time-sessions/:id/approve` | — | `TimeSession` | SUPERVISOR, ADMIN |
| PATCH | `/api/time-sessions/:id/reject` | `{ reason? }` | `TimeSession` | SUPERVISOR, ADMIN |
| POST | `/api/time-sheets/bulk-approve` | `{ date, locationId? }` | `{ approvedCount: number }` | SUPERVISOR, ADMIN |
| PUT | `/api/time-entries/:id/supervisor-edit` | `{ chargeCodeId?, stepUpRoleId?, startTime?, endTime?, notes }` | `TimeEntry` | SUPERVISOR, ADMIN |

## Acceptance Criteria

- [ ] Supervisor can view all workers' time sessions for a selected date
- [ ] TimeGrid24hr displays entries with correct color coding (normal/step-up/overtime)
- [ ] Supervisor can expand a card to see entry details
- [ ] Supervisor can edit charge code and step-up role on individual entries
- [ ] Supervisor can approve or reject individual sessions
- [ ] Bulk approve works for all submitted sessions on a date
- [ ] Rejected sessions return to DRAFT status
- [ ] Data Entry Clerk has read-only view of approved sessions
- [ ] Edit audit trail is maintained
- [ ] FilterBar allows date and location filtering
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

# Overtime

## Overview

Overtime management allows field workers to request pre-approval for overtime work. Requests are triggered when daily hours approach the 8-hour threshold or weekly hours approach 40. Workers submit overtime requests with planned time, charge code, and reason. Supervisors review and approve/reject requests.

## Dependencies

- **Data Models**: `OvertimeRequest`, `OvertimeStatus`, `User`, `ChargeCode`, `JobRole`
- **Shared Components**: PageHeader, DataTable, FormDialog, StatusBadge, ConfirmDialog, StatCard
- **Shared Utilities**: `timeCalculations` (isOvertimeDaily, isOvertimeWeekly), `constants`
- **Modules**: time-sessions (hours data), charge-codes

## User Stories

1. As a field worker, I want to request overtime pre-approval before working extra hours.
2. As a field worker, I want to see my pending and past overtime requests.
3. As a field worker, I want to cancel a pending overtime request if plans change.
4. As a field worker, I want to be notified when my request is approved or rejected.

## View Layer

### Components

**OvertimePage** (`modules/overtime/components/OvertimePage.tsx`)
- PageHeader: title "Overtime", action: "Request Overtime" button
- StatCards: Today's Hours, Weekly Hours, Pending Requests
- Tabs: "My Requests" | "History"
- DataTable of overtime requests
- Columns: Date, Start Time, Duration, Charge Code, Step-Up Role, Reason, Status
- Row actions: View, Cancel (if REQUESTED)

**OvertimeRequestFormDialog** (`modules/overtime/components/OvertimeRequestFormDialog.tsx`)
- FormDialog wrapper
- Fields:
  - Date (DatePicker, required, defaults to today)
  - Start Time (TimePicker, required)
  - Estimated Duration (NumberField in minutes, required)
  - Charge Code (Select, required)
  - Step-Up Role (optional, same filtering as time entry)
  - Reason (TextField, multiline, required)

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/overtime` | OvertimePage | FIELD_WORKER, SUPERVISOR, ADMIN |

## Business Logic

### Rules

1. Overtime request requires: date, start time, estimated duration, charge code, and reason.
2. Request must be submitted BEFORE the overtime work is performed (pre-approval).
3. Only the requester or a supervisor can cancel a REQUESTED status request.
4. Step-up role filtering same as time entry: only roles above current level.
5. System should prompt overtime request when daily hours > 8 or weekly hours approach 40.
6. Approved overtime allows the worker to log time entries beyond the threshold.

### State

**Store**: `modules/overtime/store.ts`

```typescript
interface OvertimeState {
  requests: OvertimeRequest[]
  loading: boolean
  error: string | null
  actions: {
    fetchMyRequests: (params?: { status?: string }) => Promise<void>
    createRequest: (data: Omit<OvertimeRequest, 'id' | 'status' | 'reviewedBy' | 'reviewedAt' | 'reviewNotes' | 'createdAt' | 'updatedAt'>) => Promise<void>
    cancelRequest: (id: string) => Promise<void>
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/overtime-requests/mine` | Query: `?status=` | `OvertimeRequest[]` | Authenticated |
| GET | `/api/overtime-requests/:id` | — | `OvertimeRequest` | Authenticated |
| POST | `/api/overtime-requests` | `{ date, startTime, estimatedDurationMinutes, chargeCodeId, stepUpRoleId?, reason }` | `OvertimeRequest` | Authenticated |
| PATCH | `/api/overtime-requests/:id/cancel` | — | `OvertimeRequest` | Owner or SUPERVISOR |

## Acceptance Criteria

- [ ] Field worker can submit an overtime request with all required fields
- [ ] Worker can view their pending and historical requests
- [ ] Worker can cancel a pending request
- [ ] Step-up role dropdown filters to roles above current level
- [ ] Request status displayed with color-coded StatusBadge
- [ ] Daily/weekly hours displayed to inform the request decision
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

# Overtime Requests (Supervisor View)

## Overview

Supervisor interface for managing overtime requests from field workers. Supervisors can view all pending requests, approve or reject them with notes, and see historical request data. This is the supervisor-side companion to the worker's overtime module.

## Dependencies

- **Data Models**: `OvertimeRequest`, `OvertimeStatus`, `User`, `ChargeCode`, `JobRole`
- **Shared Components**: PageHeader, DataTable, FilterBar, StatusBadge, FormDialog, ConfirmDialog
- **Modules**: overtime

## User Stories

1. As a supervisor, I want to see all pending overtime requests from my team.
2. As a supervisor, I want to approve an overtime request so the worker can proceed.
3. As a supervisor, I want to reject a request with a reason so the worker understands.
4. As a supervisor, I want to filter requests by date range, status, and employee.

## View Layer

### Components

**OvertimeRequestsPage** (`modules/overtimeRequests/components/OvertimeRequestsPage.tsx`)
- PageHeader: title "Overtime Requests", subtitle "Review and approve overtime"
- FilterBar: Date range, Status dropdown, Employee search
- Tabs: "Pending" | "All Requests"
- DataTable of requests
- Columns: Employee Name, Date, Start Time, Duration, Charge Code, Step-Up Role, Reason, Status
- Row actions: Approve, Reject (for REQUESTED status)

**ReviewDialog** (`modules/overtimeRequests/components/ReviewDialog.tsx`)
- FormDialog for approve/reject action
- Shows request details (read-only)
- Supervisor notes field (required for rejection, optional for approval)
- Approve + Reject buttons

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/reporting/overtime-requests` | OvertimeRequestsPage | SUPERVISOR, ADMIN |

## Business Logic

### Rules

1. Only REQUESTED status requests can be approved or rejected.
2. Rejection requires a reason/note.
3. Approved requests allow the worker to log overtime entries.
4. Supervisors see requests from workers in their assigned locations.
5. Admins see all requests system-wide.

### State

**Store**: `modules/overtimeRequests/store.ts`

```typescript
interface OvertimeRequestsState {
  requests: (OvertimeRequest & { user: User })[]
  filters: {
    startDate: string
    endDate: string
    status: OvertimeStatus | ''
    userId: string
  }
  loading: boolean
  error: string | null
  actions: {
    fetchRequests: (params?: Record<string, string>) => Promise<void>
    approveRequest: (id: string, notes?: string) => Promise<void>
    rejectRequest: (id: string, notes: string) => Promise<void>
    setFilter: (key: string, value: string) => void
    resetFilters: () => void
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/overtime-requests` | Query: `?startDate=&endDate=&status=&userId=` | `(OvertimeRequest & { user })[]` | SUPERVISOR, ADMIN |
| PATCH | `/api/overtime-requests/:id/approve` | `{ notes? }` | `OvertimeRequest` | SUPERVISOR, ADMIN |
| PATCH | `/api/overtime-requests/:id/reject` | `{ notes }` | `OvertimeRequest` | SUPERVISOR, ADMIN |

## Acceptance Criteria

- [ ] Supervisor can view all overtime requests with filtering
- [ ] Supervisor can approve a request
- [ ] Supervisor can reject a request with a required reason
- [ ] Only REQUESTED status requests show approve/reject actions
- [ ] StatusBadge shows appropriate colors for each status
- [ ] FilterBar supports date range, status, and employee filtering
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

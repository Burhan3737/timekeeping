# Employees

## Overview

The employees module provides a supervisory dashboard showing the status of all workers: who's clocked in, daily/weekly hours, overtime status, and missing time submissions. Aggregates data from users, time sessions, and overtime modules.

## Dependencies

- **Data Models**: `User`, `TimeSession`, `OvertimeRequest`, `JobRole`, `Location`
- **Shared Components**: PageHeader, DataTable, FilterBar, StatusBadge, StatCard
- **Modules**: users, time-sessions, overtime

## User Stories

1. As a supervisor, I want to see a dashboard of all employees' current status at a glance.
2. As a supervisor, I want to see who has submitted time for today and who hasn't.
3. As a supervisor, I want to see each worker's daily and weekly hours.
4. As a supervisor, I want to filter employees by location, role, or status.

## View Layer

### Components

**EmployeesPage** (`modules/employees/components/EmployeesPage.tsx`)
- PageHeader: title "Employees", subtitle "Employee status dashboard"
- StatCards row: Total Active, Clocked In Today, Missing Time Today, Overtime Active
- FilterBar: Location, Job Role, Status
- DataTable of employees
- Columns: Name, Job Role, Location, Today's Hours, Weekly Hours, Session Status, OT Requests (pending count)
- Row click → navigate to worker's time session detail

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/reporting/employees` | EmployeesPage | SUPERVISOR, ADMIN |

## Business Logic

### Rules

1. "Missing Time" = active worker with no time session for today (or session with 0 entries).
2. "Clocked In" = worker has a DRAFT session with at least one entry today.
3. Weekly hours calculated from Monday to current day.
4. Supervisors see only employees in their assigned locations.
5. Admins see all employees.

### State

**Store**: `modules/employees/store.ts`

```typescript
interface EmployeeDashboardItem {
  user: User
  jobRole: JobRole
  todaySession: TimeSession | null
  todayHours: number
  weeklyHours: number
  pendingOTCount: number
}

interface EmployeesState {
  employees: EmployeeDashboardItem[]
  stats: {
    totalActive: number
    clockedInToday: number
    missingTimeToday: number
    overtimeActive: number
  }
  filters: { locationId: string; roleId: string }
  loading: boolean
  error: string | null
  actions: {
    fetchDashboard: () => Promise<void>
    setFilter: (key: string, value: string) => void
    resetFilters: () => void
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/employees/dashboard` | Query: `?locationId=&roleId=` | `{ employees: EmployeeDashboardItem[], stats }` | SUPERVISOR, ADMIN |

## Acceptance Criteria

- [ ] Dashboard shows employee list with daily/weekly hours
- [ ] StatCards display aggregate metrics
- [ ] "Missing Time" employees are highlighted
- [ ] Filters work for location and role
- [ ] Clicking a row navigates to that worker's time session
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

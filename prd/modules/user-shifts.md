# User Shifts

## Overview

User shifts define recurring work schedules for employees. Each shift specifies a day of the week, start/end times, role, and location. The TimeGrid24hr component visualizes shifts on a 24-hour bar. Supervisors and admins manage shifts for their team members.

## Dependencies

- **Data Models**: `UserShift`, `User`, `JobRole`, `Location`, `DayOfWeek`
- **Shared Components**: PageHeader, FormDialog, ConfirmDialog, TimeGrid24hr, DataTable
- **Modules**: users, job-roles, locations

## User Stories

1. As a supervisor, I want to define weekly shift schedules for my team members.
2. As an admin, I want to view and edit any employee's shift schedule.
3. As a supervisor, I want to see a visual 24-hour grid of an employee's shifts for each day.
4. As a user, I want to view my own assigned shifts.

## View Layer

### Components

**UserShiftsPage** (`modules/userShifts/components/UserShiftsPage.tsx`)
- PageHeader: title "User Shifts", subtitle "Manage employee shift schedules"
- Employee selector dropdown (search by name)
- Weekly grid: 7 rows (Mon–Sun), each with a TimeGrid24hr showing shift blocks
- "Add Shift" button per day row
- Click shift block to edit/delete

**ShiftFormDialog** (`modules/userShifts/components/ShiftFormDialog.tsx`)
- FormDialog wrapper
- Fields:
  - Day of Week (Select, required)
  - Start Time (TimePicker, required)
  - End Time (TimePicker, required)
  - Role (Select from active job roles, required)
  - Location (Select from active locations, required)

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/setup/user-shifts` | UserShiftsPage | ADMIN, SUPERVISOR |

## Business Logic

### Rules

1. Shifts cannot overlap for the same user on the same day.
2. End time must be after start time.
3. A user can have multiple shifts per day (e.g., split shifts).
4. Supervisors can only manage shifts for users in their assigned locations.
5. Admins can manage any user's shifts.

### State

**Store**: `modules/userShifts/store.ts`

```typescript
interface UserShiftsState {
  shifts: UserShift[]
  selectedUserId: string | null
  loading: boolean
  error: string | null
  actions: {
    fetchShifts: (userId: string) => Promise<void>
    createShift: (data: Omit<UserShift, 'id' | 'createdAt'>) => Promise<void>
    updateShift: (id: string, data: Partial<UserShift>) => Promise<void>
    deleteShift: (id: string) => Promise<void>
    setSelectedUser: (userId: string) => void
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/user-shifts?userId=` | — | `UserShift[]` | ADMIN, SUPERVISOR |
| POST | `/api/user-shifts` | `{ userId, dayOfWeek, startTime, endTime, roleId, locationId }` | `UserShift` | ADMIN, SUPERVISOR |
| PUT | `/api/user-shifts/:id` | `Partial<UserShift>` | `UserShift` | ADMIN, SUPERVISOR |
| DELETE | `/api/user-shifts/:id` | — | `{ success: true }` | ADMIN, SUPERVISOR |

## Acceptance Criteria

- [ ] Admin/supervisor can select an employee and view their weekly shifts
- [ ] TimeGrid24hr renders shift blocks for each day of the week
- [ ] Admin/supervisor can add, edit, and delete shifts
- [ ] Overlapping shifts on the same day are rejected
- [ ] End time must be after start time
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive layout for mobile

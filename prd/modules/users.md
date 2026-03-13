# Users

## Overview

User management allows administrators to create and manage system users, assign them roles and locations, and maintain their profiles. Users are the central entity — referenced by time sessions, overtime requests, shifts, and alerts. This module also provides a profile page where any user can view/edit their own basic info.

## Dependencies

- **Data Models**: `User`, `JobRole`, `Location`, `SystemRole`
- **Shared Components**: DataTable, FormDialog, ConfirmDialog, PageHeader, StatusBadge
- **Modules**: locations (for location assignment), job-roles (for role assignment)

## User Stories

1. As an admin, I want to create user accounts with role and location assignments.
2. As an admin, I want to edit user details including reassigning roles and locations.
3. As an admin, I want to deactivate user accounts when employees leave.
4. As an admin, I want to search and filter the user list by role, location, or status.
5. As a user, I want to view my own profile with my assigned role and locations.
6. As an admin, I want to set/reset a user's PIN for Field Mode access.

## View Layer

### Components

**UsersPage** (`modules/users/components/UsersPage.tsx`)
- PageHeader: title "Users", subtitle "Manage system users", action: "Add User" button
- Filter dropdowns: System Role, Location, Status (Active/Inactive)
- DataTable with columns: Name, Email, System Role, Job Role, Locations, Status
- Row actions: Edit, Deactivate/Activate

**UserFormDialog** (`modules/users/components/UserFormDialog.tsx`)
- FormDialog wrapper
- Fields:
  - First Name (required), Last Name (required)
  - Email (required, validated)
  - PIN (required, 4-6 digits, masked input)
  - System Role (Select: FIELD_WORKER, SUPERVISOR, ADMIN, DATA_ENTRY_CLERK)
  - Job Role (Select from active job roles)
  - Locations (Multi-select from active locations)
  - Is Active (Switch)

**UserProfilePage** (`modules/users/components/UserProfilePage.tsx`)
- Displays current user's info: name, email, role, job title, assigned locations
- Read-only for most fields; user can update their own PIN
- Card-based layout

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/setup/users` | UsersPage | ADMIN |
| `/profile` | UserProfilePage | Any authenticated |

## Business Logic

### Rules

1. Email is required, must be valid format, and must be unique.
2. PIN must be 4-6 digits and unique system-wide (used for Field Mode login).
3. First name and last name are required.
4. At least one location must be assigned.
5. Job role assignment is required.
6. Deactivation is soft delete — `isActive: false`. Deactivated users cannot log in.
7. Admin cannot deactivate their own account.

### State

**Store**: `modules/users/store.ts`

```typescript
interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  filters: {
    role: SystemRole | ''
    locationId: string
    isActive: boolean | ''
  }
  actions: {
    fetchUsers: () => Promise<void>
    createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
    updateUser: (id: string, data: Partial<User>) => Promise<void>
    toggleActive: (id: string) => Promise<void>
    setFilter: (key: string, value: unknown) => void
    resetFilters: () => void
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/users` | Query: `?role=&locationId=&isActive=` | `User[]` | ADMIN |
| GET | `/api/users/:id` | — | `User` | ADMIN or self |
| POST | `/api/users` | `{ firstName, lastName, email, pin, systemRole, jobRoleId, locationIds, isActive }` | `User` | ADMIN |
| PUT | `/api/users/:id` | `Partial<User>` | `User` | ADMIN |
| PATCH | `/api/users/:id/toggle` | — | `User` | ADMIN |
| GET | `/api/users/me` | — | `User` | Any authenticated |
| PATCH | `/api/users/me/pin` | `{ pin }` | `{ success: true }` | Any authenticated |

## Acceptance Criteria

- [ ] Admin can create a user with all required fields
- [ ] Admin can edit user details including role and location reassignment
- [ ] Admin can deactivate/reactivate users
- [ ] Admin cannot deactivate their own account
- [ ] Duplicate emails and PINs are rejected with clear error messages
- [ ] Users can view their own profile
- [ ] Users can update their own PIN
- [ ] DataTable supports search, filter by role/location/status, sort, and pagination
- [ ] Non-admin users cannot access the users management page
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

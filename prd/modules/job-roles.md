# Job Roles

## Overview

Job roles define the positions field workers hold, each with a pay grade level. Roles are ordered from lowest to highest pay grade, which determines the step-up role options available to workers. Only roles above a worker's current level appear in the step-up dropdown. Administrators manage job roles via CRUD with drag-to-reorder capability.

## Dependencies

- **Data Models**: `JobRole`
- **Shared Components**: DataTable, FormDialog, ConfirmDialog, PageHeader

## User Stories

1. As an admin, I want to create job roles with pay grade levels so the step-up system works correctly.
2. As an admin, I want to reorder roles by pay grade to ensure the hierarchy is correct.
3. As an admin, I want to edit role names and levels.
4. As an admin, I want to deactivate roles that are no longer applicable.

## View Layer

### Components

**JobRolesPage** (`modules/jobRoles/components/JobRolesPage.tsx`)
- PageHeader: title "Job Roles", subtitle "Manage roles and pay grade ordering", action: "Add Role" button
- DataTable with drag-and-drop row reordering (or up/down arrow buttons)
- Columns: Sort Order, Name, Pay Grade Level, Status, Created Date
- Row actions: Edit, Deactivate/Activate, Move Up/Down

**JobRoleFormDialog** (`modules/jobRoles/components/JobRoleFormDialog.tsx`)
- FormDialog wrapper
- Fields: Name (TextField, required), Level (NumberField, required, min 1)
- Level auto-suggests next available level on create

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/setup/job-roles` | JobRolesPage | ADMIN |

## Business Logic

### Rules

1. Role name is required and must be unique.
2. Level (pay grade) must be a positive integer. Higher = higher pay grade.
3. `sortOrder` tracks display order and typically mirrors `level`.
4. Step-up filtering: A field worker with `jobRole.level = N` sees only roles with `level > N` in step-up dropdown.
5. Deactivation is soft delete — inactive roles still appear in historical entries.
6. Reordering updates `sortOrder` for all affected rows.

### State

**Store**: `modules/jobRoles/store.ts`

```typescript
interface JobRolesState {
  jobRoles: JobRole[]
  loading: boolean
  error: string | null
  actions: {
    fetchJobRoles: () => Promise<void>
    createJobRole: (data: Omit<JobRole, 'id' | 'createdAt' | 'sortOrder'>) => Promise<void>
    updateJobRole: (id: string, data: Partial<JobRole>) => Promise<void>
    toggleActive: (id: string) => Promise<void>
    reorder: (orderedIds: string[]) => Promise<void>
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/job-roles` | — | `JobRole[]` (sorted by sortOrder) | Any authenticated |
| GET | `/api/job-roles/:id` | — | `JobRole` | Any authenticated |
| POST | `/api/job-roles` | `{ name, level }` | `JobRole` | ADMIN |
| PUT | `/api/job-roles/:id` | `Partial<JobRole>` | `JobRole` | ADMIN |
| PATCH | `/api/job-roles/:id/toggle` | — | `JobRole` | ADMIN |
| PUT | `/api/job-roles/reorder` | `{ orderedIds: string[] }` | `JobRole[]` | ADMIN |

## Acceptance Criteria

- [ ] Admin can create a job role with name and pay grade level
- [ ] Admin can edit an existing job role
- [ ] Admin can reorder roles (drag or arrow buttons)
- [ ] Admin can deactivate/reactivate a role
- [ ] Roles are displayed sorted by pay grade level
- [ ] Duplicate role names are rejected
- [ ] DataTable supports search and pagination
- [ ] Non-admin users cannot access the page (route guard)
- [ ] Theme-consistent styling (Chronos Indigo)

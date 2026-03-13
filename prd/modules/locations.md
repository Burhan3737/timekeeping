# Locations

## Overview

Locations represent physical work sites where field workers operate. Administrators manage locations via CRUD operations. Locations are assigned to users and auto-populate on time entries. This is a foundational reference data module with no dependencies.

## Dependencies

- **Data Models**: `Location`
- **Shared Components**: DataTable, FormDialog, ConfirmDialog, PageHeader

## User Stories

1. As an admin, I want to add new work locations so field workers can be assigned to them.
2. As an admin, I want to edit location details to keep site information current.
3. As an admin, I want to deactivate a location (soft delete) so it no longer appears in dropdowns but historical data is preserved.
4. As an admin, I want to view all locations with search and sort capabilities.

## View Layer

### Components

**LocationsPage** (`modules/locations/components/LocationsPage.tsx`)
- PageHeader: title "Locations", subtitle "Manage work site locations", action: "Add Location" button
- DataTable displaying all locations
- Columns: Name, Description, Status (active/inactive), Created Date
- Row actions: Edit (icon button), Deactivate/Activate toggle

**LocationFormDialog** (`modules/locations/components/LocationFormDialog.tsx`)
- FormDialog wrapper
- Fields: Name (TextField, required), Description (TextField, multiline)
- Used for both create and edit (pre-populated for edit)

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/setup/locations` | LocationsPage | ADMIN |

## Business Logic

### Rules

1. Location name is required and must be unique (case-insensitive).
2. Deactivation is soft delete — sets `isActive: false`. Location still visible in historical time entries.
3. Only active locations appear in dropdowns (time entry, user assignment).

### State

**Store**: `modules/locations/store.ts`

```typescript
interface LocationsState {
  locations: Location[]
  loading: boolean
  error: string | null
  actions: {
    fetchLocations: () => Promise<void>
    createLocation: (data: Omit<Location, 'id' | 'createdAt'>) => Promise<void>
    updateLocation: (id: string, data: Partial<Location>) => Promise<void>
    toggleActive: (id: string) => Promise<void>
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/locations` | — | `Location[]` | Any authenticated |
| GET | `/api/locations/:id` | — | `Location` | Any authenticated |
| POST | `/api/locations` | `{ name, description }` | `Location` | ADMIN |
| PUT | `/api/locations/:id` | `Partial<Location>` | `Location` | ADMIN |
| PATCH | `/api/locations/:id/toggle` | — | `Location` | ADMIN |

## Acceptance Criteria

- [ ] Admin can create a location with name and description
- [ ] Admin can edit an existing location
- [ ] Admin can deactivate/reactivate a location
- [ ] Duplicate location names are rejected
- [ ] DataTable supports search, sort, and pagination
- [ ] Non-admin users cannot access the page (route guard)
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

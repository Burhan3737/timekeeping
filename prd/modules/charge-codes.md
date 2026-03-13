# Charge Codes

## Overview

Charge codes are billing/project identifiers that field workers assign to each time entry segment. Administrators manage charge codes via CRUD. Supervisors validate correct charge code usage during daily review. This is a foundational reference data module with no dependencies.

## Dependencies

- **Data Models**: `ChargeCode`
- **Shared Components**: DataTable, FormDialog, ConfirmDialog, PageHeader

## User Stories

1. As an admin, I want to create charge codes so field workers can assign them to time entries.
2. As an admin, I want to edit charge code details to keep billing information accurate.
3. As an admin, I want to deactivate a charge code so it no longer appears in dropdowns but historical records are preserved.
4. As an admin, I want to search and filter charge codes quickly.

## View Layer

### Components

**ChargeCodesPage** (`modules/chargeCodes/components/ChargeCodesPage.tsx`)
- PageHeader: title "Charge Codes", subtitle "Manage billing codes", action: "Add Charge Code" button
- DataTable displaying all charge codes
- Columns: Code, Description, Status, Created Date
- Row actions: Edit, Deactivate/Activate toggle

**ChargeCodeFormDialog** (`modules/chargeCodes/components/ChargeCodeFormDialog.tsx`)
- FormDialog wrapper
- Fields: Code (TextField, required), Description (TextField, multiline, required)
- Validation: code format, uniqueness

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/setup/charge-codes` | ChargeCodesPage | ADMIN |

## Business Logic

### Rules

1. Charge code `code` field is required and must be unique.
2. Description is required.
3. Deactivation is soft delete — `isActive: false`.
4. Only active charge codes appear in time entry dropdowns.
5. Supervisor validates correct charge code assignment during daily review.

### State

**Store**: `modules/chargeCodes/store.ts`

```typescript
interface ChargeCodesState {
  chargeCodes: ChargeCode[]
  loading: boolean
  error: string | null
  actions: {
    fetchChargeCodes: () => Promise<void>
    createChargeCode: (data: Omit<ChargeCode, 'id' | 'createdAt'>) => Promise<void>
    updateChargeCode: (id: string, data: Partial<ChargeCode>) => Promise<void>
    toggleActive: (id: string) => Promise<void>
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/charge-codes` | — | `ChargeCode[]` | Any authenticated |
| GET | `/api/charge-codes/:id` | — | `ChargeCode` | Any authenticated |
| POST | `/api/charge-codes` | `{ code, description }` | `ChargeCode` | ADMIN |
| PUT | `/api/charge-codes/:id` | `Partial<ChargeCode>` | `ChargeCode` | ADMIN |
| PATCH | `/api/charge-codes/:id/toggle` | — | `ChargeCode` | ADMIN |

## Acceptance Criteria

- [ ] Admin can create a charge code with code and description
- [ ] Admin can edit an existing charge code
- [ ] Admin can deactivate/reactivate a charge code
- [ ] Duplicate charge codes are rejected
- [ ] DataTable supports search, sort, and pagination
- [ ] Non-admin users cannot access the page (route guard)
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

# TekTracking — PRD Index

## Overview

Timekeeping is an enterprise web application for field organizations to accurately record daily work hours against authorized charge codes. It supports 24/7 operations, step-up job roles, overtime tracking with approval workflows, and supervisory review. Built with React + TypeScript + MUI (frontend) and Node.js + Express (backend).

## User Roles

| Role | Key Permissions | System Role Enum |
|------|----------------|-----------------|
| **Field Worker** | Enter daily time + charge codes, request overtime, select step-up roles | `FIELD_WORKER` |
| **Supervisor** | Review/edit/approve time entries, approve overtime, generate reports | `SUPERVISOR` |
| **Administrator** | Manage users, charge codes, job roles, locations, system settings | `ADMIN` |
| **Data Entry Clerk** | View approved reports (read-only), export data | `DATA_ENTRY_CLERK` |

## Navigation Structure (3 Sidebar Sections)

### Time Keeping
- Time Sessions (daily time entry)
- Overtime (request & track)

### Reporting
- Time Sheets (supervisor daily review — 24hr grid)
- Overtime Requests (supervisor OT management)
- Employees (status dashboard)
- Summary Sheet (date range reports)
- Alerts (notifications & config)

### Setup (Admin)
- Users (user management)
- Job Roles (pay grade ordering)
- Charge Codes (CRUD)
- Locations (CRUD)
- User Shifts (shift definitions)

## Module Registry

| Module | File | Phase | Status | Dependencies |
|--------|------|-------|--------|-------------|
| Locations | `modules/locations.md` | 2a | `view-complete` | — |
| Charge Codes | `modules/charge-codes.md` | 2b | `view-complete` | — |
| Job Roles | `modules/job-roles.md` | 2c | `view-complete` | — |
| Users | `modules/users.md` | 2d | `view-complete` | locations, job-roles |
| Auth | `modules/auth.md` | 3a | `planned` | users |
| Navigation | `modules/navigation.md` | 3b | `in-progress` | auth |
| User Shifts | `modules/user-shifts.md` | 4a | `view-complete` | users, job-roles, locations |
| Time Sessions | `modules/time-sessions.md` | 4b | `view-complete` | users, charge-codes, job-roles, locations |
| Overtime | `modules/overtime.md` | 4c | `view-pending` | time-sessions, charge-codes |
| Time Sheets | `modules/time-sheets.md` | 5a | `view-pending` | time-sessions |
| Overtime Requests | `modules/overtime-requests.md` | 5b | `view-pending` | overtime |
| Employees | `modules/employees.md` | 5c | `view-pending` | users, time-sessions, overtime |
| Summary Sheet | `modules/summary-sheet.md` | 5d | `view-pending` | time-sessions |
| Alerts | `modules/alerts.md` | 6a | `view-pending` | time-sessions, overtime |

## Build Order

### Phase 2: Admin Setup (no dependencies)
Reference data modules — CRUD patterns established here.
- **2a** `locations` → Location CRUD ✅ view layer done
- **2b** `charge-codes` → Charge code CRUD ✅ view layer done
- **2c** `job-roles` → Job roles with pay grade ordering ✅ view layer done
- **2d** `users` → User CRUD + profile + location/role assignment ✅ view layer done

### Phase 3: Auth & Navigation
- **3a** `auth` → Login (email/password) + Field Mode (PIN entry). Depends: users
- **3b** `navigation` → ~~Sidebar restructure (3 sections)~~ ✅ done early + Field Mode toggle (pending auth). Depends: auth

### Phase 4: Core Timekeeping
- **4a** `user-shifts` → Shift definitions per employee ✅ view layer done
- **4b** `time-sessions` → Daily time entry (central feature) ✅ view layer done
- **4c** `overtime` → Overtime request + threshold detection. Depends: time-sessions, charge-codes

### Phase 5: Reporting & Supervision
- **5a** `time-sheets` → Supervisor 24hr grid review. Depends: time-sessions
- **5b** `overtime-requests` → Supervisor OT management. Depends: overtime
- **5c** `employees` → Employee status dashboard. Depends: users, time-sessions, overtime
- **5d** `summary-sheet` → Date range summary reports. Depends: time-sessions

### Phase 6: Notifications
- **6a** `alerts` → Alert rules + notification display. Depends: time-sessions, overtime

## Implementation Approach

**Current strategy**: View layer first across ALL phases, no business logic yet. Mock/typed data passed as props. API wiring comes in a second pass once all views are reviewed and approved.

**View layer status**:
- ✅ Shared components (PageHeader, StatusBadge, ConfirmDialog, FormDialog, StatCard, DataTable, FilterBar, TimeGrid24hr)
- ✅ Phase 2 Admin Setup (Locations, Charge Codes, Job Roles, Users + Profile)
- 🔲 Phase 4 Core Timekeeping view layer (User Shifts, Time Sessions, Overtime) ← next
- 🔲 Phase 5 Reporting view layer (Time Sheets, OT Requests, Employees, Summary Sheet)
- 🔲 Phase 6 Notifications view layer (Alerts)
- 🔲 Phase 3 Auth view layer (Login page, PIN entry) ← after all feature views

**Build sequence within each phase**:
1. Shared components first — all module pages depend on these (done ✅)
2. Then module pages in phase order (currently working through view layer for all phases)

**Navigation**: `src/core/routing/navigationConfig.ts` is the single source of truth. Sidebar and tile view consume it automatically. To add a page: add entry to config + `<Route>` in `App.tsx`.

## Foundation References

- **Data Models**: [`_data-models.md`](./_data-models.md) — All entity interfaces & relationships
- **Shared Components**: [`_shared-components.md`](./_shared-components.md) — Reusable component specs
- **Shared Utilities**: [`_shared-utilities.md`](./_shared-utilities.md) — Utils & business logic specs
- **Theme**: [`ui/themes.md`](./ui/themes.md) — Chronos Indigo theme system

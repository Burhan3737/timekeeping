# Navigation

## Overview

Restructure the existing sidebar navigation into three sections matching the wireframe: Time Keeping, Reporting, and Setup. Add Field Mode toggle that switches the sidebar to show only field-relevant modules. This module modifies existing navigation components rather than creating new pages.

## Dependencies

- **Modules**: auth (Field Mode state)
- **Existing Components**: `shared/components/navigation/Sidebar.tsx`

## User Stories

1. As any user, I want organized navigation grouped by function so I can find features quickly.
2. As a supervisor, I want to toggle Field Mode from the sidebar to simulate the field worker view.
3. As a field worker in Field Mode, I want to see only Time Sessions and Overtime in the sidebar.

## View Layer

### Sidebar Sections (Standard Mode)

```
📋 TIME KEEPING
  ├── Time Sessions
  └── Overtime

📊 REPORTING
  ├── Time Sheets
  ├── Overtime Requests
  ├── Employees
  ├── Summary Sheet
  └── Alerts

⚙️ SETUP (Admin only)
  ├── Users
  ├── Job Roles
  ├── Charge Codes
  ├── Locations
  └── User Shifts
```

### Sidebar Sections (Field Mode)

```
📋 TIME KEEPING
  ├── Time Sessions
  └── Overtime
```

### Components Modified

**Sidebar** (`shared/components/navigation/Sidebar.tsx`)
- Group nav items by section with section headers
- Field Mode toggle switch at bottom of sidebar (visible to supervisors/admins)
- Role-based visibility: Setup section only for ADMIN
- Reporting section hidden in Field Mode

### Routes — No new routes. Existing route config updated to include `section` and `requiredRole` metadata.

## Business Logic

### Rules

1. Navigation items are role-filtered: admins see all, supervisors see Time Keeping + Reporting, field workers see Time Keeping only.
2. Field Mode (toggled by supervisor/admin) overrides role filtering to show only Time Keeping section.
3. Section headers use `text.secondary` color, all-caps, smaller font.
4. Active route highlighted with `primary.main` background tint.

## Acceptance Criteria

- [ ] Sidebar shows three distinct sections with headers
- [ ] Setup section visible only to ADMIN role
- [ ] Field Mode toggle visible to supervisors and admins
- [ ] Field Mode toggle hides Reporting and Setup sections
- [ ] Active route is visually highlighted
- [ ] Sidebar collapses responsively on mobile
- [ ] Theme-consistent styling (Chronos Indigo)

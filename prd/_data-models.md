# Data Models — Single Source of Truth

All TypeScript interfaces and enums for the TekTracking system. Module PRDs reference these types by name.

## Enums

```typescript
enum SystemRole {
  FIELD_WORKER = 'FIELD_WORKER',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
  DATA_ENTRY_CLERK = 'DATA_ENTRY_CLERK'
}

enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

enum OvertimeStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

enum AlertType {
  OVERTIME_DAILY = 'OVERTIME_DAILY',
  OVERTIME_WEEKLY = 'OVERTIME_WEEKLY',
  MISSING_TIME = 'MISSING_TIME',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ENTRY_REJECTED = 'ENTRY_REJECTED'
}

enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

enum TimeSessionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
```

## Entity Interfaces

### User

```typescript
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  pin: string                    // 4-6 digit PIN for Field Mode
  systemRole: SystemRole
  jobRoleId: string              // FK → JobRole
  locationIds: string[]          // FK[] → Location (assigned locations)
  isActive: boolean
  createdAt: string              // ISO 8601
  updatedAt: string
}
```

### JobRole

```typescript
interface JobRole {
  id: string
  name: string                   // e.g., "Electrician", "Foreman"
  level: number                  // Pay grade level (1 = lowest)
  sortOrder: number              // Display order (mirrors level)
  isActive: boolean
  createdAt: string
}
```

### ChargeCode

```typescript
interface ChargeCode {
  id: string
  code: string                   // e.g., "CC-1001"
  description: string
  isActive: boolean
  createdAt: string
}
```

### Location

```typescript
interface Location {
  id: string
  name: string                   // e.g., "Site Alpha"
  description: string
  isActive: boolean
  createdAt: string
}
```

### TimeSession

A daily container grouping all time entries for a user on a given date.

```typescript
interface TimeSession {
  id: string
  userId: string                 // FK → User
  date: string                   // ISO date (YYYY-MM-DD)
  locationId: string             // FK → Location
  totalHours: number             // Calculated sum of entries
  entryCount: number             // Number of TimeEntry records
  status: TimeSessionStatus
  notes: string
  submittedAt: string | null
  reviewedBy: string | null      // FK → User (supervisor)
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}
```

### TimeEntry

Individual work segment within a TimeSession.

```typescript
interface TimeEntry {
  id: string
  sessionId: string              // FK → TimeSession
  startTime: string              // HH:mm (24hr format)
  endTime: string                // HH:mm (24hr format)
  durationMinutes: number        // Calculated
  chargeCodeId: string           // FK → ChargeCode (mandatory)
  stepUpRoleId: string | null    // FK → JobRole (optional step-up)
  isOvertime: boolean            // System-calculated
  locationId: string             // FK → Location
  notes: string
  createdAt: string
  updatedAt: string
}
```

### OvertimeRequest

```typescript
interface OvertimeRequest {
  id: string
  userId: string                 // FK → User (requester)
  date: string                   // ISO date for the OT work
  startTime: string              // HH:mm planned start
  estimatedDurationMinutes: number
  chargeCodeId: string           // FK → ChargeCode
  stepUpRoleId: string | null    // FK → JobRole
  reason: string
  status: OvertimeStatus
  reviewedBy: string | null      // FK → User (supervisor)
  reviewedAt: string | null
  reviewNotes: string | null
  createdAt: string
  updatedAt: string
}
```

### UserShift

Defines a recurring shift for an employee on a specific day of the week.

```typescript
interface UserShift {
  id: string
  userId: string                 // FK → User
  dayOfWeek: DayOfWeek
  startTime: string              // HH:mm
  endTime: string                // HH:mm
  roleId: string                 // FK → JobRole (role during this shift)
  locationId: string             // FK → Location
  isActive: boolean
  createdAt: string
}
```

### Alert

```typescript
interface Alert {
  id: string
  type: AlertType
  userId: string                 // FK → User (recipient)
  relatedUserId: string | null   // FK → User (subject, e.g., the worker)
  message: string
  isRead: boolean
  createdAt: string
}
```

### AlertConfig

```typescript
interface AlertConfig {
  id: string
  type: AlertType
  enabled: boolean
  threshold: number | null       // e.g., 8 for daily hours, 40 for weekly
  recipients: string[]           // SystemRole[] that receive this alert type
  createdAt: string
  updatedAt: string
}
```

## Entity Relationships

```
User ──┬── 1:N ──→ TimeSession (userId)
       ├── 1:N ──→ OvertimeRequest (userId)
       ├── 1:N ──→ UserShift (userId)
       ├── 1:N ──→ Alert (userId)
       ├── N:1 ──→ JobRole (jobRoleId)
       └── N:M ──→ Location (locationIds[])

TimeSession ── 1:N ──→ TimeEntry (sessionId)

TimeEntry ──┬── N:1 ──→ ChargeCode (chargeCodeId)
            ├── N:1 ──→ JobRole (stepUpRoleId, optional)
            └── N:1 ──→ Location (locationId)

OvertimeRequest ──┬── N:1 ──→ ChargeCode (chargeCodeId)
                  └── N:1 ──→ JobRole (stepUpRoleId, optional)

UserShift ──┬── N:1 ──→ JobRole (roleId)
            └── N:1 ──→ Location (locationId)

AlertConfig ── standalone (system-wide settings)
```

## Key Business Rules (Cross-cutting)

1. **Step-up filtering**: When a Field Worker selects step-up, only JobRoles with `level > user.jobRole.level` are shown.
2. **Overtime thresholds**: Daily > 8 hours, Weekly > 40 hours. Configurable via AlertConfig.
3. **Time entry validation**: `endTime > startTime`, no overlapping entries in same session, charge code required.
4. **Session lifecycle**: DRAFT → SUBMITTED (by worker) → APPROVED/REJECTED (by supervisor).
5. **PIN uniqueness**: Each user's PIN must be unique system-wide (used for Field Mode login).

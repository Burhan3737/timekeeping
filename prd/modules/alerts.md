# Alerts

## Overview

The alerts module provides two functions: (1) a notification inbox showing alerts triggered by the system (overtime thresholds, missing time, approval status changes), and (2) an admin configuration panel for alert rules and thresholds. Alerts are generated server-side based on time session and overtime data.

## Dependencies

- **Data Models**: `Alert`, `AlertConfig`, `AlertType`, `User`
- **Shared Components**: PageHeader, DataTable, StatusBadge, FormDialog
- **Modules**: time-sessions, overtime

## User Stories

1. As a supervisor, I want to see alerts when an employee exceeds 8 daily hours or approaches 40 weekly hours.
2. As a supervisor, I want to see alerts for employees who haven't submitted time today.
3. As a field worker, I want to see when my overtime request is approved or rejected.
4. As an admin, I want to configure which alerts are enabled and their thresholds.
5. As any user, I want to mark alerts as read.

## View Layer

### Components

**AlertsPage** (`modules/alerts/components/AlertsPage.tsx`)
- PageHeader: title "Alerts"
- Tabs: "Notifications" | "Configuration" (config tab admin-only)
- Badge count on sidebar nav item showing unread count

**AlertsList** (`modules/alerts/components/AlertsList.tsx`)
- List of alert cards, newest first
- Each card: icon (by type), message, timestamp, read/unread indicator
- Click to mark as read
- "Mark All Read" button
- Filter: alert type, read/unread

**AlertConfigPanel** (`modules/alerts/components/AlertConfigPanel.tsx`)
- Admin-only tab
- DataTable of alert configuration rules
- Columns: Alert Type, Enabled (toggle), Threshold, Recipients
- Edit row to change threshold or recipients
- Uses FormDialog for editing

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/reporting/alerts` | AlertsPage | Any authenticated |

## Business Logic

### Rules

1. **Overtime Daily Alert**: Triggered when a user's daily hours exceed `AlertConfig.threshold` (default: 8).
2. **Overtime Weekly Alert**: Triggered when weekly hours exceed threshold (default: 40).
3. **Missing Time Alert**: Triggered at configurable time if an active worker has no entries for the current date.
4. **Pending Approval Alert**: Sent to supervisor when a session is submitted for review.
5. **Entry Rejected Alert**: Sent to worker when their session is rejected.
6. Alerts are generated server-side (scheduled job or event-driven).
7. Recipients defined per alert type in AlertConfig (by SystemRole).
8. Unread count shown in sidebar navigation badge.

### State

**Store**: `modules/alerts/store.ts`

```typescript
interface AlertsState {
  alerts: Alert[]
  unreadCount: number
  configs: AlertConfig[]
  loading: boolean
  error: string | null
  actions: {
    fetchAlerts: (params?: { type?: string; isRead?: boolean }) => Promise<void>
    markAsRead: (id: string) => Promise<void>
    markAllRead: () => Promise<void>
    fetchConfigs: () => Promise<void>
    updateConfig: (id: string, data: Partial<AlertConfig>) => Promise<void>
  }
}
```

## API Endpoints

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| GET | `/api/alerts` | Query: `?type=&isRead=` | `Alert[]` | Authenticated |
| GET | `/api/alerts/unread-count` | — | `{ count: number }` | Authenticated |
| PATCH | `/api/alerts/:id/read` | — | `Alert` | Authenticated |
| POST | `/api/alerts/mark-all-read` | — | `{ success: true }` | Authenticated |
| GET | `/api/alert-configs` | — | `AlertConfig[]` | ADMIN |
| PUT | `/api/alert-configs/:id` | `Partial<AlertConfig>` | `AlertConfig` | ADMIN |

## Acceptance Criteria

- [ ] Users see their alerts in a notification list
- [ ] Alerts show correct icon and message per type
- [ ] Users can mark individual alerts as read
- [ ] "Mark All Read" clears all unread indicators
- [ ] Unread count badge shown in sidebar navigation
- [ ] Admin can view and edit alert configurations
- [ ] Admin can enable/disable alert types and set thresholds
- [ ] Filter by alert type and read/unread status
- [ ] Theme-consistent styling (Chronos Indigo)
- [ ] Responsive on mobile

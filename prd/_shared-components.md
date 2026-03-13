# Shared Components

Reusable components in `frontend/src/shared/components/`. Each module PRD references these by name.

## DataTable

**Location**: `shared/components/DataTable/DataTable.tsx`
**Used by**: charge-codes, locations, job-roles, users, overtime-requests, employees, alerts

Sortable, filterable, paginated MUI table.

### Props

```typescript
interface Column<T> {
  id: keyof T | string
  label: string
  sortable?: boolean              // default: true
  render?: (row: T) => ReactNode  // custom cell renderer
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  loading?: boolean
  searchable?: boolean            // show search input (default: true)
  searchPlaceholder?: string
  pagination?: boolean            // default: true
  rowsPerPage?: number            // default: 10
  actions?: (row: T) => ReactNode // row action buttons
  onRowClick?: (row: T) => void
  emptyMessage?: string
  dense?: boolean
}
```

### Features
- Column sort (click header)
- Text search across all string columns
- Pagination with rows-per-page selector
- Custom cell renderers (for StatusBadge, action buttons, etc.)
- Loading skeleton state
- Empty state message
- Theme-consistent (Chronos Indigo tokens)

---

## FormDialog

**Location**: `shared/components/FormDialog/FormDialog.tsx`
**Used by**: All CRUD modules

Modal dialog wrapper for create/edit forms.

### Props

```typescript
interface FormDialogProps {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: () => void
  loading?: boolean
  submitLabel?: string            // default: "Save"
  cancelLabel?: string            // default: "Cancel"
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg'  // default: 'sm'
  children: ReactNode             // form fields
}
```

### Features
- MUI Dialog with consistent header/footer
- Submit + Cancel buttons in footer
- Loading state disables buttons, shows spinner on submit
- Escape key closes dialog
- Consistent padding and spacing

---

## StatusBadge

**Location**: `shared/components/StatusBadge/StatusBadge.tsx`
**Used by**: time-sessions, overtime, overtime-requests, employees, alerts

Color-coded status indicator using MUI Chip.

### Props

```typescript
interface StatusBadgeProps {
  status: string
  colorMap?: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'>
  size?: 'small' | 'medium'      // default: 'small'
}
```

### Default Color Map
```typescript
const DEFAULT_COLORS = {
  APPROVED: 'success',
  PENDING: 'warning',
  SUBMITTED: 'info',
  REJECTED: 'error',
  DRAFT: 'default',
  REQUESTED: 'warning',
  CANCELLED: 'default',
  ACTIVE: 'success',
  INACTIVE: 'default'
}
```

---

## TimeGrid24hr

**Location**: `shared/components/TimeGrid24hr/TimeGrid24hr.tsx`
**Used by**: time-sheets, user-shifts, summary-sheet

24-hour horizontal bar grid showing time segments. Most complex shared component.

### Props

```typescript
interface TimeSegment {
  id: string
  startTime: string              // HH:mm
  endTime: string                // HH:mm
  label?: string                 // e.g., charge code
  type: 'normal' | 'stepup' | 'overtime'
  tooltip?: string               // hover detail
}

interface TimeGrid24hrProps {
  segments: TimeSegment[]
  date?: string                  // display date label
  editable?: boolean             // click segments to edit (default: false)
  onSegmentClick?: (segment: TimeSegment) => void
  showLegend?: boolean           // default: true
  height?: number                // bar height in px (default: 40)
}
```

### Color Coding
- **Normal**: `primary.main` (indigo)
- **Step-Up**: `error.main` (red)
- **Overtime**: `warning.main` (amber/orange)

### Features
- Hour markers (0–23) along horizontal axis
- Proportional segment widths based on start/end times
- Hover tooltip with entry details
- Click handler for editable mode
- Legend showing color meaning
- Responsive — collapses gracefully on mobile

---

## StatCard

**Location**: `shared/components/StatCard/StatCard.tsx`
**Used by**: home, employees, summary-sheet, time-sessions

Metric display card with icon.

### Props

```typescript
interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  color?: string                  // theme color token
  subtitle?: string
  onClick?: () => void
}
```

---

## ConfirmDialog

**Location**: `shared/components/ConfirmDialog/ConfirmDialog.tsx`
**Used by**: All CRUD modules (delete actions)

### Props

```typescript
interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string           // default: "Delete"
  confirmColor?: 'error' | 'primary' | 'warning'  // default: 'error'
  loading?: boolean
}
```

---

## PageHeader

**Location**: `shared/components/PageHeader/PageHeader.tsx`
**Used by**: All module pages

### Props

```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode             // e.g., Add button
}
```

---

## FilterBar

**Location**: `shared/components/FilterBar/FilterBar.tsx`
**Used by**: time-sheets, summary-sheet, overtime-requests, employees

Date range and dropdown filter bar.

### Props

```typescript
interface FilterOption {
  label: string
  value: string
}

interface FilterConfig {
  id: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

interface FilterBarProps {
  dateRange?: {
    startDate: string
    endDate: string
    onStartChange: (date: string) => void
    onEndChange: (date: string) => void
  }
  filters?: FilterConfig[]
  onReset?: () => void
}
```

### Features
- MUI DatePicker for date range
- Select dropdowns for categorical filters
- Reset button to clear all
- Horizontal layout, wraps on mobile

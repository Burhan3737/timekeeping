import { SvgIconComponent } from '@mui/icons-material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MoreTimeIcon from '@mui/icons-material/MoreTime'
import TableChartIcon from '@mui/icons-material/TableChart'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import SummarizeIcon from '@mui/icons-material/Summarize'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import WorkIcon from '@mui/icons-material/Work'
import CodeIcon from '@mui/icons-material/Code'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ScheduleIcon from '@mui/icons-material/Schedule'

export interface NavItem {
  /** Display label in sidebar and tile view */
  label: string
  /** React Router path */
  path: string
  /** MUI icon component (rendered at caller's preferred size) */
  icon: SvgIconComponent
  /** Short description shown in tile view */
  description: string
  /** MUI palette path for accent color, e.g. 'primary.main' */
  color: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/**
 * Single source of truth for all application navigation.
 *
 * To add a new page:
 *  1. Add an entry here
 *  2. Register the route + component in App.tsx
 */
export const navigationConfig: NavSection[] = [
  {
    title: 'Time Keeping',
    items: [
      {
        label: 'Time Sessions',
        path: '/time-sessions',
        icon: AccessTimeIcon,
        description: 'Log and manage your daily work hours',
        color: 'primary.main',
      },
      {
        label: 'Overtime',
        path: '/overtime',
        icon: MoreTimeIcon,
        description: 'Request and track overtime hours',
        color: 'secondary.main',
      },
    ],
  },
  {
    title: 'Reporting',
    items: [
      {
        label: 'Time Sheets',
        path: '/reporting/time-sheets',
        icon: TableChartIcon,
        description: 'Supervisor 24-hour grid review',
        color: 'info.main',
      },
      {
        label: 'Overtime Requests',
        path: '/reporting/overtime-requests',
        icon: PendingActionsIcon,
        description: 'Manage and approve OT requests',
        color: 'warning.main',
      },
      {
        label: 'Employees',
        path: '/reporting/employees',
        icon: PeopleAltIcon,
        description: 'Employee status dashboard',
        color: 'success.main',
      },
      {
        label: 'Summary Sheet',
        path: '/reporting/summary-sheet',
        icon: SummarizeIcon,
        description: 'Date range summary reports',
        color: 'primary.main',
      },
      {
        label: 'Alerts',
        path: '/reporting/alerts',
        icon: NotificationsIcon,
        description: 'Notifications and alert configuration',
        color: 'error.main',
      },
    ],
  },
  {
    title: 'Setup',
    items: [
      {
        label: 'Users',
        path: '/setup/users',
        icon: ManageAccountsIcon,
        description: 'User accounts, roles, and locations',
        color: 'secondary.main',
      },
      {
        label: 'Job Roles',
        path: '/setup/job-roles',
        icon: WorkIcon,
        description: 'Pay grades and role ordering',
        color: 'info.main',
      },
      {
        label: 'Charge Codes',
        path: '/setup/charge-codes',
        icon: CodeIcon,
        description: 'Billing and charge code management',
        color: 'warning.main',
      },
      {
        label: 'Locations',
        path: '/setup/locations',
        icon: LocationOnIcon,
        description: 'Work site locations',
        color: 'success.main',
      },
      {
        label: 'User Shifts',
        path: '/setup/user-shifts',
        icon: ScheduleIcon,
        description: 'Shift definitions per employee',
        color: 'primary.main',
      },
    ],
  },
]

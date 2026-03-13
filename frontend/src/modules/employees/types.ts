import type { TimeSessionStatus } from '@modules/timeSessions'

export interface EmployeeDashboardItem {
  id: string   // = userId, required by DataTable
  userId: string
  name: string
  jobRole: string
  jobRoleId: string
  locationId: string
  locationName: string
  todaySessionId?: string
  todaySessionStatus?: TimeSessionStatus
  todayHours: number
  weeklyHours: number
  pendingOTCount: number
  isActive: boolean
}

export interface EmployeeStats {
  totalActive: number
  clockedInToday: number
  missingTimeToday: number
  overtimeActive: number
}

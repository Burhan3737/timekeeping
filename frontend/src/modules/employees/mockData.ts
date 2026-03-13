import type { EmployeeDashboardItem, EmployeeStats } from './types'

export const MOCK_LOCATIONS_REF = [
  { id: 'loc1', name: 'Site Alpha' },
  { id: 'loc2', name: 'North Yard' },
  { id: 'loc3', name: 'East Terminal' },
]

export const MOCK_ROLES_REF = [
  { id: 'jr1', name: 'Trainee Operator' },
  { id: 'jr2', name: 'Field Operator' },
  { id: 'jr3', name: 'Senior Operator' },
  { id: 'jr4', name: 'Lead Technician' },
  { id: 'jr5', name: 'Shift Supervisor' },
]

export const MOCK_EMPLOYEES: EmployeeDashboardItem[] = [
  {
    id: 'u3', userId: 'u3', name: 'James Tran', jobRole: 'Field Operator', jobRoleId: 'jr2',
    locationId: 'loc2', locationName: 'North Yard',
    todaySessionId: 'sess-1', todaySessionStatus: 'SUBMITTED',
    todayHours: 8.5, weeklyHours: 41.0, pendingOTCount: 1, isActive: true,
  },
  {
    id: 'u4', userId: 'u4', name: 'Maria Santos', jobRole: 'Senior Operator', jobRoleId: 'jr3',
    locationId: 'loc2', locationName: 'North Yard',
    todaySessionId: 'sess-2', todaySessionStatus: 'SUBMITTED',
    todayHours: 8.0, weeklyHours: 38.5, pendingOTCount: 0, isActive: true,
  },
  {
    id: 'u5', userId: 'u5', name: 'Chen Wei', jobRole: 'Field Operator', jobRoleId: 'jr2',
    locationId: 'loc3', locationName: 'East Terminal',
    todaySessionId: 'sess-3', todaySessionStatus: 'DRAFT',
    todayHours: 5.5, weeklyHours: 32.0, pendingOTCount: 1, isActive: true,
  },
  {
    id: 'u6', userId: 'u6', name: 'Priya Nair', jobRole: 'Field Operator', jobRoleId: 'jr2',
    locationId: 'loc1', locationName: 'Site Alpha',
    todaySessionId: 'sess-4', todaySessionStatus: 'APPROVED',
    todayHours: 7.5, weeklyHours: 36.5, pendingOTCount: 0, isActive: true,
  },
  {
    id: 'u7', userId: 'u7', name: 'Kofi Mensah', jobRole: 'Field Operator', jobRoleId: 'jr2',
    locationId: 'loc1', locationName: 'Site Alpha',
    todaySessionId: undefined, todaySessionStatus: undefined,
    todayHours: 0, weeklyHours: 28.0, pendingOTCount: 1, isActive: true,
  },
  {
    id: 'u8', userId: 'u8', name: 'Aisha Diallo', jobRole: 'Lead Technician', jobRoleId: 'jr4',
    locationId: 'loc3', locationName: 'East Terminal',
    todaySessionId: undefined, todaySessionStatus: undefined,
    todayHours: 0, weeklyHours: 24.0, pendingOTCount: 0, isActive: true,
  },
  {
    id: 'u9', userId: 'u9', name: 'Ravi Kumar', jobRole: 'Trainee Operator', jobRoleId: 'jr1',
    locationId: 'loc2', locationName: 'North Yard',
    todaySessionId: 'sess-9', todaySessionStatus: 'DRAFT',
    todayHours: 3.0, weeklyHours: 15.0, pendingOTCount: 0, isActive: true,
  },
  {
    id: 'u10', userId: 'u10', name: 'Fatou Bah', jobRole: 'Senior Operator', jobRoleId: 'jr3',
    locationId: 'loc1', locationName: 'Site Alpha',
    todaySessionId: 'sess-10', todaySessionStatus: 'REJECTED',
    todayHours: 4.0, weeklyHours: 30.0, pendingOTCount: 0, isActive: true,
  },
]

export const MOCK_EMPLOYEE_STATS: EmployeeStats = {
  totalActive: 8,
  clockedInToday: 5,
  missingTimeToday: 2,
  overtimeActive: 2,
}

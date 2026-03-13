import type { UserShift } from './types'

// Re-used from users mock — lightweight refs for the selector
export const MOCK_USERS_REF = [
  { id: 'u1', name: 'Marcus Rivera' },
  { id: 'u2', name: 'Sandra Okafor' },
  { id: 'u3', name: 'James Tran' },
  { id: 'u4', name: 'Priya Patel' },
  { id: 'u6', name: 'Aisha Mensah' },
  { id: 'u7', name: 'Carlos Ibarra' },
]

export const MOCK_JOB_ROLES_REF = [
  { id: 'jr1', name: 'Labourer' },
  { id: 'jr2', name: 'Field Operator' },
  { id: 'jr3', name: 'Senior Operator' },
  { id: 'jr4', name: 'Lead Technician' },
  { id: 'jr5', name: 'Shift Supervisor' },
  { id: 'jr6', name: 'Site Manager' },
]

export const MOCK_LOCATIONS_REF = [
  { id: 'loc1', name: 'Site Alpha' },
  { id: 'loc2', name: 'North Yard' },
  { id: 'loc3', name: 'East Terminal' },
  { id: 'loc4', name: 'South Gate' },
  { id: 'loc5', name: 'Maintenance Bay' },
]

export const MOCK_SHIFTS: UserShift[] = [
  // Marcus Rivera (u1) — Site Manager, Mon-Fri standard
  { id: 's1', userId: 'u1', dayOfWeek: 'MONDAY',    startTime: '07:00', endTime: '15:00', roleId: 'jr6', locationId: 'loc1', isActive: true, createdAt: '2025-01-10' },
  { id: 's2', userId: 'u1', dayOfWeek: 'TUESDAY',   startTime: '07:00', endTime: '15:00', roleId: 'jr6', locationId: 'loc1', isActive: true, createdAt: '2025-01-10' },
  { id: 's3', userId: 'u1', dayOfWeek: 'WEDNESDAY', startTime: '07:00', endTime: '15:00', roleId: 'jr6', locationId: 'loc1', isActive: true, createdAt: '2025-01-10' },
  { id: 's4', userId: 'u1', dayOfWeek: 'THURSDAY',  startTime: '07:00', endTime: '15:00', roleId: 'jr6', locationId: 'loc1', isActive: true, createdAt: '2025-01-10' },
  { id: 's5', userId: 'u1', dayOfWeek: 'FRIDAY',    startTime: '07:00', endTime: '15:00', roleId: 'jr6', locationId: 'loc1', isActive: true, createdAt: '2025-01-10' },

  // James Tran (u3) — Field Operator, rotating shifts
  { id: 's6',  userId: 'u3', dayOfWeek: 'MONDAY',    startTime: '06:00', endTime: '14:00', roleId: 'jr2', locationId: 'loc2', isActive: true, createdAt: '2025-02-01' },
  { id: 's7',  userId: 'u3', dayOfWeek: 'TUESDAY',   startTime: '06:00', endTime: '14:00', roleId: 'jr2', locationId: 'loc2', isActive: true, createdAt: '2025-02-01' },
  { id: 's8',  userId: 'u3', dayOfWeek: 'WEDNESDAY', startTime: '14:00', endTime: '22:00', roleId: 'jr2', locationId: 'loc2', isActive: true, createdAt: '2025-02-01' },
  { id: 's9',  userId: 'u3', dayOfWeek: 'THURSDAY',  startTime: '14:00', endTime: '22:00', roleId: 'jr2', locationId: 'loc2', isActive: true, createdAt: '2025-02-01' },
  { id: 's10', userId: 'u3', dayOfWeek: 'SATURDAY',  startTime: '06:00', endTime: '14:00', roleId: 'jr2', locationId: 'loc2', isActive: true, createdAt: '2025-02-01' },
]

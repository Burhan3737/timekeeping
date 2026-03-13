import type { SessionWithDetail } from './types'

export const MOCK_CHARGE_CODES_REF = [
  { id: 'cc1', code: 'CC-1001', description: 'General Operations' },
  { id: 'cc2', code: 'CC-1002', description: 'Site Maintenance' },
  { id: 'cc3', code: 'PROJ-42', description: 'North Yard Expansion' },
  { id: 'cc4', code: 'PROJ-43', description: 'East Terminal Upgrade' },
  { id: 'cc5', code: 'OT-EMRG', description: 'Emergency Overtime' },
]

export const MOCK_LOCATIONS_REF = [
  { id: 'loc1', name: 'Site Alpha' },
  { id: 'loc2', name: 'North Yard' },
  { id: 'loc3', name: 'East Terminal' },
]

export const STEP_UP_ROLES_REF = [
  { id: 'jr3', name: 'Senior Operator', level: 3 },
  { id: 'jr4', name: 'Lead Technician', level: 4 },
  { id: 'jr5', name: 'Shift Supervisor', level: 5 },
]

export const CHARGE_CODE_MAP: Record<string, string> = {
  cc1: 'CC-1001', cc2: 'CC-1002', cc3: 'PROJ-42', cc4: 'PROJ-43', cc5: 'OT-EMRG',
}

export const STEP_UP_ROLE_MAP: Record<string, string> = {
  jr3: 'Senior Operator', jr4: 'Lead Technician', jr5: 'Shift Supervisor',
}

const TODAY = new Date().toISOString().slice(0, 10)

export const MOCK_SESSIONS: SessionWithDetail[] = [
  {
    id: 'sess-1',
    userId: 'u3',
    user: { id: 'u3', name: 'James Tran', jobRole: 'Field Operator', jobRoleLevel: 2, locationId: 'loc2', locationName: 'North Yard' },
    date: TODAY,
    totalHours: 8.5,
    entryCount: 4,
    status: 'SUBMITTED',
    submittedAt: TODAY,
    entries: [
      { id: 'e1', sessionId: 'sess-1', startTime: '06:00', endTime: '08:00', durationMinutes: 120, chargeCodeId: 'cc3', isOvertime: false, locationId: 'loc2', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e2', sessionId: 'sess-1', startTime: '08:30', endTime: '12:00', durationMinutes: 210, chargeCodeId: 'cc1', stepUpRoleId: 'jr3', isOvertime: false, locationId: 'loc2', notes: 'Covering for senior operator', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e3', sessionId: 'sess-1', startTime: '13:00', endTime: '15:00', durationMinutes: 120, chargeCodeId: 'cc2', isOvertime: false, locationId: 'loc2', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e4', sessionId: 'sess-1', startTime: '15:00', endTime: '16:30', durationMinutes: 90, chargeCodeId: 'cc3', isOvertime: true, locationId: 'loc2', createdAt: TODAY, updatedAt: TODAY },
    ],
    createdAt: TODAY,
    updatedAt: TODAY,
  },
  {
    id: 'sess-2',
    userId: 'u4',
    user: { id: 'u4', name: 'Maria Santos', jobRole: 'Senior Operator', jobRoleLevel: 3, locationId: 'loc2', locationName: 'North Yard' },
    date: TODAY,
    totalHours: 8.0,
    entryCount: 3,
    status: 'SUBMITTED',
    submittedAt: TODAY,
    entries: [
      { id: 'e5', sessionId: 'sess-2', startTime: '07:00', endTime: '11:00', durationMinutes: 240, chargeCodeId: 'cc3', isOvertime: false, locationId: 'loc2', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e6', sessionId: 'sess-2', startTime: '11:30', endTime: '14:30', durationMinutes: 180, chargeCodeId: 'cc1', isOvertime: false, locationId: 'loc2', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e7', sessionId: 'sess-2', startTime: '15:00', endTime: '16:00', durationMinutes: 60, chargeCodeId: 'cc4', isOvertime: false, locationId: 'loc2', createdAt: TODAY, updatedAt: TODAY },
    ],
    createdAt: TODAY,
    updatedAt: TODAY,
  },
  {
    id: 'sess-3',
    userId: 'u5',
    user: { id: 'u5', name: 'Chen Wei', jobRole: 'Field Operator', jobRoleLevel: 2, locationId: 'loc3', locationName: 'East Terminal' },
    date: TODAY,
    totalHours: 9.5,
    entryCount: 3,
    status: 'SUBMITTED',
    submittedAt: TODAY,
    entries: [
      { id: 'e8', sessionId: 'sess-3', startTime: '05:00', endTime: '09:00', durationMinutes: 240, chargeCodeId: 'cc4', isOvertime: false, locationId: 'loc3', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e9', sessionId: 'sess-3', startTime: '09:30', endTime: '14:00', durationMinutes: 270, chargeCodeId: 'cc4', stepUpRoleId: 'jr4', isOvertime: false, locationId: 'loc3', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e10', sessionId: 'sess-3', startTime: '14:30', endTime: '16:00', durationMinutes: 90, chargeCodeId: 'cc5', isOvertime: true, locationId: 'loc3', createdAt: TODAY, updatedAt: TODAY },
    ],
    createdAt: TODAY,
    updatedAt: TODAY,
  },
  {
    id: 'sess-4',
    userId: 'u6',
    user: { id: 'u6', name: 'Priya Nair', jobRole: 'Field Operator', jobRoleLevel: 2, locationId: 'loc1', locationName: 'Site Alpha' },
    date: TODAY,
    totalHours: 7.5,
    entryCount: 2,
    status: 'APPROVED',
    submittedAt: TODAY,
    reviewedBy: 'Sandra Okafor',
    reviewedAt: TODAY,
    entries: [
      { id: 'e11', sessionId: 'sess-4', startTime: '08:00', endTime: '12:30', durationMinutes: 270, chargeCodeId: 'cc1', isOvertime: false, locationId: 'loc1', createdAt: TODAY, updatedAt: TODAY },
      { id: 'e12', sessionId: 'sess-4', startTime: '13:00', endTime: '16:00', durationMinutes: 180, chargeCodeId: 'cc2', isOvertime: false, locationId: 'loc1', createdAt: TODAY, updatedAt: TODAY },
    ],
    createdAt: TODAY,
    updatedAt: TODAY,
  },
]

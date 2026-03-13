import type { TimeSession, TimeEntry } from './types'

// Current mock user — Field Operator, level 2
export const CURRENT_USER = {
  id: 'u3',
  name: 'James Tran',
  jobRoleId: 'jr2',
  jobRoleLevel: 2,
  primaryLocationId: 'loc2',
}

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

// Step-up roles: only those with level > CURRENT_USER.jobRoleLevel (2)
export const STEP_UP_ROLES_REF = [
  { id: 'jr3', name: 'Senior Operator',  level: 3 },
  { id: 'jr4', name: 'Lead Technician',  level: 4 },
  { id: 'jr5', name: 'Shift Supervisor', level: 5 },
]

const TODAY = new Date().toISOString().slice(0, 10)

export const MOCK_CURRENT_SESSION: TimeSession = {
  id: 'sess-today',
  userId: 'u3',
  date: TODAY,
  totalHours: 5.5,
  entryCount: 3,
  status: 'DRAFT',
  createdAt: TODAY,
  updatedAt: TODAY,
}

export const MOCK_CURRENT_ENTRIES: TimeEntry[] = [
  {
    id: 'e1', sessionId: 'sess-today',
    startTime: '06:00', endTime: '08:00', durationMinutes: 120,
    chargeCodeId: 'cc3', isOvertime: false, locationId: 'loc2',
    createdAt: TODAY, updatedAt: TODAY,
  },
  {
    id: 'e2', sessionId: 'sess-today',
    startTime: '08:30', endTime: '12:00', durationMinutes: 210,
    chargeCodeId: 'cc1', stepUpRoleId: 'jr3', isOvertime: false, locationId: 'loc2',
    notes: 'Covering for senior operator',
    createdAt: TODAY, updatedAt: TODAY,
  },
  {
    id: 'e3', sessionId: 'sess-today',
    startTime: '13:00', endTime: '14:30', durationMinutes: 90,
    chargeCodeId: 'cc2', isOvertime: false, locationId: 'loc2',
    createdAt: TODAY, updatedAt: TODAY,
  },
]

export const MOCK_SESSION_HISTORY: TimeSession[] = [
  { id: 'h1', userId: 'u3', date: '2026-03-12', totalHours: 8.0,  entryCount: 4, status: 'APPROVED',   submittedAt: '2026-03-12', reviewedBy: 'Sandra Okafor', reviewedAt: '2026-03-12', createdAt: '2026-03-12', updatedAt: '2026-03-12' },
  { id: 'h2', userId: 'u3', date: '2026-03-11', totalHours: 9.5,  entryCount: 5, status: 'APPROVED',   submittedAt: '2026-03-11', reviewedBy: 'Sandra Okafor', reviewedAt: '2026-03-11', createdAt: '2026-03-11', updatedAt: '2026-03-11' },
  { id: 'h3', userId: 'u3', date: '2026-03-10', totalHours: 7.5,  entryCount: 3, status: 'APPROVED',   submittedAt: '2026-03-10', reviewedBy: 'Sandra Okafor', reviewedAt: '2026-03-10', createdAt: '2026-03-10', updatedAt: '2026-03-10' },
  { id: 'h4', userId: 'u3', date: '2026-03-07', totalHours: 8.5,  entryCount: 4, status: 'SUBMITTED',  submittedAt: '2026-03-07', createdAt: '2026-03-07', updatedAt: '2026-03-07' },
  { id: 'h5', userId: 'u3', date: '2026-03-06', totalHours: 4.0,  entryCount: 2, status: 'REJECTED',   submittedAt: '2026-03-06', reviewedBy: 'Sandra Okafor', reviewedAt: '2026-03-06', createdAt: '2026-03-06', updatedAt: '2026-03-06' },
  { id: 'h6', userId: 'u3', date: '2026-03-05', totalHours: 10.0, entryCount: 6, status: 'APPROVED',   submittedAt: '2026-03-05', reviewedBy: 'Sandra Okafor', reviewedAt: '2026-03-05', createdAt: '2026-03-05', updatedAt: '2026-03-05' },
]

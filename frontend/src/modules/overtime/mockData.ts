import type { OvertimeRequest } from './types'

export const MOCK_CHARGE_CODES_REF = [
  { id: 'cc1', code: 'CC-1001', description: 'General Operations' },
  { id: 'cc2', code: 'CC-1002', description: 'Site Maintenance' },
  { id: 'cc3', code: 'PROJ-42', description: 'North Yard Expansion' },
  { id: 'cc4', code: 'PROJ-43', description: 'East Terminal Upgrade' },
  { id: 'cc5', code: 'OT-EMRG', description: 'Emergency Overtime' },
]

// Step-up roles: only those with level > CURRENT_USER.jobRoleLevel (2)
export const STEP_UP_ROLES_REF = [
  { id: 'jr3', name: 'Senior Operator',  level: 3 },
  { id: 'jr4', name: 'Lead Technician',  level: 4 },
  { id: 'jr5', name: 'Shift Supervisor', level: 5 },
]

export const CHARGE_CODE_MAP: Record<string, string> = {
  cc1: 'CC-1001',
  cc2: 'CC-1002',
  cc3: 'PROJ-42',
  cc4: 'PROJ-43',
  cc5: 'OT-EMRG',
}

export const STEP_UP_ROLE_MAP: Record<string, string> = {
  jr3: 'Senior Operator',
  jr4: 'Lead Technician',
  jr5: 'Shift Supervisor',
}

const TODAY = new Date().toISOString().slice(0, 10)

export const MOCK_OT_REQUESTS: OvertimeRequest[] = [
  {
    id: 'ot1',
    userId: 'u3',
    date: TODAY,
    startTime: '16:00',
    estimatedDurationMinutes: 120,
    chargeCodeId: 'cc3',
    reason: 'Critical phase of North Yard expansion requires shift extension to meet deadline.',
    status: 'REQUESTED',
    createdAt: TODAY,
    updatedAt: TODAY,
  },
  {
    id: 'ot2',
    userId: 'u3',
    date: '2026-03-12',
    startTime: '17:00',
    estimatedDurationMinutes: 90,
    chargeCodeId: 'cc5',
    stepUpRoleId: 'jr3',
    reason: 'Emergency pump failure required immediate response and repair.',
    status: 'APPROVED',
    reviewedBy: 'Sandra Okafor',
    reviewedAt: '2026-03-12T09:30:00Z',
    createdAt: '2026-03-12',
    updatedAt: '2026-03-12',
  },
  {
    id: 'ot3',
    userId: 'u3',
    date: '2026-03-10',
    startTime: '16:30',
    estimatedDurationMinutes: 60,
    chargeCodeId: 'cc2',
    reason: 'Routine maintenance overrun due to unexpected corrosion found during inspection.',
    status: 'REJECTED',
    reviewedBy: 'Sandra Okafor',
    reviewedAt: '2026-03-10T11:00:00Z',
    reviewNotes: 'Schedule follow-up maintenance for next week instead.',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10',
  },
  {
    id: 'ot4',
    userId: 'u3',
    date: '2026-03-07',
    startTime: '16:00',
    estimatedDurationMinutes: 180,
    chargeCodeId: 'cc4',
    stepUpRoleId: 'jr4',
    reason: 'East Terminal upgrade milestone — concrete pour cannot be interrupted mid-process.',
    status: 'APPROVED',
    reviewedBy: 'Sandra Okafor',
    reviewedAt: '2026-03-07T07:45:00Z',
    createdAt: '2026-03-07',
    updatedAt: '2026-03-07',
  },
  {
    id: 'ot5',
    userId: 'u3',
    date: '2026-03-05',
    startTime: '16:00',
    estimatedDurationMinutes: 120,
    chargeCodeId: 'cc1',
    reason: 'Shift handover issues — incoming team unavailable, required to stay.',
    status: 'CANCELLED',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-05',
  },
]

// Mock hours for stat cards
export const MOCK_TODAY_MINUTES = 330  // 5h 30m
export const MOCK_WEEKLY_HOURS = 32.5

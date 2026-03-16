import type { Alert, AlertConfig } from './types'

const TODAY = new Date().toISOString().slice(0, 10)

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'al-1',
    type: 'OVERTIME_DAILY',
    userId: 'supervisor-1',
    relatedUserId: 'u3',
    relatedUserName: 'James Tran',
    message: 'James Tran has exceeded 8 daily hours (8.5h) on the current session.',
    isRead: false,
    createdAt: `${TODAY}T14:30:00Z`,
  },
  {
    id: 'al-2',
    type: 'OVERTIME_WEEKLY',
    userId: 'supervisor-1',
    relatedUserId: 'u3',
    relatedUserName: 'James Tran',
    message: 'James Tran has exceeded 40 weekly hours (41.0h this week).',
    isRead: false,
    createdAt: `${TODAY}T14:30:00Z`,
  },
  {
    id: 'al-3',
    type: 'PENDING_APPROVAL',
    userId: 'supervisor-1',
    relatedUserId: 'u5',
    relatedUserName: 'Chen Wei',
    message: 'Chen Wei submitted a time session for review (9.5h, 3 entries).',
    isRead: false,
    createdAt: `${TODAY}T13:15:00Z`,
  },
  {
    id: 'al-4',
    type: 'MISSING_TIME',
    userId: 'supervisor-1',
    relatedUserId: 'u7',
    relatedUserName: 'Kofi Mensah',
    message: 'Kofi Mensah has no time entries for today.',
    isRead: false,
    createdAt: `${TODAY}T10:00:00Z`,
  },
  {
    id: 'al-5',
    type: 'MISSING_TIME',
    userId: 'supervisor-1',
    relatedUserId: 'u8',
    relatedUserName: 'Aisha Diallo',
    message: 'Aisha Diallo has no time entries for today.',
    isRead: true,
    createdAt: `${TODAY}T10:00:00Z`,
  },
  {
    id: 'al-6',
    type: 'ENTRY_REJECTED',
    userId: 'u10',
    relatedUserName: 'Sandra Okafor',
    message: 'Your time session for 2026-03-14 was rejected by Sandra Okafor.',
    isRead: true,
    createdAt: '2026-03-14T16:45:00Z',
  },
  {
    id: 'al-7',
    type: 'PENDING_APPROVAL',
    userId: 'supervisor-1',
    relatedUserId: 'u4',
    relatedUserName: 'Maria Santos',
    message: 'Maria Santos submitted a time session for review (8.0h, 3 entries).',
    isRead: true,
    createdAt: '2026-03-14T15:30:00Z',
  },
  {
    id: 'al-8',
    type: 'OVERTIME_DAILY',
    userId: 'supervisor-1',
    relatedUserId: 'u5',
    relatedUserName: 'Chen Wei',
    message: 'Chen Wei exceeded 8 daily hours (9.5h) on 2026-03-12.',
    isRead: true,
    createdAt: '2026-03-12T16:00:00Z',
  },
]

export const MOCK_ALERT_CONFIGS: AlertConfig[] = [
  {
    id: 'ac-1', type: 'OVERTIME_DAILY', enabled: true, threshold: 8,
    recipients: ['SUPERVISOR', 'ADMIN'],
    createdAt: '2026-01-01', updatedAt: '2026-01-01',
  },
  {
    id: 'ac-2', type: 'OVERTIME_WEEKLY', enabled: true, threshold: 40,
    recipients: ['SUPERVISOR', 'ADMIN'],
    createdAt: '2026-01-01', updatedAt: '2026-01-01',
  },
  {
    id: 'ac-3', type: 'MISSING_TIME', enabled: true, threshold: null,
    recipients: ['SUPERVISOR'],
    createdAt: '2026-01-01', updatedAt: '2026-01-01',
  },
  {
    id: 'ac-4', type: 'PENDING_APPROVAL', enabled: true, threshold: null,
    recipients: ['SUPERVISOR', 'ADMIN'],
    createdAt: '2026-01-01', updatedAt: '2026-01-01',
  },
  {
    id: 'ac-5', type: 'ENTRY_REJECTED', enabled: true, threshold: null,
    recipients: ['FIELD_WORKER'],
    createdAt: '2026-01-01', updatedAt: '2026-01-01',
  },
]

export const ALERT_TYPE_LABELS: Record<string, string> = {
  OVERTIME_DAILY: 'Overtime (Daily)',
  OVERTIME_WEEKLY: 'Overtime (Weekly)',
  MISSING_TIME: 'Missing Time',
  PENDING_APPROVAL: 'Pending Approval',
  ENTRY_REJECTED: 'Entry Rejected',
}

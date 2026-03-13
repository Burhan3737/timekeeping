import type { TimeSessionStatus } from '@modules/timeSessions'

export type { TimeSessionStatus }

export interface TimeEntryDetail {
  id: string
  sessionId: string
  startTime: string
  endTime: string
  durationMinutes: number
  chargeCodeId: string
  stepUpRoleId?: string
  isOvertime: boolean
  locationId: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SessionUser {
  id: string
  name: string
  jobRole: string
  jobRoleLevel: number
  locationId: string
  locationName: string
}

export interface SessionWithDetail {
  id: string
  userId: string
  user: SessionUser
  date: string
  totalHours: number
  entryCount: number
  status: TimeSessionStatus
  notes?: string
  submittedAt?: string
  reviewedBy?: string
  reviewedAt?: string
  entries: TimeEntryDetail[]
  createdAt: string
  updatedAt: string
}

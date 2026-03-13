export type TimeSessionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

export interface TimeSession {
  id: string
  userId: string
  date: string              // YYYY-MM-DD
  totalHours: number
  entryCount: number
  status: TimeSessionStatus
  notes?: string
  submittedAt?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface TimeEntry {
  id: string
  sessionId: string
  startTime: string         // HH:mm
  endTime: string           // HH:mm
  durationMinutes: number
  chargeCodeId: string
  stepUpRoleId?: string
  isOvertime: boolean
  locationId: string
  notes?: string
  createdAt: string
  updatedAt: string
}

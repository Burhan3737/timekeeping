import type { OvertimeStatus } from '@modules/overtime'

export type { OvertimeStatus }

export interface OvertimeRequestWithUser {
  id: string
  userId: string
  userName: string
  userJobRole: string
  userLocationId: string
  userLocationName: string
  date: string
  startTime: string
  estimatedDurationMinutes: number
  chargeCodeId: string
  stepUpRoleId?: string
  reason: string
  status: OvertimeStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

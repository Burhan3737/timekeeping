export type OvertimeStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export interface OvertimeRequest {
  id: string
  userId: string
  date: string                       // YYYY-MM-DD
  startTime: string                  // HH:mm
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

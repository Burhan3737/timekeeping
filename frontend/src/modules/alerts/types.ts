export type AlertType =
  | 'OVERTIME_DAILY'
  | 'OVERTIME_WEEKLY'
  | 'MISSING_TIME'
  | 'PENDING_APPROVAL'
  | 'ENTRY_REJECTED'

export interface Alert {
  id: string
  type: AlertType
  userId: string
  relatedUserId?: string
  relatedUserName?: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface AlertConfig {
  id: string
  type: AlertType
  enabled: boolean
  threshold: number | null
  recipients: string[]   // SystemRole[]
  createdAt: string
  updatedAt: string
}

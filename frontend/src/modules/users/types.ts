export type SystemRole = 'FIELD_WORKER' | 'SUPERVISOR' | 'ADMIN' | 'DATA_ENTRY_CLERK'

export const SYSTEM_ROLE_LABELS: Record<SystemRole, string> = {
  FIELD_WORKER: 'Field Worker',
  SUPERVISOR: 'Supervisor',
  ADMIN: 'Administrator',
  DATA_ENTRY_CLERK: 'Data Entry Clerk',
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  pin: string           // 4-6 digits, masked in display
  systemRole: SystemRole
  jobRoleId: string
  locationIds: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Lightweight reference types used for form dropdowns
export interface JobRoleRef { id: string; name: string; level: number }
export interface LocationRef { id: string; name: string }

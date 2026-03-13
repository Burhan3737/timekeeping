export interface ChargeCode {
  id: string
  code: string         // e.g., "CC-1001"
  description: string
  isActive: boolean
  createdAt: string
}

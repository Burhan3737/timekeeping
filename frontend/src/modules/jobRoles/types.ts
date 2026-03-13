export interface JobRole {
  id: string
  name: string
  level: number       // pay grade — higher = higher pay grade
  sortOrder: number   // display order
  isActive: boolean
  createdAt: string
}

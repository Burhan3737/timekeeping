import type { User, JobRoleRef, LocationRef } from './types'

// Reference data — mirrors active records from locations / job-roles modules
export const MOCK_JOB_ROLES: JobRoleRef[] = [
  { id: 'jr1', name: 'Labourer',         level: 1 },
  { id: 'jr2', name: 'Field Operator',   level: 2 },
  { id: 'jr3', name: 'Senior Operator',  level: 3 },
  { id: 'jr4', name: 'Lead Technician',  level: 4 },
  { id: 'jr5', name: 'Shift Supervisor', level: 5 },
  { id: 'jr6', name: 'Site Manager',     level: 6 },
]

export const MOCK_LOCATIONS: LocationRef[] = [
  { id: 'loc1', name: 'Site Alpha' },
  { id: 'loc2', name: 'North Yard' },
  { id: 'loc3', name: 'East Terminal' },
  { id: 'loc4', name: 'South Gate' },
  { id: 'loc5', name: 'Maintenance Bay' },
]

export const MOCK_USERS: User[] = [
  {
    id: 'u1', firstName: 'Marcus',  lastName: 'Rivera',   email: 'mrivera@tektrack.com',
    pin: '1234', systemRole: 'ADMIN',         jobRoleId: 'jr6', locationIds: ['loc1', 'loc2'],
    isActive: true,  createdAt: '2025-01-10', updatedAt: '2025-01-10',
  },
  {
    id: 'u2', firstName: 'Sandra',  lastName: 'Okafor',   email: 'sokafor@tektrack.com',
    pin: '5678', systemRole: 'SUPERVISOR',    jobRoleId: 'jr5', locationIds: ['loc1', 'loc3'],
    isActive: true,  createdAt: '2025-01-15', updatedAt: '2025-02-01',
  },
  {
    id: 'u3', firstName: 'James',   lastName: 'Tran',     email: 'jtran@tektrack.com',
    pin: '2211', systemRole: 'FIELD_WORKER',  jobRoleId: 'jr2', locationIds: ['loc2'],
    isActive: true,  createdAt: '2025-02-01', updatedAt: '2025-02-01',
  },
  {
    id: 'u4', firstName: 'Priya',   lastName: 'Patel',    email: 'ppatel@tektrack.com',
    pin: '3399', systemRole: 'FIELD_WORKER',  jobRoleId: 'jr3', locationIds: ['loc1', 'loc4'],
    isActive: true,  createdAt: '2025-02-10', updatedAt: '2025-02-10',
  },
  {
    id: 'u5', firstName: 'Devon',   lastName: 'Walsh',    email: 'dwalsh@tektrack.com',
    pin: '4455', systemRole: 'FIELD_WORKER',  jobRoleId: 'jr1', locationIds: ['loc3'],
    isActive: false, createdAt: '2025-02-15', updatedAt: '2025-03-05',
  },
  {
    id: 'u6', firstName: 'Aisha',   lastName: 'Mensah',   email: 'amensah@tektrack.com',
    pin: '7722', systemRole: 'DATA_ENTRY_CLERK', jobRoleId: 'jr2', locationIds: ['loc1'],
    isActive: true,  createdAt: '2025-03-01', updatedAt: '2025-03-01',
  },
  {
    id: 'u7', firstName: 'Carlos',  lastName: 'Ibarra',   email: 'cibarra@tektrack.com',
    pin: '9900', systemRole: 'FIELD_WORKER',  jobRoleId: 'jr4', locationIds: ['loc2', 'loc5'],
    isActive: true,  createdAt: '2025-03-08', updatedAt: '2025-03-08',
  },
]

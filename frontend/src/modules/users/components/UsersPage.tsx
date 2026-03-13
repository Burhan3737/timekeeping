import { useState, useMemo } from 'react'
import { Button, IconButton, Tooltip, Stack, Box, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { PageHeader } from '@shared/components/PageHeader'
import { DataTable, Column } from '@shared/components/DataTable'
import { StatusBadge } from '@shared/components/StatusBadge'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { FilterBar } from '@shared/components/FilterBar'
import { UserFormDialog } from './UserFormDialog'
import { MOCK_USERS, MOCK_LOCATIONS, MOCK_JOB_ROLES } from '../mockData'
import { SYSTEM_ROLE_LABELS } from '../types'
import type { User, SystemRole } from '../types'

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [toggleTarget, setToggleTarget] = useState<User | null>(null)

  // Filters
  const [roleFilter, setRoleFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const handleAdd = () => { setEditing(null); setFormOpen(true) }
  const handleEdit = (user: User) => { setEditing(user); setFormOpen(true) }

  const handleFormSubmit = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().slice(0, 10)
    if (editing) {
      setUsers((prev) => prev.map((u) => u.id === editing.id ? { ...u, ...data, updatedAt: now } : u))
    } else {
      setUsers((prev) => [...prev, { id: String(Date.now()), ...data, createdAt: now, updatedAt: now }])
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleToggle = () => {
    if (!toggleTarget) return
    setUsers((prev) =>
      prev.map((u) => u.id === toggleTarget.id ? { ...u, isActive: !u.isActive } : u)
    )
    setToggleTarget(null)
  }

  const handleReset = () => { setRoleFilter(''); setLocationFilter(''); setStatusFilter('') }

  // Client-side filtering
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter && u.systemRole !== roleFilter) return false
      if (locationFilter && !u.locationIds.includes(locationFilter)) return false
      if (statusFilter === 'active' && !u.isActive) return false
      if (statusFilter === 'inactive' && u.isActive) return false
      return true
    })
  }, [users, roleFilter, locationFilter, statusFilter])

  const columns: Column<User>[] = [
    {
      id: 'firstName',
      label: 'Name',
      sortable: true,
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    { id: 'email', label: 'Email', sortable: true },
    {
      id: 'systemRole',
      label: 'System Role',
      sortable: true,
      render: (row) => SYSTEM_ROLE_LABELS[row.systemRole],
    },
    {
      id: 'jobRoleId',
      label: 'Job Role',
      sortable: false,
      render: (row) => MOCK_JOB_ROLES.find((jr) => jr.id === row.jobRoleId)?.name ?? '—',
    },
    {
      id: 'locationIds',
      label: 'Locations',
      sortable: false,
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.locationIds.map((id) => {
            const loc = MOCK_LOCATIONS.find((l) => l.id === id)
            return <Chip key={id} label={loc?.name ?? id} size="small" variant="outlined" />
          })}
        </Box>
      ),
    },
    {
      id: 'isActive',
      label: 'Status',
      sortable: true,
      width: 110,
      render: (row) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
  ]

  const rowActions = (row: User) => (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => handleEdit(row)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={row.isActive ? 'Deactivate' : 'Activate'}>
        <IconButton size="small" onClick={() => setToggleTarget(row)}>
          {row.isActive
            ? <ToggleOnIcon fontSize="small" sx={{ color: 'success.main' }} />
            : <ToggleOffIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Stack>
  )

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage system users, roles, and location assignments"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Add User
          </Button>
        }
      />

      <FilterBar
        filters={[
          {
            id: 'role',
            label: 'System Role',
            value: roleFilter,
            onChange: setRoleFilter,
            options: (Object.keys(SYSTEM_ROLE_LABELS) as SystemRole[]).map((r) => ({
              label: SYSTEM_ROLE_LABELS[r],
              value: r,
            })),
          },
          {
            id: 'location',
            label: 'Location',
            value: locationFilter,
            onChange: setLocationFilter,
            options: MOCK_LOCATIONS.map((l) => ({ label: l.name, value: l.id })),
          },
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
          },
        ]}
        onReset={handleReset}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        actions={rowActions}
        searchPlaceholder="Search by name or email…"
        emptyMessage="No users found matching the current filters."
      />

      <UserFormDialog
        open={formOpen}
        user={editing}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!toggleTarget}
        title={toggleTarget?.isActive ? 'Deactivate User' : 'Activate User'}
        message={
          toggleTarget?.isActive
            ? `Deactivate ${toggleTarget.firstName} ${toggleTarget.lastName}? They will no longer be able to log in.`
            : `Reactivate ${toggleTarget?.firstName} ${toggleTarget?.lastName}? They will regain access to the system.`
        }
        confirmLabel={toggleTarget?.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={toggleTarget?.isActive ? 'error' : 'primary'}
        onConfirm={handleToggle}
        onCancel={() => setToggleTarget(null)}
      />
    </>
  )
}

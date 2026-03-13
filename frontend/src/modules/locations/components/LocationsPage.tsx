import { useState } from 'react'
import { Button, IconButton, Tooltip, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { PageHeader } from '@shared/components/PageHeader'
import { DataTable, Column } from '@shared/components/DataTable'
import { StatusBadge } from '@shared/components/StatusBadge'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { LocationFormDialog } from './LocationFormDialog'
import type { Location } from '../types'

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'Site Alpha',    description: 'Primary operations hub, downtown facility',    isActive: true,  createdAt: '2025-01-10' },
  { id: '2', name: 'North Yard',    description: 'Outdoor storage and staging area',              isActive: true,  createdAt: '2025-01-15' },
  { id: '3', name: 'East Terminal', description: 'Loading dock and freight processing',           isActive: true,  createdAt: '2025-02-03' },
  { id: '4', name: 'Warehouse B',   description: 'Secondary storage — climate controlled',       isActive: false, createdAt: '2025-02-20' },
  { id: '5', name: 'South Gate',    description: 'Security checkpoint and visitor entry',        isActive: true,  createdAt: '2025-03-01' },
  { id: '6', name: 'Maintenance Bay', description: 'Vehicle and equipment servicing',           isActive: true,  createdAt: '2025-03-08' },
]
// ──────────────────────────────────────────────────────────────────────────

interface ToggleTarget {
  location: Location
}

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Location | null>(null)
  const [toggleTarget, setToggleTarget] = useState<ToggleTarget | null>(null)

  // ── Handlers (view-layer only — no API calls) ──────────────────────────
  const handleAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (location: Location) => {
    setEditing(location)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: { name: string; description: string }) => {
    if (editing) {
      setLocations((prev) =>
        prev.map((l) => (l.id === editing.id ? { ...l, ...data } : l))
      )
    } else {
      const newLocation: Location = {
        id: String(Date.now()),
        ...data,
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setLocations((prev) => [...prev, newLocation])
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleToggleActive = () => {
    if (!toggleTarget) return
    setLocations((prev) =>
      prev.map((l) =>
        l.id === toggleTarget.location.id ? { ...l, isActive: !l.isActive } : l
      )
    )
    setToggleTarget(null)
  }
  // ──────────────────────────────────────────────────────────────────────

  const columns: Column<Location>[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'description', label: 'Description', sortable: false },
    {
      id: 'isActive',
      label: 'Status',
      sortable: true,
      width: 110,
      render: (row) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      id: 'createdAt',
      label: 'Created',
      sortable: true,
      width: 120,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ]

  const rowActions = (row: Location) => (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => handleEdit(row)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={row.isActive ? 'Deactivate' : 'Activate'}>
        <IconButton
          size="small"
          color={row.isActive ? 'default' : 'success'}
          onClick={() => setToggleTarget({ location: row })}
        >
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
        title="Locations"
        subtitle="Manage work site locations"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Add Location
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={locations}
        actions={rowActions}
        searchPlaceholder="Search locations…"
        emptyMessage="No locations found. Add one to get started."
      />

      <LocationFormDialog
        open={formOpen}
        location={editing}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!toggleTarget}
        title={toggleTarget?.location.isActive ? 'Deactivate Location' : 'Activate Location'}
        message={
          toggleTarget?.location.isActive
            ? `Deactivate "${toggleTarget.location.name}"? It will no longer appear in dropdowns, but historical data is preserved.`
            : `Reactivate "${toggleTarget?.location.name}"? It will become available in dropdowns again.`
        }
        confirmLabel={toggleTarget?.location.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={toggleTarget?.location.isActive ? 'warning' : 'primary'}
        onConfirm={handleToggleActive}
        onCancel={() => setToggleTarget(null)}
      />
    </>
  )
}

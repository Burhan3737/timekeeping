import { useState } from 'react'
import { Button, IconButton, Tooltip, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { PageHeader } from '@shared/components/PageHeader'
import { DataTable, Column } from '@shared/components/DataTable'
import { StatusBadge } from '@shared/components/StatusBadge'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { ChargeCodeFormDialog } from './ChargeCodeFormDialog'
import type { ChargeCode } from '../types'

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_CHARGE_CODES: ChargeCode[] = [
  { id: '1', code: 'CC-1001', description: 'General Operations',              isActive: true,  createdAt: '2025-01-10' },
  { id: '2', code: 'CC-1002', description: 'Site Maintenance',                isActive: true,  createdAt: '2025-01-10' },
  { id: '3', code: 'PROJ-42', description: 'North Yard Expansion Project',    isActive: true,  createdAt: '2025-02-01' },
  { id: '4', code: 'PROJ-43', description: 'East Terminal Upgrade',           isActive: true,  createdAt: '2025-02-15' },
  { id: '5', code: 'OT-EMRG', description: 'Emergency Overtime Response',     isActive: true,  createdAt: '2025-03-01' },
  { id: '6', code: 'ADMIN-1', description: 'Administrative Time',             isActive: false, createdAt: '2025-03-05' },
  { id: '7', code: 'TRAIN-1', description: 'Training and Onboarding',         isActive: true,  createdAt: '2025-03-08' },
  { id: '8', code: 'CC-1099', description: 'Legacy Billing Code — Retired',   isActive: false, createdAt: '2024-11-01' },
]
// ──────────────────────────────────────────────────────────────────────────

export function ChargeCodesPage() {
  const [chargeCodes, setChargeCodes] = useState<ChargeCode[]>(MOCK_CHARGE_CODES)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ChargeCode | null>(null)
  const [toggleTarget, setToggleTarget] = useState<ChargeCode | null>(null)

  const handleAdd = () => { setEditing(null); setFormOpen(true) }
  const handleEdit = (cc: ChargeCode) => { setEditing(cc); setFormOpen(true) }

  const handleFormSubmit = (data: { code: string; description: string }) => {
    if (editing) {
      setChargeCodes((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)))
    } else {
      const next: ChargeCode = {
        id: String(Date.now()),
        ...data,
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setChargeCodes((prev) => [...prev, next])
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleToggle = () => {
    if (!toggleTarget) return
    setChargeCodes((prev) =>
      prev.map((c) => (c.id === toggleTarget.id ? { ...c, isActive: !c.isActive } : c))
    )
    setToggleTarget(null)
  }

  const columns: Column<ChargeCode>[] = [
    {
      id: 'code',
      label: 'Code',
      sortable: true,
      width: 130,
      render: (row) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.03em' }}
        >
          {row.code}
        </Typography>
      ),
    },
    { id: 'description', label: 'Description', sortable: true },
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

  const rowActions = (row: ChargeCode) => (
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
        title="Charge Codes"
        subtitle="Manage billing and project codes"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Add Charge Code
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={chargeCodes}
        actions={rowActions}
        searchPlaceholder="Search codes or descriptions…"
        emptyMessage="No charge codes found. Add one to get started."
      />

      <ChargeCodeFormDialog
        open={formOpen}
        chargeCode={editing}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!toggleTarget}
        title={toggleTarget?.isActive ? 'Deactivate Charge Code' : 'Activate Charge Code'}
        message={
          toggleTarget?.isActive
            ? `Deactivate "${toggleTarget.code}"? It will no longer appear in time entry dropdowns.`
            : `Reactivate "${toggleTarget?.code}"? It will become available for new time entries.`
        }
        confirmLabel={toggleTarget?.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={toggleTarget?.isActive ? 'warning' : 'primary'}
        onConfirm={handleToggle}
        onCancel={() => setToggleTarget(null)}
      />
    </>
  )
}

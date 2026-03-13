import { useState, useMemo } from 'react'
import {
  Button, IconButton, Tooltip, Box, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SearchIcon from '@mui/icons-material/Search'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { PageHeader } from '@shared/components/PageHeader'
import { StatusBadge } from '@shared/components/StatusBadge'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { JobRoleFormDialog } from './JobRoleFormDialog'
import type { JobRole } from '../types'

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_JOB_ROLES: JobRole[] = [
  { id: '1', name: 'Labourer',           level: 1, sortOrder: 1, isActive: true,  createdAt: '2025-01-10' },
  { id: '2', name: 'Field Operator',     level: 2, sortOrder: 2, isActive: true,  createdAt: '2025-01-10' },
  { id: '3', name: 'Senior Operator',    level: 3, sortOrder: 3, isActive: true,  createdAt: '2025-01-10' },
  { id: '4', name: 'Lead Technician',    level: 4, sortOrder: 4, isActive: true,  createdAt: '2025-02-01' },
  { id: '5', name: 'Shift Supervisor',   level: 5, sortOrder: 5, isActive: true,  createdAt: '2025-02-01' },
  { id: '6', name: 'Site Manager',       level: 6, sortOrder: 6, isActive: true,  createdAt: '2025-02-15' },
  { id: '7', name: 'Safety Officer',     level: 3, sortOrder: 7, isActive: false, createdAt: '2025-03-01' },
]
// ──────────────────────────────────────────────────────────────────────────

function reindex(roles: JobRole[]): JobRole[] {
  return roles.map((r, i) => ({ ...r, sortOrder: i + 1 }))
}

export function JobRolesPage() {
  const [roles, setRoles] = useState<JobRole[]>(() =>
    [...MOCK_JOB_ROLES].sort((a, b) => a.sortOrder - b.sortOrder)
  )
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<JobRole | null>(null)
  const [toggleTarget, setToggleTarget] = useState<JobRole | null>(null)

  const isSearching = search.trim().length > 0

  const displayed = useMemo(() => {
    if (!isSearching) return roles
    const q = search.toLowerCase()
    return roles.filter(
      (r) => r.name.toLowerCase().includes(q) || String(r.level).includes(q)
    )
  }, [roles, search, isSearching])

  // ── Reorder ───────────────────────────────────────────────────────────────
  const move = (id: string, direction: 'up' | 'down') => {
    setRoles((prev) => {
      const idx = prev.findIndex((r) => r.id === id)
      if (idx === -1) return prev
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return reindex(next)
    })
  }

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleAdd = () => { setEditing(null); setFormOpen(true) }
  const handleEdit = (role: JobRole) => { setEditing(role); setFormOpen(true) }

  const handleFormSubmit = (data: { name: string; level: number }) => {
    if (editing) {
      setRoles((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r)))
    } else {
      const next: JobRole = {
        id: String(Date.now()),
        ...data,
        sortOrder: roles.length + 1,
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setRoles((prev) => [...prev, next])
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleToggle = () => {
    if (!toggleTarget) return
    setRoles((prev) =>
      prev.map((r) => (r.id === toggleTarget.id ? { ...r, isActive: !r.isActive } : r))
    )
    setToggleTarget(null)
  }

  const nextLevel = useMemo(
    () => Math.max(0, ...roles.map((r) => r.level)) + 1,
    [roles]
  )

  return (
    <>
      <PageHeader
        title="Job Roles"
        subtitle="Manage roles and pay grade ordering"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Add Role
          </Button>
        }
      />

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {/* Search + reorder hint */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search roles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 280 }}
          />
          {isSearching && (
            <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SwapVertIcon sx={{ fontSize: 14 }} />
              Clear search to reorder
            </Typography>
          )}
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover', width: 80 }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Role Name</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover', width: 130 }}>Pay Grade</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover', width: 110 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover', width: 120 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover', width: 160 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
                      <Typography variant="body2">No roles found.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((role, idx) => (
                  <TableRow key={role.id} hover>
                    {/* Sort order */}
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'JetBrains Mono, monospace', color: 'text.disabled' }}
                      >
                        {String(role.sortOrder).padStart(2, '0')}
                      </Typography>
                    </TableCell>

                    {/* Name */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {role.name}
                      </Typography>
                    </TableCell>

                    {/* Pay grade */}
                    <TableCell>
                      <Chip
                        label={`Level ${role.level}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={role.isActive ? 'ACTIVE' : 'INACTIVE'} />
                    </TableCell>

                    {/* Created */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(role.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        {/* Move up/down — hidden while searching */}
                        {!isSearching && (
                          <>
                            <Tooltip title="Move up">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => move(role.id, 'up')}
                                  disabled={idx === 0}
                                >
                                  <ArrowUpwardIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Move down">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => move(role.id, 'down')}
                                  disabled={idx === displayed.length - 1}
                                >
                                  <ArrowDownwardIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(role)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={role.isActive ? 'Deactivate' : 'Activate'}>
                          <IconButton size="small" onClick={() => setToggleTarget(role)}>
                            {role.isActive
                              ? <ToggleOnIcon fontSize="small" sx={{ color: 'success.main' }} />
                              : <ToggleOffIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <JobRoleFormDialog
        open={formOpen}
        jobRole={editing}
        nextLevel={nextLevel}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!toggleTarget}
        title={toggleTarget?.isActive ? 'Deactivate Role' : 'Activate Role'}
        message={
          toggleTarget?.isActive
            ? `Deactivate "${toggleTarget.name}"? Workers with this role will no longer be able to select it for step-up.`
            : `Reactivate "${toggleTarget?.name}"? It will become available again for step-up assignments.`
        }
        confirmLabel={toggleTarget?.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={toggleTarget?.isActive ? 'warning' : 'primary'}
        onConfirm={handleToggle}
        onCancel={() => setToggleTarget(null)}
      />
    </>
  )
}

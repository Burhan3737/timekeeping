import { useState } from 'react'
import {
  Box, Button, Tabs, Tab, Tooltip, IconButton, Typography, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DateRangeIcon from '@mui/icons-material/DateRange'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import CancelIcon from '@mui/icons-material/Cancel'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { PageHeader } from '@shared/components/PageHeader'
import { StatCard } from '@shared/components/StatCard'
import { StatusBadge } from '@shared/components/StatusBadge'
import { DataTable } from '@shared/components/DataTable'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { OvertimeRequestFormDialog } from './OvertimeRequestFormDialog'
import {
  MOCK_OT_REQUESTS, MOCK_TODAY_MINUTES, MOCK_WEEKLY_HOURS,
  CHARGE_CODE_MAP, STEP_UP_ROLE_MAP,
} from '../mockData'
import type { OvertimeRequest } from '../types'

function hoursLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

export function OvertimePage() {
  const [requests, setRequests] = useState<OvertimeRequest[]>(MOCK_OT_REQUESTS)
  const [tab, setTab] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [viewTarget, setViewTarget] = useState<OvertimeRequest | null>(null)
  const [cancelTarget, setCancelTarget] = useState<OvertimeRequest | null>(null)

  const activeRequests = requests.filter((r) => r.status === 'REQUESTED')
  const historyRequests = requests.filter((r) => r.status !== 'REQUESTED')
  const pendingCount = activeRequests.length

  const handleFormSubmit = (data: Omit<OvertimeRequest, 'id' | 'status' | 'reviewedBy' | 'reviewedAt' | 'reviewNotes' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newRequest: OvertimeRequest = {
      id: String(Date.now()),
      ...data,
      status: 'REQUESTED',
      createdAt: now,
      updatedAt: now,
    }
    setRequests((prev) => [newRequest, ...prev])
    setFormOpen(false)
  }

  const handleCancel = () => {
    if (!cancelTarget) return
    setRequests((prev) =>
      prev.map((r) => r.id === cancelTarget.id
        ? { ...r, status: 'CANCELLED', updatedAt: new Date().toISOString() }
        : r
      )
    )
    setCancelTarget(null)
  }

  const columns = [
    {
      id: 'date',
      label: 'Date',
      sortable: true,
      render: (row: OvertimeRequest) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
          {row.date}
        </Typography>
      ),
    },
    {
      id: 'startTime',
      label: 'Start Time',
      sortable: false,
      render: (row: OvertimeRequest) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {row.startTime}
        </Typography>
      ),
    },
    {
      id: 'estimatedDurationMinutes',
      label: 'Duration',
      sortable: false,
      render: (row: OvertimeRequest) => (
        <Typography variant="body2">{formatDuration(row.estimatedDurationMinutes)}</Typography>
      ),
    },
    {
      id: 'chargeCodeId',
      label: 'Charge Code',
      sortable: false,
      render: (row: OvertimeRequest) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'primary.main' }}>
          {CHARGE_CODE_MAP[row.chargeCodeId] ?? row.chargeCodeId}
        </Typography>
      ),
    },
    {
      id: 'stepUpRoleId',
      label: 'Step-Up Role',
      sortable: false,
      render: (row: OvertimeRequest) => row.stepUpRoleId
        ? <Typography variant="body2">{STEP_UP_ROLE_MAP[row.stepUpRoleId] ?? row.stepUpRoleId}</Typography>
        : <Typography variant="body2" color="text.disabled">—</Typography>,
    },
    {
      id: 'reason',
      label: 'Reason',
      sortable: false,
      render: (row: OvertimeRequest) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={row.reason}
        >
          {row.reason}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (row: OvertimeRequest) => <StatusBadge status={row.status} />,
    },
  ]

  const tableRows = tab === 0 ? activeRequests : historyRequests

  const isOvertime8h = MOCK_TODAY_MINUTES > 480
  const isApproachingWeekly = MOCK_WEEKLY_HOURS >= 36

  return (
    <>
      <PageHeader
        title="Overtime"
        subtitle="Pre-approval requests for overtime work"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            Request Overtime
          </Button>
        }
      />

      {/* Overtime threshold alerts */}
      {isOvertime8h && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Today's hours exceed 8h. Submit an overtime request for pre-approval before continuing work.
        </Alert>
      )}
      {!isOvertime8h && isApproachingWeekly && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Weekly hours are approaching 40h ({MOCK_WEEKLY_HOURS}h logged). Consider submitting an overtime request.
        </Alert>
      )}

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard
          icon={<AccessTimeIcon />}
          label="Today's Hours"
          value={hoursLabel(MOCK_TODAY_MINUTES)}
          color={isOvertime8h ? 'warning.main' : 'primary.main'}
          subtitle={isOvertime8h ? 'Exceeds 8h threshold' : 'Within normal hours'}
        />
        <StatCard
          icon={<DateRangeIcon />}
          label="Weekly Hours"
          value={`${MOCK_WEEKLY_HOURS}h`}
          color={isApproachingWeekly ? 'warning.main' : 'secondary.main'}
          subtitle="Mon – today"
        />
        <StatCard
          icon={<PendingActionsIcon />}
          label="Pending Requests"
          value={pendingCount}
          color={pendingCount > 0 ? 'warning.main' : 'text.secondary'}
          subtitle={pendingCount > 0 ? 'Awaiting approval' : 'None pending'}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                My Requests
                {pendingCount > 0 && (
                  <Box
                    component="span"
                    sx={{
                      bgcolor: 'warning.main', color: 'warning.contrastText',
                      borderRadius: '10px', px: 0.75, py: 0.1,
                      fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.6,
                    }}
                  >
                    {pendingCount}
                  </Box>
                )}
              </Box>
            }
          />
          <Tab label="History" />
        </Tabs>
      </Box>

      <DataTable<OvertimeRequest>
        columns={columns}
        rows={tableRows}
        searchable={tab === 1}
        searchPlaceholder="Search history…"
        emptyMessage={tab === 0 ? 'No pending requests. Use "Request Overtime" to submit one.' : 'No historical requests found.'}
        actions={(row) => (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Tooltip title="View details">
              <IconButton size="small" onClick={() => setViewTarget(row)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {row.status === 'REQUESTED' && (
              <Tooltip title="Cancel request">
                <IconButton size="small" color="error" onClick={() => setCancelTarget(row)}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      />

      <OvertimeRequestFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* View details dialog (read-only confirm pattern) */}
      <ConfirmDialog
        open={!!viewTarget}
        title={`Overtime Request — ${viewTarget?.date ?? ''}`}
        message={
          viewTarget
            ? [
                `Start Time: ${viewTarget.startTime}`,
                `Duration: ${formatDuration(viewTarget.estimatedDurationMinutes)}`,
                `Charge Code: ${CHARGE_CODE_MAP[viewTarget.chargeCodeId] ?? viewTarget.chargeCodeId}`,
                viewTarget.stepUpRoleId ? `Step-Up Role: ${STEP_UP_ROLE_MAP[viewTarget.stepUpRoleId] ?? viewTarget.stepUpRoleId}` : '',
                `Reason: ${viewTarget.reason}`,
                viewTarget.reviewNotes ? `Review Notes: ${viewTarget.reviewNotes}` : '',
              ].filter(Boolean).join('\n')
            : ''
        }
        confirmLabel="Close"
        confirmColor="primary"
        onConfirm={() => setViewTarget(null)}
        onCancel={() => setViewTarget(null)}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Overtime Request"
        message={cancelTarget
          ? `Cancel the overtime request for ${cancelTarget.date} at ${cancelTarget.startTime} (${formatDuration(cancelTarget.estimatedDurationMinutes)})?`
          : ''
        }
        confirmLabel="Cancel Request"
        confirmColor="error"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </>
  )
}

import { useState } from 'react'
import { Box, Tabs, Tab, Typography, Tooltip, IconButton } from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { PageHeader } from '@shared/components/PageHeader'
import { StatusBadge } from '@shared/components/StatusBadge'
import { DataTable } from '@shared/components/DataTable'
import { FilterBar } from '@shared/components/FilterBar'
import { ReviewDialog } from './ReviewDialog'
import {
  MOCK_OT_REQUESTS_SUPERVISOR, CHARGE_CODE_MAP, STEP_UP_ROLE_MAP, MOCK_LOCATIONS_REF,
} from '../mockData'
import type { OvertimeRequestWithUser, OvertimeStatus } from '../types'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export function OvertimeRequestsPage() {
  const [requests, setRequests] = useState<OvertimeRequestWithUser[]>(MOCK_OT_REQUESTS_SUPERVISOR)
  const [tab, setTab] = useState(0)
  const [reviewTarget, setReviewTarget] = useState<OvertimeRequestWithUser | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState<OvertimeStatus | ''>('')
  const [locationFilter, setLocationFilter] = useState('')

  const pendingRequests = requests.filter((r) => r.status === 'REQUESTED')

  const filteredAll = requests.filter((r) => {
    if (startDate && r.date < startDate) return false
    if (endDate && r.date > endDate) return false
    if (statusFilter && r.status !== statusFilter) return false
    if (locationFilter && r.userLocationId !== locationFilter) return false
    return true
  })

  const tableRows = tab === 0 ? pendingRequests : filteredAll

  const handleApprove = (id: string, notes?: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id
        ? { ...r, status: 'APPROVED', reviewedBy: 'Sandra Okafor', reviewedAt: new Date().toISOString(), reviewNotes: notes }
        : r
    ))
    setReviewTarget(null)
  }

  const handleReject = (id: string, notes: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id
        ? { ...r, status: 'REJECTED', reviewedBy: 'Sandra Okafor', reviewedAt: new Date().toISOString(), reviewNotes: notes }
        : r
    ))
    setReviewTarget(null)
  }

  const resetFilters = () => { setStartDate(''); setEndDate(''); setStatusFilter(''); setLocationFilter('') }

  const columns = [
    {
      id: 'userName',
      label: 'Employee',
      sortable: true,
      render: (row: OvertimeRequestWithUser) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.userName}</Typography>
          <Typography variant="caption" color="text.secondary">{row.userJobRole} · {row.userLocationName}</Typography>
        </Box>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      sortable: true,
      render: (row: OvertimeRequestWithUser) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
          {row.date}
        </Typography>
      ),
    },
    {
      id: 'startTime',
      label: 'Start',
      sortable: false,
      render: (row: OvertimeRequestWithUser) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.startTime}</Typography>
      ),
    },
    {
      id: 'estimatedDurationMinutes',
      label: 'Duration',
      sortable: false,
      render: (row: OvertimeRequestWithUser) => (
        <Typography variant="body2">{formatDuration(row.estimatedDurationMinutes)}</Typography>
      ),
    },
    {
      id: 'chargeCodeId',
      label: 'Charge Code',
      sortable: false,
      render: (row: OvertimeRequestWithUser) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'primary.main' }}>
          {CHARGE_CODE_MAP[row.chargeCodeId] ?? row.chargeCodeId}
        </Typography>
      ),
    },
    {
      id: 'stepUpRoleId',
      label: 'Step-Up',
      sortable: false,
      render: (row: OvertimeRequestWithUser) => row.stepUpRoleId
        ? <Typography variant="body2" color="error.main">{STEP_UP_ROLE_MAP[row.stepUpRoleId]}</Typography>
        : <Typography variant="body2" color="text.disabled">—</Typography>,
    },
    {
      id: 'reason',
      label: 'Reason',
      sortable: false,
      render: (row: OvertimeRequestWithUser) => (
        <Typography
          variant="body2" color="text.secondary"
          sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
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
      render: (row: OvertimeRequestWithUser) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Overtime Requests"
        subtitle="Review and approve overtime requests"
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                Pending
                {pendingRequests.length > 0 && (
                  <Box
                    component="span"
                    sx={{
                      bgcolor: 'warning.main', color: 'warning.contrastText',
                      borderRadius: '10px', px: 0.75, py: 0.1,
                      fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.6,
                    }}
                  >
                    {pendingRequests.length}
                  </Box>
                )}
              </Box>
            }
          />
          <Tab label="All Requests" />
        </Tabs>
      </Box>

      {/* Filters — only on All tab */}
      {tab === 1 && (
        <FilterBar
          dateRange={{
            startDate, endDate,
            onStartChange: setStartDate,
            onEndChange: setEndDate,
          }}
          filters={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              options: STATUS_OPTIONS,
              onChange: (v) => setStatusFilter(v as OvertimeStatus | ''),
            },
            {
              id: 'location',
              label: 'Location',
              value: locationFilter,
              options: [
                { label: 'All Locations', value: '' },
                ...MOCK_LOCATIONS_REF.map((l) => ({ label: l.name, value: l.id })),
              ],
              onChange: setLocationFilter,
            },
          ]}
          onReset={resetFilters}
        />
      )}

      <DataTable<OvertimeRequestWithUser>
        columns={columns}
        rows={tableRows}
        searchable={tab === 1}
        searchPlaceholder="Search by employee or reason…"
        emptyMessage={
          tab === 0
            ? 'No pending requests — all caught up.'
            : 'No requests match the current filters.'
        }
        actions={(row) => (
          <Tooltip title={row.status === 'REQUESTED' ? 'Review request' : 'View details'}>
            <IconButton size="small" color={row.status === 'REQUESTED' ? 'primary' : 'default'} onClick={() => setReviewTarget(row)}>
              <RateReviewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      />

      <ReviewDialog
        open={!!reviewTarget}
        request={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  )
}

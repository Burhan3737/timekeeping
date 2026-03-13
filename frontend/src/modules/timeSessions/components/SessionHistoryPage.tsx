import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { PageHeader } from '@shared/components/PageHeader'
import { DataTable, Column } from '@shared/components/DataTable'
import { StatusBadge } from '@shared/components/StatusBadge'
import { FilterBar } from '@shared/components/FilterBar'
import { MOCK_SESSION_HISTORY } from '../mockData'
import type { TimeSession } from '../types'

const STATUS_OPTIONS = [
  { label: 'Draft',     value: 'DRAFT' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Approved',  value: 'APPROVED' },
  { label: 'Rejected',  value: 'REJECTED' },
]

export function SessionHistoryPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = MOCK_SESSION_HISTORY.filter((s) => {
    if (startDate && s.date < startDate) return false
    if (endDate && s.date > endDate) return false
    if (statusFilter && s.status !== statusFilter) return false
    return true
  })

  const columns: Column<TimeSession>[] = [
    {
      id: 'date', label: 'Date', sortable: true,
      render: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {row.date}
        </Typography>
      ),
    },
    {
      id: 'totalHours', label: 'Total Hours', sortable: true, width: 120, align: 'right',
      render: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
          {row.totalHours.toFixed(1)}h
        </Typography>
      ),
    },
    { id: 'entryCount', label: 'Entries', sortable: true, width: 80, align: 'center' },
    {
      id: 'status', label: 'Status', sortable: true, width: 120,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'submittedAt', label: 'Submitted', sortable: true, width: 120,
      render: (row) => row.submittedAt
        ? <Typography variant="body2" color="text.secondary">{row.submittedAt}</Typography>
        : <Typography variant="body2" color="text.disabled">—</Typography>,
    },
    {
      id: 'reviewedBy', label: 'Reviewed By', sortable: false,
      render: (row) => row.reviewedBy
        ? <Typography variant="body2" color="text.secondary">{row.reviewedBy}</Typography>
        : <Typography variant="body2" color="text.disabled">—</Typography>,
    },
  ]

  return (
    <>
      <PageHeader title="Session History" subtitle="Past time sessions and approval status" />

      <FilterBar
        dateRange={{ startDate, endDate, onStartChange: setStartDate, onEndChange: setEndDate }}
        filters={[{ id: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: STATUS_OPTIONS }]}
        onReset={() => { setStartDate(''); setEndDate(''); setStatusFilter('') }}
      />

      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.disabled">
          Showing {filtered.length} of {MOCK_SESSION_HISTORY.length} sessions
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={filtered}
        searchable={false}
        emptyMessage="No sessions match the current filters."
      />
    </>
  )
}

import { useState } from 'react'
import { Box, Typography, Chip } from '@mui/material'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import MoreTimeIcon from '@mui/icons-material/MoreTime'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@shared/components/PageHeader'
import { StatCard } from '@shared/components/StatCard'
import { DataTable } from '@shared/components/DataTable'
import { FilterBar } from '@shared/components/FilterBar'
import { StatusBadge } from '@shared/components/StatusBadge'
import { MOCK_EMPLOYEES, MOCK_EMPLOYEE_STATS, MOCK_LOCATIONS_REF, MOCK_ROLES_REF } from '../mockData'
import type { EmployeeDashboardItem } from '../types'

export function EmployeesPage() {
  const navigate = useNavigate()
  const [locationFilter, setLocationFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const filtered = MOCK_EMPLOYEES.filter((e) =>
    (locationFilter === '' || e.locationId === locationFilter) &&
    (roleFilter === '' || e.jobRoleId === roleFilter)
  )

  const resetFilters = () => { setLocationFilter(''); setRoleFilter('') }

  const columns = [
    {
      id: 'name',
      label: 'Employee',
      sortable: true,
      render: (row: EmployeeDashboardItem) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.jobRole}</Typography>
        </Box>
      ),
    },
    {
      id: 'locationName',
      label: 'Location',
      sortable: true,
      render: (row: EmployeeDashboardItem) => (
        <Typography variant="body2">{row.locationName}</Typography>
      ),
    },
    {
      id: 'todayHours',
      label: "Today's Hours",
      sortable: true,
      render: (row: EmployeeDashboardItem) => {
        const isOT = row.todayHours > 8
        const isMissing = row.todayHours === 0
        return (
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              color: isMissing ? 'text.disabled' : isOT ? 'warning.main' : 'text.primary',
            }}
          >
            {isMissing ? '—' : `${row.todayHours}h`}
          </Typography>
        )
      },
    },
    {
      id: 'weeklyHours',
      label: 'Weekly Hours',
      sortable: true,
      render: (row: EmployeeDashboardItem) => {
        const isHighWeekly = row.weeklyHours >= 40
        return (
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 500,
              color: isHighWeekly ? 'warning.main' : 'text.primary',
            }}
          >
            {row.weeklyHours}h
          </Typography>
        )
      },
    },
    {
      id: 'todaySessionStatus',
      label: 'Session',
      sortable: false,
      render: (row: EmployeeDashboardItem) =>
        row.todaySessionStatus
          ? <StatusBadge status={row.todaySessionStatus} />
          : <Chip label="No Session" size="small" variant="outlined" sx={{ color: 'text.disabled', borderColor: 'divider' }} />,
    },
    {
      id: 'pendingOTCount',
      label: 'OT Requests',
      sortable: true,
      align: 'center' as const,
      render: (row: EmployeeDashboardItem) =>
        row.pendingOTCount > 0
          ? (
            <Chip
              label={row.pendingOTCount}
              size="small"
              color="warning"
              sx={{ fontWeight: 700, minWidth: 28 }}
            />
          )
          : <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center' }}>—</Typography>,
    },
  ]

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="Employee status dashboard"
      />

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard
          icon={<PeopleAltIcon />}
          label="Total Active"
          value={MOCK_EMPLOYEE_STATS.totalActive}
          color="primary.main"
        />
        <StatCard
          icon={<AccessTimeIcon />}
          label="Clocked In Today"
          value={MOCK_EMPLOYEE_STATS.clockedInToday}
          color="success.main"
          subtitle={`of ${MOCK_EMPLOYEE_STATS.totalActive} active`}
        />
        <StatCard
          icon={<WarningAmberIcon />}
          label="Missing Time"
          value={MOCK_EMPLOYEE_STATS.missingTimeToday}
          color={MOCK_EMPLOYEE_STATS.missingTimeToday > 0 ? 'error.main' : 'text.secondary'}
          subtitle="No session today"
        />
        <StatCard
          icon={<MoreTimeIcon />}
          label="Overtime Active"
          value={MOCK_EMPLOYEE_STATS.overtimeActive}
          color={MOCK_EMPLOYEE_STATS.overtimeActive > 0 ? 'warning.main' : 'text.secondary'}
          subtitle="Hours > 8 today"
        />
      </Box>

      <FilterBar
        filters={[
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
          {
            id: 'role',
            label: 'Job Role',
            value: roleFilter,
            options: [
              { label: 'All Roles', value: '' },
              ...MOCK_ROLES_REF.map((r) => ({ label: r.name, value: r.id })),
            ],
            onChange: setRoleFilter,
          },
        ]}
        onReset={resetFilters}
      />

      <DataTable<EmployeeDashboardItem>
        columns={columns}
        rows={filtered}
        searchable
        searchPlaceholder="Search by name or location…"
        emptyMessage="No employees match the current filters."
        onRowClick={(row) => navigate(`/time-sessions?userId=${row.userId}`)}
      />
    </>
  )
}

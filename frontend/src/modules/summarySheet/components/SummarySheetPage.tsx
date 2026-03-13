import { useState, useMemo } from 'react'
import { Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { PageHeader } from '@shared/components/PageHeader'
import { SummaryTable } from './SummaryTable'
import {
  MOCK_SUMMARY_ROWS, getCurrentWeekDates, computeTotals,
} from '../mockData'
import type { SummaryRow } from '../types'

// Get Monday and Sunday for the current week
function getWeekBounds(): { start: string; end: string } {
  const dates = getCurrentWeekDates()
  return { start: dates[0], end: dates[6] }
}

const MOCK_LOCATIONS_REF = [
  { id: 'loc1', name: 'Site Alpha' },
  { id: 'loc2', name: 'North Yard' },
  { id: 'loc3', name: 'East Terminal' },
]

const MOCK_EMPLOYEES_REF = [
  { id: 'u3', name: 'James Tran' },
  { id: 'u4', name: 'Maria Santos' },
  { id: 'u5', name: 'Chen Wei' },
  { id: 'u6', name: 'Priya Nair' },
]

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const cur = new Date(start)
  const last = new Date(end)
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  return dates.slice(0, 7) // cap at 7 days for layout
}

export function SummarySheetPage() {
  const weekBounds = getWeekBounds()
  const [startDate, setStartDate] = useState(weekBounds.start)
  const [endDate, setEndDate] = useState(weekBounds.end)
  const [locationFilter, setLocationFilter] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState('')

  const dates = useMemo(() => getDatesInRange(startDate, endDate), [startDate, endDate])

  const filteredRows: SummaryRow[] = MOCK_SUMMARY_ROWS.filter((r) =>
    (locationFilter === '' || MOCK_LOCATIONS_REF.find((l) => l.name === r.locationName)?.id === locationFilter) &&
    (employeeFilter === '' || r.userId === employeeFilter)
  )

  const totals = useMemo(() => computeTotals(filteredRows, dates), [filteredRows, dates])

  const hasOvertimeRows = filteredRows.some((r) => r.weeklyTotal >= 40 || Object.values(r.dailyHours).some((h) => h > 8))

  const handleExport = () => {
    // CSV export — builds content and triggers download
    const header = ['Employee', 'Role', 'Location', ...dates, 'Total'].join(',')
    const rowsCsv = filteredRows.map((r) =>
      [
        `"${r.userName}"`, `"${r.jobRole}"`, `"${r.locationName}"`,
        ...dates.map((d) => r.dailyHours[d] ?? 0),
        r.weeklyTotal,
      ].join(',')
    )
    const csv = [header, ...rowsCsv].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `summary-${startDate}-to-${endDate}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader
        title="Summary Sheet"
        subtitle="Weekly summary reports"
        actions={
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export CSV
          </Button>
        }
      />

      {/* Filter bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2, mb: 3 }}>
        <TextField
          label="From" type="date" size="small" value={startDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ minWidth: 155 }}
        />
        <TextField
          label="To" type="date" size="small" value={endDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ minWidth: 155 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Location</InputLabel>
          <Select value={locationFilter} label="Location" onChange={(e) => setLocationFilter(e.target.value)}>
            <MenuItem value="">All Locations</MenuItem>
            {MOCK_LOCATIONS_REF.map((l) => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Employee</InputLabel>
          <Select value={employeeFilter} label="Employee" onChange={(e) => setEmployeeFilter(e.target.value)}>
            <MenuItem value="">All Employees</MenuItem>
            {MOCK_EMPLOYEES_REF.map((e) => <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}
          </Select>
        </FormControl>
        {(locationFilter || employeeFilter) && (
          <Button size="small" onClick={() => { setLocationFilter(''); setEmployeeFilter('') }}>Clear</Button>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {filteredRows.length} {filteredRows.length === 1 ? 'employee' : 'employees'} · {totals.grandTotal}h total
        </Typography>
      </Box>

      {dates.length > 7 && (
        <Alert severity="warning" sx={{ mb: 2 }}>Date range capped at 7 days for display. Narrow the range for accurate results.</Alert>
      )}
      {hasOvertimeRows && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Highlighted cells indicate daily hours &gt; 8 or weekly total ≥ 40.
        </Alert>
      )}

      {filteredRows.length === 0 ? (
        <Alert severity="info">No approved sessions found for the selected date range and filters.</Alert>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <SummaryTable rows={filteredRows} dates={dates} totals={totals} />
        </Box>
      )}
    </>
  )
}

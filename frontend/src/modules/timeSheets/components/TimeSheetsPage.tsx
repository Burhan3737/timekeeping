import { useState } from 'react'
import { Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { PageHeader } from '@shared/components/PageHeader'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { EmployeeTimeCard } from './EmployeeTimeCard'
import { EntryEditDialog } from './EntryEditDialog'
import { MOCK_SESSIONS, MOCK_LOCATIONS_REF } from '../mockData'
import type { SessionWithDetail, TimeEntryDetail } from '../types'

export function TimeSheetsPage() {
  const [sessions, setSessions] = useState<SessionWithDetail[]>(MOCK_SESSIONS)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [locationFilter, setLocationFilter] = useState('')
  const [editingEntry, setEditingEntry] = useState<TimeEntryDetail | null>(null)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const filtered = sessions.filter((s) =>
    s.date === selectedDate &&
    (locationFilter === '' || s.user.locationId === locationFilter)
  )
  const submittedCount = filtered.filter((s) => s.status === 'SUBMITTED').length

  const handleApprove = (sessionId: string) => {
    setSessions((prev) => prev.map((s) =>
      s.id === sessionId ? { ...s, status: 'APPROVED', reviewedBy: 'Sandra Okafor', reviewedAt: new Date().toISOString() } : s
    ))
  }

  const handleReject = (sessionId: string) => {
    setSessions((prev) => prev.map((s) =>
      s.id === sessionId ? { ...s, status: 'REJECTED', reviewedBy: 'Sandra Okafor', reviewedAt: new Date().toISOString() } : s
    ))
    setRejectTarget(null)
  }

  const handleBulkApprove = () => {
    setSessions((prev) => prev.map((s) =>
      filtered.some((f) => f.id === s.id) && s.status === 'SUBMITTED'
        ? { ...s, status: 'APPROVED', reviewedBy: 'Sandra Okafor', reviewedAt: new Date().toISOString() }
        : s
    ))
    setBulkConfirmOpen(false)
  }

  const handleEditEntry = (entryId: string, data: Partial<TimeEntryDetail>, _notes: string) => {
    setSessions((prev) => prev.map((s) => ({
      ...s,
      entries: s.entries.map((e) => e.id === entryId ? { ...e, ...data, updatedAt: new Date().toISOString() } : e),
    })))
    setEditingEntry(null)
  }

  const resetFilters = () => { setLocationFilter('') }

  return (
    <>
      <PageHeader
        title="Time Sheets"
        subtitle="Daily review and approval"
        actions={
          submittedCount > 0 ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<DoneAllIcon />}
              onClick={() => setBulkConfirmOpen(true)}
            >
              Bulk Approve ({submittedCount})
            </Button>
          ) : undefined
        }
      />

      {/* Filter bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2, mb: 3 }}>
        <TextField
          label="Date" type="date" size="small" value={selectedDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ minWidth: 160 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Location</InputLabel>
          <Select value={locationFilter} label="Location" onChange={(e) => setLocationFilter(e.target.value)}>
            <MenuItem value="">All Locations</MenuItem>
            {MOCK_LOCATIONS_REF.map((l) => (
              <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {locationFilter && (
          <Button size="small" variant="text" onClick={resetFilters}>
            Clear filter
          </Button>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'session' : 'sessions'}
          {submittedCount > 0 && ` · ${submittedCount} pending review`}
        </Typography>
      </Box>

      {filtered.length === 0 ? (
        <Alert severity="info">No sessions found for the selected date and location.</Alert>
      ) : (
        <>
          {submittedCount > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {submittedCount} {submittedCount === 1 ? 'session requires' : 'sessions require'} review for {selectedDate}.
            </Alert>
          )}
          {filtered.map((session) => (
            <EmployeeTimeCard
              key={session.id}
              session={session}
              onApprove={handleApprove}
              onReject={(id) => setRejectTarget(id)}
              onEditEntry={setEditingEntry}
            />
          ))}
        </>
      )}

      <EntryEditDialog
        open={!!editingEntry}
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSubmit={handleEditEntry}
      />

      <ConfirmDialog
        open={!!rejectTarget}
        title="Reject Time Session"
        message="Reject this session? It will be returned to the worker as DRAFT for corrections and resubmission."
        confirmLabel="Reject Session"
        confirmColor="error"
        onConfirm={() => rejectTarget && handleReject(rejectTarget)}
        onCancel={() => setRejectTarget(null)}
      />

      <ConfirmDialog
        open={bulkConfirmOpen}
        title={`Bulk Approve ${submittedCount} Sessions`}
        message={`Approve all ${submittedCount} submitted sessions for ${selectedDate}${locationFilter ? ` at ${MOCK_LOCATIONS_REF.find((l) => l.id === locationFilter)?.name}` : ''}? This cannot be undone.`}
        confirmLabel="Approve All"
        confirmColor="primary"
        onConfirm={handleBulkApprove}
        onCancel={() => setBulkConfirmOpen(false)}
      />
    </>
  )
}

import { useState } from 'react'
import { Box, Button, Typography, IconButton, Tooltip, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SendIcon from '@mui/icons-material/Send'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DateRangeIcon from '@mui/icons-material/DateRange'
import ListAltIcon from '@mui/icons-material/ListAlt'
import FlagIcon from '@mui/icons-material/Flag'
import { PageHeader } from '@shared/components/PageHeader'
import { StatCard } from '@shared/components/StatCard'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { TimeEntryList } from './TimeEntryList'
import { TimeEntryFormDialog } from './TimeEntryFormDialog'
import { MOCK_CURRENT_SESSION, MOCK_CURRENT_ENTRIES } from '../mockData'
import type { TimeEntry, TimeSession } from '../types'

function hoursLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function TimeSessionsPage() {
  const [session, setSession] = useState<TimeSession>(MOCK_CURRENT_SESSION)
  const [entries, setEntries] = useState<TimeEntry[]>(MOCK_CURRENT_ENTRIES)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TimeEntry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TimeEntry | null>(null)
  const [submitOpen, setSubmitOpen] = useState(false)

  const isDraft = session.status === 'DRAFT'
  const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0)
  const weeklyHours = 32.5 // mock weekly total

  const handleFormSubmit = (data: Omit<TimeEntry, 'id' | 'sessionId' | 'durationMinutes' | 'isOvertime' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const [sh, sm] = data.startTime.split(':').map(Number)
    const [eh, em] = data.endTime.split(':').map(Number)
    const durationMinutes = (eh * 60 + em) - (sh * 60 + sm)
    const isOvertime = (totalMinutes + durationMinutes) > 480 // >8h

    if (editing) {
      setEntries((prev) => prev.map((e) => e.id === editing.id
        ? { ...e, ...data, durationMinutes, isOvertime, updatedAt: now }
        : e
      ))
    } else {
      const newEntry: TimeEntry = {
        id: String(Date.now()), sessionId: session.id,
        ...data, durationMinutes, isOvertime, createdAt: now, updatedAt: now,
      }
      setEntries((prev) => [...prev, newEntry])
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleSubmit = () => {
    setSession((s) => ({ ...s, status: 'SUBMITTED', submittedAt: new Date().toISOString() }))
    setSubmitOpen(false)
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <PageHeader
        title="Time Sessions"
        subtitle={today}
        actions={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Previous day">
              <IconButton size="small"><ChevronLeftIcon /></IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {session.date}
            </Typography>
            <Tooltip title="Next day">
              <IconButton size="small"><ChevronRightIcon /></IconButton>
            </Tooltip>
          </Box>
        }
      />

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard
          icon={<AccessTimeIcon />}
          label="Today's Hours"
          value={hoursLabel(totalMinutes)}
          color="primary.main"
          subtitle={totalMinutes > 480 ? 'Includes overtime' : undefined}
        />
        <StatCard
          icon={<DateRangeIcon />}
          label="Week Hours"
          value={`${weeklyHours}h`}
          color="secondary.main"
          subtitle="Mon – today"
        />
        <StatCard
          icon={<ListAltIcon />}
          label="Entries Today"
          value={entries.length}
          color="info.main"
        />
        <StatCard
          icon={<FlagIcon />}
          label="Session Status"
          value={session.status}
          color="text.secondary"
        />
      </Box>

      {/* Submitted notice */}
      {session.status === 'SUBMITTED' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This session has been submitted for review. You cannot add or edit entries until it is reviewed.
        </Alert>
      )}
      {session.status === 'REJECTED' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          This session was rejected. Please review and resubmit.
        </Alert>
      )}

      {/* Entries section header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Time Entries
          {entries.length > 0 && (
            <Typography component="span" variant="body2" color="text.disabled" sx={{ ml: 1 }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · {hoursLabel(totalMinutes)} total
            </Typography>
          )}
        </Typography>
        {isDraft && (
          <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true) }}>
            Add Entry
          </Button>
        )}
      </Box>

      <TimeEntryList
        entries={entries}
        status={session.status}
        onEdit={(e) => { setEditing(e); setFormOpen(true) }}
        onDelete={setDeleteTarget}
      />

      {/* Submit button */}
      {isDraft && entries.length > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={() => setSubmitOpen(true)}
          >
            Submit for Review
          </Button>
        </Box>
      )}

      <TimeEntryFormDialog
        open={formOpen}
        entry={editing}
        sessionId={session.id}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Time Entry"
        message={deleteTarget ? `Delete the entry from ${deleteTarget.startTime} to ${deleteTarget.endTime}?` : ''}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={submitOpen}
        title="Submit Session for Review"
        message={`Submit today's session (${hoursLabel(totalMinutes)}, ${entries.length} entries) for supervisor review? You won't be able to edit entries after submission.`}
        confirmLabel="Submit"
        confirmColor="primary"
        onConfirm={handleSubmit}
        onCancel={() => setSubmitOpen(false)}
      />
    </>
  )
}

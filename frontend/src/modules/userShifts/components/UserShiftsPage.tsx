import { useState, useMemo } from 'react'
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  IconButton, Tooltip, Paper, Divider, Chip, Stack,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { PageHeader } from '@shared/components/PageHeader'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { TimeGrid24hr, TimeSegment } from '@shared/components/TimeGrid24hr'
import { ShiftFormDialog } from './ShiftFormDialog'
import { MOCK_SHIFTS, MOCK_USERS_REF, MOCK_JOB_ROLES_REF, MOCK_LOCATIONS_REF } from '../mockData'
import { DAYS_OF_WEEK, DAY_LABELS } from '../types'
import type { UserShift, DayOfWeek } from '../types'

function shiftToSegment(shift: UserShift): TimeSegment {
  const role = MOCK_JOB_ROLES_REF.find((r) => r.id === shift.roleId)
  const loc = MOCK_LOCATIONS_REF.find((l) => l.id === shift.locationId)
  return {
    id: shift.id,
    startTime: shift.startTime,
    endTime: shift.endTime,
    label: role?.name,
    type: 'normal',
    tooltip: `${shift.startTime}–${shift.endTime} · ${role?.name ?? ''} · ${loc?.name ?? ''}`,
  }
}

export function UserShiftsPage() {
  const [selectedUserId, setSelectedUserId] = useState(MOCK_USERS_REF[0].id)
  const [shifts, setShifts] = useState<UserShift[]>(MOCK_SHIFTS)
  const [formOpen, setFormOpen] = useState(false)
  const [formDay, setFormDay] = useState<DayOfWeek | undefined>()
  const [editing, setEditing] = useState<UserShift | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserShift | null>(null)

  const selectedUser = MOCK_USERS_REF.find((u) => u.id === selectedUserId)
  const userShifts = useMemo(
    () => shifts.filter((s) => s.userId === selectedUserId),
    [shifts, selectedUserId]
  )

  const openAdd = (day: DayOfWeek) => { setEditing(null); setFormDay(day); setFormOpen(true) }
  const openEdit = (shift: UserShift) => { setEditing(shift); setFormDay(undefined); setFormOpen(true) }

  const handleFormSubmit = (data: Omit<UserShift, 'id' | 'userId' | 'isActive' | 'createdAt'>) => {
    if (editing) {
      setShifts((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...data } : s))
    } else {
      const next: UserShift = {
        id: String(Date.now()),
        userId: selectedUserId,
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10),
        ...data,
      }
      setShifts((prev) => [...prev, next])
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setShifts((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <PageHeader
        title="User Shifts"
        subtitle="Manage employee weekly shift schedules"
      />

      {/* Employee selector */}
      <FormControl size="small" sx={{ mb: 3, minWidth: 260 }}>
        <InputLabel>Employee</InputLabel>
        <Select
          value={selectedUserId}
          label="Employee"
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {MOCK_USERS_REF.map((u) => (
            <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Weekly grid */}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {DAYS_OF_WEEK.map((day, idx) => {
          const dayShifts = userShifts.filter((s) => s.dayOfWeek === day)
          const segments = dayShifts.map(shiftToSegment)
          const isWeekend = day === 'SATURDAY' || day === 'SUNDAY'

          return (
            <Box key={day}>
              {idx > 0 && <Divider />}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  alignItems: 'center',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  bgcolor: isWeekend ? 'action.hover' : 'transparent',
                }}
              >
                {/* Day label */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: isWeekend ? 400 : 600, color: isWeekend ? 'text.secondary' : 'text.primary' }}
                  >
                    {DAY_LABELS[day]}
                  </Typography>
                  {dayShifts.length > 0 && (
                    <Typography variant="caption" color="text.disabled">
                      {dayShifts.length} shift{dayShifts.length > 1 ? 's' : ''}
                    </Typography>
                  )}
                </Box>

                {/* Time grid */}
                <Box>
                  {segments.length > 0 ? (
                    <TimeGrid24hr
                      segments={segments}
                      editable
                      onSegmentClick={(seg) => {
                        const shift = dayShifts.find((s) => s.id === seg.id)
                        if (shift) openEdit(shift)
                      }}
                      showLegend={false}
                      height={36}
                    />
                  ) : (
                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                      No shifts scheduled
                    </Typography>
                  )}
                </Box>

                {/* Per-day actions */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {dayShifts.map((shift) => {
                    const role = MOCK_JOB_ROLES_REF.find((r) => r.id === shift.roleId)
                    const loc = MOCK_LOCATIONS_REF.find((l) => l.id === shift.locationId)
                    return (
                      <Chip
                        key={shift.id}
                        label={`${shift.startTime}–${shift.endTime}`}
                        size="small"
                        variant="outlined"
                        title={`${role?.name} · ${loc?.name}`}
                        onDelete={() => setDeleteTarget(shift)}
                        onClick={() => openEdit(shift)}
                        sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', cursor: 'pointer' }}
                      />
                    )
                  })}
                  <Tooltip title={`Add shift on ${DAY_LABELS[day]}`}>
                    <IconButton size="small" onClick={() => openAdd(day)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Box>
          )
        })}
      </Paper>

      {/* Legend below grid */}
      <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
        <Typography variant="caption" color="text.disabled">
          Click a shift block or chip to edit · Click chip × to delete · Click + to add
        </Typography>
      </Box>

      <ShiftFormDialog
        open={formOpen}
        shift={editing}
        defaultDay={formDay}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Shift"
        message={
          deleteTarget
            ? `Delete the ${DAY_LABELS[deleteTarget.dayOfWeek]} shift (${deleteTarget.startTime}–${deleteTarget.endTime}) for ${selectedUser?.name}?`
            : ''
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

import { useEffect, useState } from 'react'
import {
  TextField, Stack, MenuItem, Select, FormControl, InputLabel,
  FormHelperText, Checkbox, FormControlLabel, Collapse, Box, Typography,
} from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import {
  MOCK_CHARGE_CODES_REF, MOCK_LOCATIONS_REF, STEP_UP_ROLES_REF, CURRENT_USER,
} from '../mockData'
import type { TimeEntry } from '../types'

interface FormState {
  startTime: string
  endTime: string
  chargeCodeId: string
  useStepUp: boolean
  stepUpRoleId: string
  locationId: string
  notes: string
}

interface Errors {
  startTime?: string; endTime?: string; chargeCodeId?: string
  stepUpRoleId?: string; locationId?: string
}

const EMPTY: FormState = {
  startTime: '', endTime: '', chargeCodeId: '',
  useStepUp: false, stepUpRoleId: '', locationId: CURRENT_USER.primaryLocationId, notes: '',
}

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

interface TimeEntryFormDialogProps {
  open: boolean
  entry?: TimeEntry | null
  sessionId: string
  onClose: () => void
  onSubmit: (data: Omit<TimeEntry, 'id' | 'sessionId' | 'durationMinutes' | 'isOvertime' | 'createdAt' | 'updatedAt'>) => void
  loading?: boolean
}

export function TimeEntryFormDialog({ open, entry, onClose, onSubmit, loading = false }: TimeEntryFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (open) {
      setForm(entry ? {
        startTime: entry.startTime,
        endTime: entry.endTime,
        chargeCodeId: entry.chargeCodeId,
        useStepUp: !!entry.stepUpRoleId,
        stepUpRoleId: entry.stepUpRoleId ?? '',
        locationId: entry.locationId,
        notes: entry.notes ?? '',
      } : EMPTY)
      setErrors({})
    }
  }, [open, entry])

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: val }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.startTime) e.startTime = 'Required'
    if (!form.endTime) e.endTime = 'Required'
    else if (form.startTime && minutesBetween(form.startTime, form.endTime) <= 0)
      e.endTime = 'End time must be after start time'
    if (!form.chargeCodeId) e.chargeCodeId = 'Required'
    if (form.useStepUp && !form.stepUpRoleId) e.stepUpRoleId = 'Select a step-up role'
    if (!form.locationId) e.locationId = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      startTime: form.startTime,
      endTime: form.endTime,
      chargeCodeId: form.chargeCodeId,
      stepUpRoleId: form.useStepUp ? form.stepUpRoleId : undefined,
      locationId: form.locationId,
      notes: form.notes || undefined,
    })
  }

  const duration = form.startTime && form.endTime
    ? minutesBetween(form.startTime, form.endTime)
    : null

  return (
    <FormDialog
      open={open}
      title={entry ? 'Edit Time Entry' : 'Add Time Entry'}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={entry ? 'Save Changes' : 'Add Entry'}
    >
      <Stack spacing={2.5}>
        {/* Time range */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Start Time" type="time" value={form.startTime} required fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set('startTime', e.target.value)}
            error={!!errors.startTime} helperText={errors.startTime}
          />
          <TextField
            label="End Time" type="time" value={form.endTime} required fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set('endTime', e.target.value)}
            error={!!errors.endTime} helperText={errors.endTime}
          />
        </Box>

        {/* Duration preview */}
        {duration !== null && duration > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
            Duration: {Math.floor(duration / 60)}h {duration % 60 > 0 ? `${duration % 60}m` : ''}
          </Typography>
        )}

        {/* Charge code */}
        <FormControl required error={!!errors.chargeCodeId} fullWidth>
          <InputLabel>Charge Code</InputLabel>
          <Select value={form.chargeCodeId} label="Charge Code" onChange={(e) => set('chargeCodeId', e.target.value)}>
            {MOCK_CHARGE_CODES_REF.map((cc) => (
              <MenuItem key={cc.id} value={cc.id}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, minWidth: 70 }}>
                    {cc.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{cc.description}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
          {errors.chargeCodeId && <FormHelperText>{errors.chargeCodeId}</FormHelperText>}
        </FormControl>

        {/* Step-up role toggle */}
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.useStepUp}
                onChange={(e) => { set('useStepUp', e.target.checked); set('stepUpRoleId', '') }}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                Performing step-up role
                <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                  (higher grade than your current level {CURRENT_USER.jobRoleLevel})
                </Typography>
              </Typography>
            }
          />
          <Collapse in={form.useStepUp}>
            <FormControl required={form.useStepUp} error={!!errors.stepUpRoleId} fullWidth sx={{ mt: 1 }}>
              <InputLabel>Step-Up Role</InputLabel>
              <Select value={form.stepUpRoleId} label="Step-Up Role" onChange={(e) => set('stepUpRoleId', e.target.value)}>
                {STEP_UP_ROLES_REF.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                    <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                      Level {r.level}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
              {errors.stepUpRoleId && <FormHelperText>{errors.stepUpRoleId}</FormHelperText>}
            </FormControl>
          </Collapse>
        </Box>

        {/* Location */}
        <FormControl required error={!!errors.locationId} fullWidth>
          <InputLabel>Location</InputLabel>
          <Select value={form.locationId} label="Location" onChange={(e) => set('locationId', e.target.value)}>
            {MOCK_LOCATIONS_REF.map((l) => (
              <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
            ))}
          </Select>
          {errors.locationId && <FormHelperText>{errors.locationId}</FormHelperText>}
        </FormControl>

        {/* Notes */}
        <TextField
          label="Notes" value={form.notes} multiline rows={2} fullWidth
          onChange={(e) => set('notes', e.target.value)}
          helperText="Optional"
        />
      </Stack>
    </FormDialog>
  )
}

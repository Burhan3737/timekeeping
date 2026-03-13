import { useEffect, useState } from 'react'
import { TextField, Stack, MenuItem, Select, FormControl, InputLabel, FormHelperText, Box } from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import { MOCK_JOB_ROLES_REF, MOCK_LOCATIONS_REF } from '../mockData'
import { DAYS_OF_WEEK, DAY_LABELS } from '../types'
import type { UserShift, DayOfWeek } from '../types'

interface ShiftFormDialogProps {
  open: boolean
  shift?: UserShift | null
  defaultDay?: DayOfWeek
  onClose: () => void
  onSubmit: (data: Omit<UserShift, 'id' | 'userId' | 'isActive' | 'createdAt'>) => void
  loading?: boolean
}

interface FormState {
  dayOfWeek: DayOfWeek | ''
  startTime: string
  endTime: string
  roleId: string
  locationId: string
}

interface Errors {
  dayOfWeek?: string; startTime?: string; endTime?: string
  roleId?: string; locationId?: string
}

const EMPTY: FormState = { dayOfWeek: '', startTime: '', endTime: '', roleId: '', locationId: '' }

export function ShiftFormDialog({ open, shift, defaultDay, onClose, onSubmit, loading = false }: ShiftFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (open) {
      setForm(shift ? {
        dayOfWeek: shift.dayOfWeek,
        startTime: shift.startTime,
        endTime: shift.endTime,
        roleId: shift.roleId,
        locationId: shift.locationId,
      } : { ...EMPTY, dayOfWeek: defaultDay ?? '' })
      setErrors({})
    }
  }, [open, shift, defaultDay])

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: val }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.dayOfWeek) e.dayOfWeek = 'Required'
    if (!form.startTime) e.startTime = 'Required'
    if (!form.endTime) e.endTime = 'Required'
    else if (form.startTime && form.endTime <= form.startTime) e.endTime = 'End time must be after start time'
    if (!form.roleId) e.roleId = 'Required'
    if (!form.locationId) e.locationId = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      dayOfWeek: form.dayOfWeek as DayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      roleId: form.roleId,
      locationId: form.locationId,
    })
  }

  return (
    <FormDialog
      open={open}
      title={shift ? 'Edit Shift' : 'Add Shift'}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={shift ? 'Save Changes' : 'Add Shift'}
    >
      <Stack spacing={2.5}>
        <FormControl required error={!!errors.dayOfWeek} fullWidth>
          <InputLabel>Day of Week</InputLabel>
          <Select value={form.dayOfWeek} label="Day of Week" onChange={(e) => set('dayOfWeek', e.target.value as DayOfWeek)}>
            {DAYS_OF_WEEK.map((d) => (
              <MenuItem key={d} value={d}>{DAY_LABELS[d]}</MenuItem>
            ))}
          </Select>
          {errors.dayOfWeek && <FormHelperText>{errors.dayOfWeek}</FormHelperText>}
        </FormControl>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Start Time" type="time" value={form.startTime} required fullWidth
            onChange={(e) => set('startTime', e.target.value)}
            error={!!errors.startTime} helperText={errors.startTime}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time" type="time" value={form.endTime} required fullWidth
            onChange={(e) => set('endTime', e.target.value)}
            error={!!errors.endTime} helperText={errors.endTime}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <FormControl required error={!!errors.roleId} fullWidth>
          <InputLabel>Job Role</InputLabel>
          <Select value={form.roleId} label="Job Role" onChange={(e) => set('roleId', e.target.value)}>
            {MOCK_JOB_ROLES_REF.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
            ))}
          </Select>
          {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
        </FormControl>

        <FormControl required error={!!errors.locationId} fullWidth>
          <InputLabel>Location</InputLabel>
          <Select value={form.locationId} label="Location" onChange={(e) => set('locationId', e.target.value)}>
            {MOCK_LOCATIONS_REF.map((l) => (
              <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
            ))}
          </Select>
          {errors.locationId && <FormHelperText>{errors.locationId}</FormHelperText>}
        </FormControl>
      </Stack>
    </FormDialog>
  )
}

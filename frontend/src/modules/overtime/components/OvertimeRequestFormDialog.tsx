import { useEffect, useState } from 'react'
import {
  TextField, Stack, MenuItem, Select, FormControl, InputLabel,
  FormHelperText, Checkbox, FormControlLabel, Collapse, Box, Typography,
} from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import { MOCK_CHARGE_CODES_REF, STEP_UP_ROLES_REF } from '../mockData'
import type { OvertimeRequest } from '../types'

interface FormState {
  date: string
  startTime: string
  estimatedDurationMinutes: string
  chargeCodeId: string
  useStepUp: boolean
  stepUpRoleId: string
  reason: string
}

interface Errors {
  date?: string
  startTime?: string
  estimatedDurationMinutes?: string
  chargeCodeId?: string
  stepUpRoleId?: string
  reason?: string
}

const today = new Date().toISOString().slice(0, 10)

const EMPTY: FormState = {
  date: today,
  startTime: '',
  estimatedDurationMinutes: '',
  chargeCodeId: '',
  useStepUp: false,
  stepUpRoleId: '',
  reason: '',
}

interface OvertimeRequestFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<OvertimeRequest, 'id' | 'status' | 'reviewedBy' | 'reviewedAt' | 'reviewNotes' | 'createdAt' | 'updatedAt'>) => void
  loading?: boolean
}

export function OvertimeRequestFormDialog({ open, onClose, onSubmit, loading = false }: OvertimeRequestFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (open) {
      setForm(EMPTY)
      setErrors({})
    }
  }, [open])

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: val }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.date) e.date = 'Required'
    if (!form.startTime) e.startTime = 'Required'
    if (!form.estimatedDurationMinutes) {
      e.estimatedDurationMinutes = 'Required'
    } else if (isNaN(Number(form.estimatedDurationMinutes)) || Number(form.estimatedDurationMinutes) <= 0) {
      e.estimatedDurationMinutes = 'Must be a positive number'
    }
    if (!form.chargeCodeId) e.chargeCodeId = 'Required'
    if (form.useStepUp && !form.stepUpRoleId) e.stepUpRoleId = 'Select a step-up role'
    if (!form.reason.trim()) e.reason = 'Required'
    else if (form.reason.trim().length < 10) e.reason = 'Please provide more detail (min 10 characters)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      userId: 'u3', // current user — replaced by auth in Phase 3
      date: form.date,
      startTime: form.startTime,
      estimatedDurationMinutes: Number(form.estimatedDurationMinutes),
      chargeCodeId: form.chargeCodeId,
      stepUpRoleId: form.useStepUp ? form.stepUpRoleId : undefined,
      reason: form.reason.trim(),
    })
  }

  const durationHours = form.estimatedDurationMinutes
    ? Math.floor(Number(form.estimatedDurationMinutes) / 60)
    : null
  const durationMins = form.estimatedDurationMinutes
    ? Number(form.estimatedDurationMinutes) % 60
    : null

  return (
    <FormDialog
      open={open}
      title="Request Overtime"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Submit Request"
    >
      <Stack spacing={2.5}>
        {/* Date + Start Time */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Date" type="date" value={form.date} required fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set('date', e.target.value)}
            error={!!errors.date} helperText={errors.date}
          />
          <TextField
            label="Start Time" type="time" value={form.startTime} required fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set('startTime', e.target.value)}
            error={!!errors.startTime} helperText={errors.startTime}
          />
        </Box>

        {/* Estimated Duration */}
        <TextField
          label="Estimated Duration (minutes)" type="number" value={form.estimatedDurationMinutes}
          required fullWidth inputProps={{ min: 1, step: 15 }}
          onChange={(e) => set('estimatedDurationMinutes', e.target.value)}
          error={!!errors.estimatedDurationMinutes} helperText={errors.estimatedDurationMinutes}
        />
        {durationHours !== null && Number(form.estimatedDurationMinutes) > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: -1.5 }}>
            {durationHours > 0 ? `${durationHours}h ` : ''}{durationMins! > 0 ? `${durationMins}m` : ''}
          </Typography>
        )}

        {/* Charge Code */}
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
                Performing step-up role during overtime
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

        {/* Reason */}
        <TextField
          label="Reason" value={form.reason} multiline rows={3} required fullWidth
          placeholder="Explain why overtime is needed for pre-approval…"
          onChange={(e) => set('reason', e.target.value)}
          error={!!errors.reason} helperText={errors.reason || 'Describe the business need for overtime'}
        />
      </Stack>
    </FormDialog>
  )
}

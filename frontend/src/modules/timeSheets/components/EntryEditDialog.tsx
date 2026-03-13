import { useEffect, useState } from 'react'
import {
  TextField, Stack, MenuItem, Select, FormControl, InputLabel,
  FormHelperText, Box, Typography, Divider, Chip,
} from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import { MOCK_CHARGE_CODES_REF, STEP_UP_ROLES_REF, CHARGE_CODE_MAP, STEP_UP_ROLE_MAP } from '../mockData'
import type { TimeEntryDetail } from '../types'

interface FormState {
  startTime: string
  endTime: string
  chargeCodeId: string
  stepUpRoleId: string
  supervisorNotes: string
}

interface Errors {
  startTime?: string
  endTime?: string
  chargeCodeId?: string
  supervisorNotes?: string
}

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

interface EntryEditDialogProps {
  open: boolean
  entry: TimeEntryDetail | null
  onClose: () => void
  onSubmit: (entryId: string, data: Partial<TimeEntryDetail>, notes: string) => void
  loading?: boolean
}

export function EntryEditDialog({ open, entry, onClose, onSubmit, loading = false }: EntryEditDialogProps) {
  const [form, setForm] = useState<FormState>({
    startTime: '', endTime: '', chargeCodeId: '', stepUpRoleId: '', supervisorNotes: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (open && entry) {
      setForm({
        startTime: entry.startTime,
        endTime: entry.endTime,
        chargeCodeId: entry.chargeCodeId,
        stepUpRoleId: entry.stepUpRoleId ?? '',
        supervisorNotes: '',
      })
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
    if (!form.supervisorNotes.trim()) e.supervisorNotes = 'Edit justification is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate() || !entry) return
    onSubmit(entry.id, {
      startTime: form.startTime,
      endTime: form.endTime,
      chargeCodeId: form.chargeCodeId,
      stepUpRoleId: form.stepUpRoleId || undefined,
    }, form.supervisorNotes.trim())
  }

  if (!entry) return null

  return (
    <FormDialog
      open={open}
      title="Edit Time Entry"
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Save Changes"
    >
      <Stack spacing={2.5}>
        {/* Original values reference */}
        <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, display: 'block', mb: 0.75 }}>
            ORIGINAL VALUES
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip size="small" label={`${entry.startTime} – ${entry.endTime}`} variant="outlined" />
            <Chip size="small" label={CHARGE_CODE_MAP[entry.chargeCodeId] ?? entry.chargeCodeId} variant="outlined" />
            {entry.stepUpRoleId && (
              <Chip size="small" label={STEP_UP_ROLE_MAP[entry.stepUpRoleId] ?? entry.stepUpRoleId} variant="outlined" color="error" />
            )}
            {entry.isOvertime && <Chip size="small" label="Overtime" variant="outlined" color="warning" />}
          </Box>
        </Box>

        <Divider />

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

        {/* Step-up Role (optional) */}
        <FormControl fullWidth>
          <InputLabel>Step-Up Role (optional)</InputLabel>
          <Select
            value={form.stepUpRoleId}
            label="Step-Up Role (optional)"
            onChange={(e) => set('stepUpRoleId', e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {STEP_UP_ROLES_REF.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
                <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                  Level {r.level}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Supervisor notes (required) */}
        <TextField
          label="Edit Justification" value={form.supervisorNotes} multiline rows={2} required fullWidth
          placeholder="Explain the reason for this correction…"
          onChange={(e) => set('supervisorNotes', e.target.value)}
          error={!!errors.supervisorNotes} helperText={errors.supervisorNotes || 'Required for audit trail'}
        />
      </Stack>
    </FormDialog>
  )
}

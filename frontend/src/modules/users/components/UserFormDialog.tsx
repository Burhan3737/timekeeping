import { useEffect, useState } from 'react'
import {
  TextField, Stack, MenuItem, Select, FormControl, InputLabel,
  FormHelperText, OutlinedInput, Chip, Box, Switch, FormControlLabel,
  Divider, Typography,
} from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import { MOCK_JOB_ROLES, MOCK_LOCATIONS } from '../mockData'
import { SYSTEM_ROLE_LABELS } from '../types'
import type { User, SystemRole } from '../types'

const SYSTEM_ROLES: SystemRole[] = ['FIELD_WORKER', 'SUPERVISOR', 'ADMIN', 'DATA_ENTRY_CLERK']

interface FormData {
  firstName: string
  lastName: string
  email: string
  pin: string
  systemRole: SystemRole | ''
  jobRoleId: string
  locationIds: string[]
  isActive: boolean
}

interface Errors {
  firstName?: string; lastName?: string; email?: string
  pin?: string; systemRole?: string; jobRoleId?: string; locationIds?: string
}

const EMPTY: FormData = {
  firstName: '', lastName: '', email: '', pin: '',
  systemRole: '', jobRoleId: '', locationIds: [], isActive: true,
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface UserFormDialogProps {
  open: boolean
  user?: User | null
  onClose: () => void
  onSubmit: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void
  loading?: boolean
}

export function UserFormDialog({ open, user, onClose, onSubmit, loading = false }: UserFormDialogProps) {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (open) {
      setForm(user ? {
        firstName: user.firstName, lastName: user.lastName, email: user.email,
        pin: user.pin, systemRole: user.systemRole, jobRoleId: user.jobRoleId,
        locationIds: user.locationIds, isActive: user.isActive,
      } : EMPTY)
      setErrors({})
    }
  }, [open, user])

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((p) => ({ ...p, [key]: val }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!validateEmail(form.email)) e.email = 'Invalid email address'
    if (!form.pin.trim()) e.pin = 'Required'
    else if (!/^\d{4,6}$/.test(form.pin)) e.pin = 'Must be 4–6 digits'
    if (!form.systemRole) e.systemRole = 'Required'
    if (!form.jobRoleId) e.jobRoleId = 'Required'
    if (form.locationIds.length === 0) e.locationIds = 'At least one location required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      pin: form.pin.trim(),
      systemRole: form.systemRole as SystemRole,
      jobRoleId: form.jobRoleId,
      locationIds: form.locationIds,
      isActive: form.isActive,
    })
  }

  return (
    <FormDialog
      open={open}
      title={user ? 'Edit User' : 'Add User'}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={user ? 'Save Changes' : 'Add User'}
      maxWidth="sm"
    >
      <Stack spacing={2.5}>
        {/* Name row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="First Name" value={form.firstName} autoFocus required fullWidth
            onChange={(e) => set('firstName', e.target.value)}
            error={!!errors.firstName} helperText={errors.firstName}
          />
          <TextField
            label="Last Name" value={form.lastName} required fullWidth
            onChange={(e) => set('lastName', e.target.value)}
            error={!!errors.lastName} helperText={errors.lastName}
          />
        </Box>

        {/* Email */}
        <TextField
          label="Email" type="email" value={form.email} required fullWidth
          onChange={(e) => set('email', e.target.value)}
          error={!!errors.email} helperText={errors.email}
        />

        {/* PIN */}
        <TextField
          label="PIN" type="password" value={form.pin} required fullWidth
          onChange={(e) => set('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
          error={!!errors.pin}
          helperText={errors.pin || '4–6 digit PIN used for Field Mode login'}
          inputProps={{ inputMode: 'numeric', maxLength: 6 }}
        />

        <Divider>
          <Typography variant="caption" color="text.disabled">Role & Assignment</Typography>
        </Divider>

        {/* System role */}
        <FormControl required error={!!errors.systemRole} fullWidth>
          <InputLabel>System Role</InputLabel>
          <Select
            value={form.systemRole}
            label="System Role"
            onChange={(e) => set('systemRole', e.target.value as SystemRole)}
          >
            {SYSTEM_ROLES.map((r) => (
              <MenuItem key={r} value={r}>{SYSTEM_ROLE_LABELS[r]}</MenuItem>
            ))}
          </Select>
          {errors.systemRole && <FormHelperText>{errors.systemRole}</FormHelperText>}
        </FormControl>

        {/* Job role */}
        <FormControl required error={!!errors.jobRoleId} fullWidth>
          <InputLabel>Job Role</InputLabel>
          <Select
            value={form.jobRoleId}
            label="Job Role"
            onChange={(e) => set('jobRoleId', e.target.value)}
          >
            {MOCK_JOB_ROLES.map((jr) => (
              <MenuItem key={jr.id} value={jr.id}>
                {jr.name}
                <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                  Level {jr.level}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          {errors.jobRoleId && <FormHelperText>{errors.jobRoleId}</FormHelperText>}
        </FormControl>

        {/* Locations multi-select */}
        <FormControl required error={!!errors.locationIds} fullWidth>
          <InputLabel>Locations</InputLabel>
          <Select
            multiple
            value={form.locationIds}
            onChange={(e) => set('locationIds', typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
            input={<OutlinedInput label="Locations" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((id) => {
                  const loc = MOCK_LOCATIONS.find((l) => l.id === id)
                  return <Chip key={id} label={loc?.name ?? id} size="small" />
                })}
              </Box>
            )}
          >
            {MOCK_LOCATIONS.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
            ))}
          </Select>
          {errors.locationIds
            ? <FormHelperText>{errors.locationIds}</FormHelperText>
            : <FormHelperText>Assign one or more work sites</FormHelperText>}
        </FormControl>

        {/* Active toggle (edit mode only) */}
        {user && (
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                color="success"
              />
            }
            label={form.isActive ? 'Active' : 'Inactive'}
          />
        )}
      </Stack>
    </FormDialog>
  )
}

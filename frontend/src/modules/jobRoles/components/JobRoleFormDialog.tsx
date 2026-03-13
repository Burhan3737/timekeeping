import { useEffect, useState } from 'react'
import { TextField, Stack } from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import type { JobRole } from '../types'

interface JobRoleFormDialogProps {
  open: boolean
  jobRole?: JobRole | null
  nextLevel: number           // auto-suggested level for new roles
  onClose: () => void
  onSubmit: (data: { name: string; level: number }) => void
  loading?: boolean
}

export function JobRoleFormDialog({
  open,
  jobRole,
  nextLevel,
  onClose,
  onSubmit,
  loading = false,
}: JobRoleFormDialogProps) {
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [errors, setErrors] = useState<{ name?: string; level?: string }>({})

  useEffect(() => {
    if (open) {
      setName(jobRole?.name ?? '')
      setLevel(jobRole ? String(jobRole.level) : String(nextLevel))
      setErrors({})
    }
  }, [open, jobRole, nextLevel])

  const validate = () => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Name is required'
    const lvl = parseInt(level)
    if (!level || isNaN(lvl) || lvl < 1) next.level = 'Level must be a positive number'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ name: name.trim(), level: parseInt(level) })
  }

  return (
    <FormDialog
      open={open}
      title={jobRole ? 'Edit Job Role' : 'Add Job Role'}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={jobRole ? 'Save Changes' : 'Add Role'}
    >
      <Stack spacing={2.5}>
        <TextField
          label="Role Name"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })) }}
          error={!!errors.name}
          helperText={errors.name || 'e.g., Field Operator, Senior Technician'}
          required
          autoFocus
          fullWidth
        />
        <TextField
          label="Pay Grade Level"
          type="number"
          value={level}
          onChange={(e) => { setLevel(e.target.value); setErrors((p) => ({ ...p, level: undefined })) }}
          error={!!errors.level}
          helperText={errors.level || 'Higher number = higher pay grade. Used for step-up role filtering.'}
          required
          fullWidth
          inputProps={{ min: 1 }}
        />
      </Stack>
    </FormDialog>
  )
}

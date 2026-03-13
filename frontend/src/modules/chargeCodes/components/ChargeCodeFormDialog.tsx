import { useEffect, useState } from 'react'
import { TextField, Stack } from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import type { ChargeCode } from '../types'

interface ChargeCodeFormDialogProps {
  open: boolean
  chargeCode?: ChargeCode | null
  onClose: () => void
  onSubmit: (data: { code: string; description: string }) => void
  loading?: boolean
}

export function ChargeCodeFormDialog({
  open,
  chargeCode,
  onClose,
  onSubmit,
  loading = false,
}: ChargeCodeFormDialogProps) {
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ code?: string; description?: string }>({})

  useEffect(() => {
    if (open) {
      setCode(chargeCode?.code ?? '')
      setDescription(chargeCode?.description ?? '')
      setErrors({})
    }
  }, [open, chargeCode])

  const validate = () => {
    const next: typeof errors = {}
    if (!code.trim()) next.code = 'Code is required'
    if (!description.trim()) next.description = 'Description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ code: code.trim().toUpperCase(), description: description.trim() })
  }

  return (
    <FormDialog
      open={open}
      title={chargeCode ? 'Edit Charge Code' : 'Add Charge Code'}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={chargeCode ? 'Save Changes' : 'Add Charge Code'}
    >
      <Stack spacing={2.5}>
        <TextField
          label="Code"
          value={code}
          onChange={(e) => { setCode(e.target.value); setErrors((p) => ({ ...p, code: undefined })) }}
          error={!!errors.code}
          helperText={errors.code || 'e.g., CC-1001, PROJ-42'}
          required
          autoFocus
          fullWidth
          inputProps={{ style: { fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' } }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })) }}
          error={!!errors.description}
          helperText={errors.description || 'Brief description of the billing code or project'}
          required
          multiline
          rows={3}
          fullWidth
        />
      </Stack>
    </FormDialog>
  )
}

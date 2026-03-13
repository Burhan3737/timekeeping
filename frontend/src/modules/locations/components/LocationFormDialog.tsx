import { useEffect, useState } from 'react'
import { TextField, Stack } from '@mui/material'
import { FormDialog } from '@shared/components/FormDialog'
import type { Location } from '../types'

interface LocationFormDialogProps {
  open: boolean
  location?: Location | null   // null = create mode, Location = edit mode
  onClose: () => void
  onSubmit: (data: { name: string; description: string }) => void
  loading?: boolean
}

export function LocationFormDialog({
  open,
  location,
  onClose,
  onSubmit,
  loading = false,
}: LocationFormDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')

  // Pre-populate on edit
  useEffect(() => {
    if (open) {
      setName(location?.name ?? '')
      setDescription(location?.description ?? '')
      setNameError('')
    }
  }, [open, location])

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Name is required')
      return
    }
    onSubmit({ name: name.trim(), description: description.trim() })
  }

  return (
    <FormDialog
      open={open}
      title={location ? 'Edit Location' : 'Add Location'}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={location ? 'Save Changes' : 'Add Location'}
    >
      <Stack spacing={2.5}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError('') }}
          error={!!nameError}
          helperText={nameError || 'e.g., Site Alpha, North Yard'}
          required
          autoFocus
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText="Optional — brief description of the site"
          multiline
          rows={3}
          fullWidth
        />
      </Stack>
    </FormDialog>
  )
}

import { ReactNode } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface FormDialogProps {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: () => void
  loading?: boolean
  submitLabel?: string
  cancelLabel?: string
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function FormDialog({
  open,
  title,
  onClose,
  onSubmit,
  loading = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  maxWidth = 'sm',
  children,
}: FormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} disabled={loading} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        {children}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

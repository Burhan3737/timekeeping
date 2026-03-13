import { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Divider, Chip, TextField, Stack, CircularProgress,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { CHARGE_CODE_MAP, STEP_UP_ROLE_MAP } from '../mockData'
import type { OvertimeRequestWithUser } from '../types'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

interface ReviewDialogProps {
  open: boolean
  request: OvertimeRequestWithUser | null
  onClose: () => void
  onApprove: (id: string, notes?: string) => void
  onReject: (id: string, notes: string) => void
  loading?: boolean
}

export function ReviewDialog({ open, request, onClose, onApprove, onReject, loading = false }: ReviewDialogProps) {
  const [notes, setNotes] = useState('')
  const [notesError, setNotesError] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  useEffect(() => {
    if (open) { setNotes(''); setNotesError(''); setAction(null) }
  }, [open])

  if (!request) return null

  const handleApprove = () => {
    setAction('approve')
    onApprove(request.id, notes || undefined)
  }

  const handleReject = () => {
    if (!notes.trim()) { setNotesError('A reason is required when rejecting'); return }
    setAction('reject')
    onReject(request.id, notes.trim())
  }

  const isRequested = request.status === 'REQUESTED'

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Overtime Request</Typography>
        <Typography variant="body2" color="text.secondary">Review details before approving or rejecting</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          {/* Employee */}
          <Box sx={{ display: 'flex', gap: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                <PersonIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{request.userName}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{request.userJobRole}</Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <LocationOnIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{request.userLocationName}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Request details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>DATE</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
                {request.date}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>START TIME</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
                {request.startTime}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>DURATION</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatDuration(request.estimatedDurationMinutes)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>CHARGE CODE</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'primary.main' }}>
                {CHARGE_CODE_MAP[request.chargeCodeId] ?? request.chargeCodeId}
              </Typography>
            </Box>
          </Box>

          {request.stepUpRoleId && (
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>STEP-UP ROLE</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip size="small" label={STEP_UP_ROLE_MAP[request.stepUpRoleId] ?? request.stepUpRoleId} color="error" variant="outlined" />
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>REASON</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
              "{request.reason}"
            </Typography>
          </Box>

          {/* Prior review notes */}
          {request.reviewNotes && (
            <Box sx={{ p: 1.5, bgcolor: 'error.light', borderRadius: 1, opacity: 0.85 }}>
              <Typography variant="caption" color="error.dark" sx={{ fontWeight: 600 }}>PRIOR REVIEW NOTES</Typography>
              <Typography variant="body2" color="error.dark" sx={{ mt: 0.25 }}>{request.reviewNotes}</Typography>
            </Box>
          )}

          {isRequested && (
            <>
              <Divider />
              <TextField
                label="Supervisor Notes"
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setNotesError('') }}
                multiline rows={2} fullWidth
                placeholder="Add notes (required for rejection)…"
                error={!!notesError}
                helperText={notesError || 'Required when rejecting · Optional when approving'}
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          {isRequested ? 'Cancel' : 'Close'}
        </Button>
        {isRequested && (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={loading && action === 'reject' ? <CircularProgress size={16} color="inherit" /> : <CancelIcon />}
              onClick={handleReject}
              disabled={loading}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading && action === 'approve' ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
              onClick={handleApprove}
              disabled={loading}
            >
              Approve
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

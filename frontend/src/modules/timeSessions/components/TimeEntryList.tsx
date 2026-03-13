import { Box, Typography, IconButton, Tooltip, Chip, Stack, Paper } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { useTheme } from '@mui/material/styles'
import { MOCK_CHARGE_CODES_REF, STEP_UP_ROLES_REF } from '../mockData'
import type { TimeEntry, TimeSessionStatus } from '../types'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

interface TimeEntryListProps {
  entries: TimeEntry[]
  status: TimeSessionStatus
  onEdit: (entry: TimeEntry) => void
  onDelete: (entry: TimeEntry) => void
}

export function TimeEntryList({ entries, status, onEdit, onDelete }: TimeEntryListProps) {
  const theme = useTheme()
  const isDraft = status === 'DRAFT'

  const entryColor = (entry: TimeEntry) => {
    if (entry.isOvertime) return theme.palette.warning.main
    if (entry.stepUpRoleId) return theme.palette.error.main
    return theme.palette.primary.main
  }

  if (entries.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <ScheduleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
        <Typography variant="body2" color="text.disabled">
          No time entries yet. Add your first entry to get started.
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack spacing={1}>
      {entries.map((entry) => {
        const chargeCode = MOCK_CHARGE_CODES_REF.find((c) => c.id === entry.chargeCodeId)
        const stepUpRole = STEP_UP_ROLES_REF.find((r) => r.id === entry.stepUpRoleId)
        const color = entryColor(entry)

        return (
          <Paper
            key={entry.id}
            variant="outlined"
            sx={{
              display: 'grid',
              gridTemplateColumns: '4px 1fr auto',
              overflow: 'hidden',
              transition: 'box-shadow 0.15s',
              '&:hover': { boxShadow: 2 },
            }}
          >
            {/* Color accent bar */}
            <Box sx={{ bgcolor: color }} />

            {/* Entry content */}
            <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {/* Time */}
              <Typography
                variant="body2"
                sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, minWidth: 110 }}
              >
                {entry.startTime} – {entry.endTime}
              </Typography>

              {/* Duration */}
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 50 }}>
                {formatDuration(entry.durationMinutes)}
              </Typography>

              {/* Charge code */}
              <Chip
                label={chargeCode?.code ?? entry.chargeCodeId}
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '0.7rem' }}
              />

              {/* Step-up badge */}
              {stepUpRole && (
                <Chip
                  icon={<WifiProtectedSetupIcon sx={{ fontSize: '14px !important' }} />}
                  label={stepUpRole.name}
                  size="small"
                  sx={{ bgcolor: `${theme.palette.error.main}14`, color: 'error.main', fontWeight: 600 }}
                />
              )}

              {/* Overtime badge */}
              {entry.isOvertime && (
                <Chip
                  label="OT"
                  size="small"
                  sx={{ bgcolor: `${theme.palette.warning.main}14`, color: 'warning.dark', fontWeight: 700, fontSize: '0.65rem' }}
                />
              )}

              {/* Notes */}
              {entry.notes && (
                <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                  {entry.notes}
                </Typography>
              )}
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, gap: 0.5 }}>
              {isDraft && (
                <>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(entry)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => onDelete(entry)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Paper>
        )
      })}
    </Stack>
  )
}

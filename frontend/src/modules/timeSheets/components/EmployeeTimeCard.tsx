import { useState } from 'react'
import {
  Box, Card, CardContent, CardActions, Button, Typography, Collapse,
  Divider, IconButton, Tooltip, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WorkIcon from '@mui/icons-material/Work'
import { StatusBadge } from '@shared/components/StatusBadge'
import { TimeGrid24hr } from '@shared/components/TimeGrid24hr'
import type { TimeSegment } from '@shared/components/TimeGrid24hr'
import { CHARGE_CODE_MAP, STEP_UP_ROLE_MAP } from '../mockData'
import type { SessionWithDetail, TimeEntryDetail } from '../types'

function entriesToSegments(entries: TimeEntryDetail[]): TimeSegment[] {
  return entries.map((e) => ({
    id: e.id,
    startTime: e.startTime,
    endTime: e.endTime,
    label: CHARGE_CODE_MAP[e.chargeCodeId] ?? e.chargeCodeId,
    type: e.isOvertime ? 'overtime' : e.stepUpRoleId ? 'stepup' : 'normal',
    tooltip: `${e.startTime}–${e.endTime} · ${CHARGE_CODE_MAP[e.chargeCodeId] ?? e.chargeCodeId}${e.stepUpRoleId ? ` · ${STEP_UP_ROLE_MAP[e.stepUpRoleId]}` : ''}`,
  }))
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

interface EmployeeTimeCardProps {
  session: SessionWithDetail
  onApprove: (sessionId: string) => void
  onReject: (sessionId: string) => void
  onEditEntry: (entry: TimeEntryDetail) => void
  readOnly?: boolean
}

export function EmployeeTimeCard({ session, onApprove, onReject, onEditEntry, readOnly = false }: EmployeeTimeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isSubmitted = session.status === 'SUBMITTED'
  const segments = entriesToSegments(session.entries)
  const overtimeEntries = session.entries.filter((e) => e.isOvertime)
  const stepUpEntries = session.entries.filter((e) => e.stepUpRoleId)

  return (
    <Card variant="outlined" sx={{ mb: 2, borderColor: isSubmitted ? 'warning.main' : 'divider', borderWidth: isSubmitted ? 1.5 : 1 }}>
      <CardContent sx={{ pb: 1 }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {session.user.name}
              </Typography>
              <StatusBadge status={session.status} />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WorkIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{session.user.jobRole}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{session.user.locationName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{session.entryCount} entries</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: session.totalHours > 8 ? 'warning.main' : 'text.primary' }}>
              {session.totalHours}h
            </Typography>
            {overtimeEntries.length > 0 && (
              <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                {overtimeEntries.length} OT {overtimeEntries.length === 1 ? 'entry' : 'entries'}
              </Typography>
            )}
            {stepUpEntries.length > 0 && (
              <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                {stepUpEntries.length} step-up
              </Typography>
            )}
          </Box>
        </Box>

        {/* 24hr grid */}
        <TimeGrid24hr segments={segments} showLegend={false} height={28} />

        {/* Reviewed by */}
        {session.reviewedBy && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.75, display: 'block' }}>
            Reviewed by {session.reviewedBy}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 1.5, pt: 0, justifyContent: 'space-between' }}>
        <Button
          size="small"
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Hide' : 'View'} entries
        </Button>

        {isSubmitted && !readOnly && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => onReject(session.id)}
            >
              Reject
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => onApprove(session.id)}
            >
              Approve
            </Button>
          </Box>
        )}
      </CardActions>

      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Charge Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Step-Up Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Flags</TableCell>
                {isSubmitted && !readOnly && <TableCell sx={{ fontWeight: 700 }} align="right">Edit</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {session.entries.map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                    {entry.startTime} – {entry.endTime}
                  </TableCell>
                  <TableCell>{formatDuration(entry.durationMinutes)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'primary.main' }}>
                      {CHARGE_CODE_MAP[entry.chargeCodeId] ?? entry.chargeCodeId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {entry.stepUpRoleId
                      ? <Typography variant="body2" color="error.main">{STEP_UP_ROLE_MAP[entry.stepUpRoleId]}</Typography>
                      : <Typography variant="body2" color="text.disabled">—</Typography>
                    }
                  </TableCell>
                  <TableCell>
                    {entry.isOvertime && (
                      <Typography variant="caption" sx={{ bgcolor: 'warning.main', color: 'warning.contrastText', px: 0.75, py: 0.2, borderRadius: 0.5, fontWeight: 700 }}>
                        OT
                      </Typography>
                    )}
                  </TableCell>
                  {isSubmitted && !readOnly && (
                    <TableCell align="right">
                      <Tooltip title="Edit entry">
                        <IconButton size="small" onClick={() => onEditEntry(entry)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </Card>
  )
}

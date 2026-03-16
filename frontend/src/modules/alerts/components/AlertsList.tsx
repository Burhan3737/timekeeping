import {
  Box, Button, Typography, Card, CardActionArea, Chip, FormControl,
  InputLabel, Select, MenuItem,
} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import RateReviewIcon from '@mui/icons-material/RateReview'
import CancelIcon from '@mui/icons-material/Cancel'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { ALERT_TYPE_LABELS } from '../mockData'
import type { Alert, AlertType } from '../types'

function alertIcon(type: AlertType) {
  switch (type) {
    case 'OVERTIME_DAILY':  return <WarningAmberIcon sx={{ color: 'warning.main' }} />
    case 'OVERTIME_WEEKLY': return <AccessAlarmIcon sx={{ color: 'error.main' }} />
    case 'MISSING_TIME':    return <PersonOffIcon sx={{ color: 'info.main' }} />
    case 'PENDING_APPROVAL': return <RateReviewIcon sx={{ color: 'primary.main' }} />
    case 'ENTRY_REJECTED':  return <CancelIcon sx={{ color: 'error.main' }} />
  }
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface AlertsListProps {
  alerts: Alert[]
  typeFilter: AlertType | ''
  readFilter: 'all' | 'unread' | 'read'
  onTypeFilterChange: (v: AlertType | '') => void
  onReadFilterChange: (v: 'all' | 'unread' | 'read') => void
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

export function AlertsList({
  alerts, typeFilter, readFilter,
  onTypeFilterChange, onReadFilterChange,
  onMarkRead, onMarkAllRead,
}: AlertsListProps) {
  const unreadCount = alerts.filter((a) => !a.isRead).length

  const filtered = alerts.filter((a) => {
    if (typeFilter && a.type !== typeFilter) return false
    if (readFilter === 'unread' && a.isRead) return false
    if (readFilter === 'read' && !a.isRead) return false
    return true
  })

  return (
    <Box>
      {/* Filter row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Alert Type</InputLabel>
          <Select value={typeFilter} label="Alert Type" onChange={(e) => onTypeFilterChange(e.target.value as AlertType | '')}>
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(ALERT_TYPE_LABELS).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select value={readFilter} label="Status" onChange={(e) => onReadFilterChange(e.target.value as 'all' | 'unread' | 'read')}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
          </Select>
        </FormControl>
        {unreadCount > 0 && (
          <Button size="small" variant="outlined" startIcon={<DoneAllIcon />} onClick={onMarkAllRead} sx={{ ml: 'auto' }}>
            Mark All Read ({unreadCount})
          </Button>
        )}
      </Box>

      {/* Alerts list */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
          <Typography variant="body1">No alerts match the current filter.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.map((alert) => (
            <Card
              key={alert.id}
              variant="outlined"
              sx={{
                borderColor: alert.isRead ? 'divider' : 'primary.main',
                borderWidth: alert.isRead ? 1 : 1.5,
                bgcolor: alert.isRead ? 'transparent' : 'action.hover',
                transition: 'all 0.2s ease',
              }}
            >
              <CardActionArea
                onClick={() => !alert.isRead && onMarkRead(alert.id)}
                sx={{ p: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 2 }}
              >
                {/* Unread dot + icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pt: 0.25 }}>
                  {!alert.isRead && (
                    <FiberManualRecordIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                  )}
                  {alertIcon(alert.type)}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label={ALERT_TYPE_LABELS[alert.type]} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                    <Typography variant="caption" color="text.disabled">
                      {timeAgo(alert.createdAt)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: alert.isRead ? 400 : 600, color: alert.isRead ? 'text.secondary' : 'text.primary' }}
                  >
                    {alert.message}
                  </Typography>
                  {alert.relatedUserName && (
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: 'block' }}>
                      {alert.type === 'ENTRY_REJECTED' ? `Reviewed by ${alert.relatedUserName}` : alert.relatedUserName}
                    </Typography>
                  )}
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

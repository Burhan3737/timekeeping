import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, Chip, Stack, Divider,
  TextField, Button, Avatar, Alert,
} from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import EmailIcon from '@mui/icons-material/Email'
import WorkIcon from '@mui/icons-material/Work'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LockIcon from '@mui/icons-material/Lock'
import { PageHeader } from '@shared/components/PageHeader'
import { StatusBadge } from '@shared/components/StatusBadge'
import { MOCK_USERS, MOCK_LOCATIONS, MOCK_JOB_ROLES } from '../mockData'
import { SYSTEM_ROLE_LABELS } from '../types'

// Mock current user — first user in mock data
const CURRENT_USER = MOCK_USERS[0]

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5 }}>
      <Box sx={{ color: 'text.disabled', mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </Typography>
        <Box sx={{ mt: 0.25 }}>{children}</Box>
      </Box>
    </Box>
  )
}

export function UserProfilePage() {
  const user = CURRENT_USER
  const jobRole = MOCK_JOB_ROLES.find((jr) => jr.id === user.jobRoleId)
  const locations = MOCK_LOCATIONS.filter((l) => user.locationIds.includes(l.id))
  const initials = `${user.firstName[0]}${user.lastName[0]}`

  // PIN update state
  const [newPin, setNewPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinSuccess, setPinSuccess] = useState(false)

  const handlePinUpdate = () => {
    if (!/^\d{4,6}$/.test(newPin)) {
      setPinError('PIN must be 4–6 digits')
      return
    }
    // View layer only — no API call
    setPinSuccess(true)
    setNewPin('')
    setPinError('')
    setTimeout(() => setPinSuccess(false), 3000)
  }

  return (
    <>
      <PageHeader title="My Profile" subtitle="View your account details and update your PIN" />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, maxWidth: 900 }}>
        {/* Profile card */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            {/* Avatar + name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 64, height: 64,
                  bgcolor: 'primary.main',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
              </Box>
            </Box>

            <Divider sx={{ mb: 1 }} />

            <InfoRow icon={<EmailIcon fontSize="small" />} label="Email">
              <Typography variant="body2">{user.email}</Typography>
            </InfoRow>

            <Divider />

            <InfoRow icon={<BadgeIcon fontSize="small" />} label="System Role">
              <Typography variant="body2">{SYSTEM_ROLE_LABELS[user.systemRole]}</Typography>
            </InfoRow>

            <Divider />

            <InfoRow icon={<WorkIcon fontSize="small" />} label="Job Role">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{jobRole?.name ?? '—'}</Typography>
                {jobRole && (
                  <Chip
                    label={`Level ${jobRole.level}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </InfoRow>

            <Divider />

            <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Assigned Locations">
              <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 0.5 }}>
                {locations.map((l) => (
                  <Chip key={l.id} label={l.name} size="small" variant="outlined" />
                ))}
              </Stack>
            </InfoRow>
          </CardContent>
        </Card>

        {/* PIN update card */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <LockIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Update PIN
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your PIN is used to log in to Field Mode. Choose a 4–6 digit number that's easy to remember but hard to guess.
            </Typography>

            {pinSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                PIN updated successfully.
              </Alert>
            )}

            <Stack spacing={2}>
              <TextField
                label="New PIN"
                type="password"
                value={newPin}
                onChange={(e) => {
                  setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                  setPinError('')
                  setPinSuccess(false)
                }}
                error={!!pinError}
                helperText={pinError || '4–6 digits'}
                inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handlePinUpdate}
                disabled={!newPin}
                sx={{ alignSelf: 'flex-start' }}
              >
                Update PIN
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

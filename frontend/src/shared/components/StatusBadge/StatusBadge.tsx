import { Chip } from '@mui/material'

type BadgeColor = 'success' | 'warning' | 'error' | 'info' | 'default'

const DEFAULT_COLOR_MAP: Record<string, BadgeColor> = {
  APPROVED: 'success',
  ACTIVE: 'success',
  PENDING: 'warning',
  REQUESTED: 'warning',
  SUBMITTED: 'info',
  DRAFT: 'default',
  REJECTED: 'error',
  CANCELLED: 'default',
  INACTIVE: 'default',
}

function formatLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

interface StatusBadgeProps {
  status: string
  colorMap?: Record<string, BadgeColor>
  size?: 'small' | 'medium'
}

export function StatusBadge({ status, colorMap, size = 'small' }: StatusBadgeProps) {
  const map = colorMap ?? DEFAULT_COLOR_MAP
  const color = map[status] ?? 'default'

  return (
    <Chip
      label={formatLabel(status)}
      color={color}
      size={size}
      variant="filled"
      sx={{ fontWeight: 600, letterSpacing: '0.02em' }}
    />
  )
}

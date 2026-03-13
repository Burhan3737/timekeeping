import { ReactNode } from 'react'
import { Card, CardActionArea, CardContent, Box, Typography } from '@mui/material'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  color?: string
  subtitle?: string
  onClick?: () => void
}

function StatCardContent({ icon, label, value, color = 'primary.main', subtitle }: Omit<StatCardProps, 'onClick'>) {
  return (
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: `${color}14`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.25 }}>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  )
}

export function StatCard({ onClick, ...props }: StatCardProps) {
  if (onClick) {
    return (
      <Card>
        <CardActionArea onClick={onClick}>
          <StatCardContent {...props} />
        </CardActionArea>
      </Card>
    )
  }

  return (
    <Card>
      <StatCardContent {...props} />
    </Card>
  )
}

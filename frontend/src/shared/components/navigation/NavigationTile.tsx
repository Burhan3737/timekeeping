import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardActionArea, CardContent, Typography, Box, alpha } from '@mui/material'

interface NavigationTileProps {
  icon: ReactNode
  title: string
  description: string
  to: string
  color?: string
}

export function NavigationTile({ icon, title, description, to, color = 'primary.main' }: NavigationTileProps) {
  const navigate = useNavigate()

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: color,
          transition: 'height 0.25s ease',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
          '&::before': {
            height: 5,
          },
        },
      }}
    >
      <CardActionArea onClick={() => navigate(to)} sx={{ height: '100%', textAlign: 'center', p: 1 }}>
        <CardContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: 3,
              mb: 2,
              color,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }}
          >
            {icon}
          </Box>
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

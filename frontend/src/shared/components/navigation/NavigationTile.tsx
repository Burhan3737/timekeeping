import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'

interface NavigationTileProps {
  icon: ReactNode
  title: string
  description: string
  to: string
  color?: string
}

export function NavigationTile({ icon, title, description, to, color }: NavigationTileProps) {
  const navigate = useNavigate()

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(to)}
        sx={{ height: '100%', textAlign: 'center', p: 2 }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              color: color || 'primary.main',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="h3" gutterBottom>
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

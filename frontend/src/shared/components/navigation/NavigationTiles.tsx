import { Box, Typography } from '@mui/material'
import { NavigationTile } from './NavigationTile'
import { navigationConfig } from '@core/routing/navigationConfig'

interface NavigationTilesProps {
  onNavigate?: () => void
}

export function NavigationTiles({ onNavigate }: NavigationTilesProps = {}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {navigationConfig.map((section) => (
        <Box key={section.title}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 2,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'text.secondary',
            }}
          >
            {section.title}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {section.items.map((item) => (
              <NavigationTile
                key={item.path}
                icon={<item.icon sx={{ fontSize: 40 }} />}
                title={item.label}
                description={item.description}
                to={item.path}
                color={item.color}
                onNavigate={onNavigate}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

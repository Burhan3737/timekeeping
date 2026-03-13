import { Box } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { NavigationTile } from './NavigationTile'

const navigationItems = [
  {
    icon: <DashboardIcon sx={{ fontSize: 48 }} />,
    title: 'Dashboard',
    description: 'View your timekeeping overview and quick stats',
    to: '/',
    color: 'primary',
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 48 }} />,
    title: 'Time Entries',
    description: 'Log and manage your work hours efficiently',
    to: '/time-entries',
    color: 'secondary',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
    title: 'Reports',
    description: 'Generate detailed reports and insights',
    to: '/reports',
    color: 'info',
  },
]

export function NavigationTiles() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
      }}
    >
      {navigationItems.map((item) => (
        <NavigationTile key={item.title} {...item} />
      ))}
    </Box>
  )
}

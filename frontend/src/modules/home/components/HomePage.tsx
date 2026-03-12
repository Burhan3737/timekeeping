import { Typography, Box, Paper } from '@mui/material'
import { useNavigationMode } from '@core/state/appStore'

export function HomePage() {
  const navigationMode = useNavigationMode()
  const isSidebarMode = navigationMode === 'sidebar'

  // In tiles mode, the homepage content is shown in MainLayout
  // In sidebar mode, we show the dashboard content here
  if (!isSidebarMode) {
    return null
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your timekeeping dashboard. Track and manage your work hours efficiently.
      </Typography>

      <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Dashboard Content Coming Soon
        </Typography>
        <Typography variant="body2">
          Use the sidebar navigation to access Time Entries and Reports
        </Typography>
      </Paper>
    </Box>
  )
}

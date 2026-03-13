import { Typography, Box, Paper, Card, CardContent, Stack, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useNavigationMode } from '@core/state/appStore'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BarChartIcon from '@mui/icons-material/BarChart'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

export function HomePage() {
  const navigationMode = useNavigationMode()
  const navigate = useNavigate()
  const isSidebarMode = navigationMode === 'sidebar'

  // Quick stats data
  const stats = [
    {
      icon: AccessTimeIcon,
      label: "Today's Hours",
      value: '6h 42m',
      color: 'time.running',
      trend: '+12% vs yesterday',
    },
    {
      icon: ScheduleIcon,
      label: 'This Week',
      value: '32h 15m',
      color: 'primary.main',
      trend: 'On track',
    },
    {
      icon: BarChartIcon,
      label: 'Active Projects',
      value: '5',
      color: 'time.complete',
      trend: '3 due this week',
    },
  ]

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Hero Section - Different for tile vs sidebar mode */}
      {!isSidebarMode ? (
        // Tile Mode: Full Landing Experience
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Timekeeping
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Track your time with precision and elegance
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => navigate('/time-entries')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Start Tracking
          </Button>
        </Box>
      ) : (
        // Sidebar Mode: Compact Header
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 1,
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's your timekeeping overview.
          </Typography>
        </Box>
      )}

      {/* Stats Cards */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ mb: isSidebarMode ? 4 : 6 }}
      >
        {stats.map((stat) => (
          <Card
            key={stat.label}
            elevation={3}
            sx={{
              flex: 1,
              minWidth: 200,
              cursor: isSidebarMode ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': isSidebarMode
                ? {}
                : {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
            }}
            onClick={() =>
              !isSidebarMode && stat.label === "Today's Hours"
                ? navigate('/time-entries')
                : !isSidebarMode && stat.label === 'Active Projects'
                  ? navigate('/reports')
                  : undefined
            }
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: stat.color,
                    color: 'white',
                  }}
                >
                  <stat.icon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: 'fontFamilyMono',
                      fontWeight: 600,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.trend}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Quick Actions or Additional Content */}
      {isSidebarMode && (
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => navigate('/time-entries')}
            >
              Start Timer
            </Button>
            <Button
              variant="outlined"
              startIcon={<BarChartIcon />}
              onClick={() => navigate('/reports')}
            >
              View Reports
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Current Time Display */}
      <Box
        sx={{
          mt: isSidebarMode ? 4 : 6,
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: 'chronos.mist',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'fontFamilyMono',
            color: 'text.secondary',
            display: 'block',
            mb: 1,
            letterSpacing: '0.1em',
          }}
        >
          CURRENT TIME
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'fontFamilyMono',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'primary.main',
          }}
        >
          {new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>
      </Box>
    </Box>
  )
}

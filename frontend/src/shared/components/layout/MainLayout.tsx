import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'
import GridViewIcon from '@mui/icons-material/GridView'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import HomeIcon from '@mui/icons-material/Home'
import { Sidebar } from '@shared/components/navigation/Sidebar'
import {
  useNavigationMode,
  useTheme,
  useAppActions,
} from '@core/state/appStore'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigationMode = useNavigationMode()
  const currentTheme = useTheme()
  const { toggleNavigationMode, toggleTheme } = useAppActions()
  const isSidebarMode = navigationMode === 'sidebar'
  const isLight = currentTheme === 'light'
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                flexShrink: 0,
              }}
            >
              <ScheduleIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              Chronos
            </Typography>
            {!isSidebarMode && location.pathname !== '/' && (
              <Tooltip title="Go to Home">
                <IconButton onClick={() => navigate('/')} color="primary" size="small">
                  <HomeIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              <IconButton
                onClick={toggleTheme}
                color="primary"
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  px: 1.5,
                }}
              >
                {isLight ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                isSidebarMode ? 'Switch to Tile View' : 'Switch to Sidebar View'
              }
            >
              <IconButton
                onClick={toggleNavigationMode}
                color="primary"
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  px: 1.5,
                }}
              >
                {isSidebarMode ? <GridViewIcon /> : <ViewSidebarIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar (only in sidebar mode) */}
      {isSidebarMode && <Sidebar />}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          pt: 8,
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Box sx={{ flex: 1, p: 3, maxWidth: 1200, mx: 'auto', width: '100%' }}>
          {children}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.875rem',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          © {new Date().getFullYear()} Timekeeping App. All rights reserved.
        </Box>
      </Box>
    </Box>
  )
}

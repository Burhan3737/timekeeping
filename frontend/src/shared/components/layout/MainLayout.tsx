import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'
import GridViewIcon from '@mui/icons-material/GridView'
import { Sidebar } from '@shared/components/navigation/Sidebar'
import { NavigationTiles } from '@shared/components/navigation/NavigationTiles'
import { useNavigationMode, useAppActions } from '@core/state/appStore'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigationMode = useNavigationMode()
  const { toggleNavigationMode } = useAppActions()
  const isSidebarMode = navigationMode === 'sidebar'

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 600,
              }}
            >
              Timekeeping
            </Typography>
          </Box>

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
          {/* Show NavigationTiles as homepage content when in tiles mode */}
          {!isSidebarMode && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Timekeeping
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Track your time efficiently and generate insightful reports
              </Typography>
              <NavigationTiles />
            </Box>
          )}
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

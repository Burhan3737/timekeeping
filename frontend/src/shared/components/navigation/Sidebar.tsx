import { Link, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useSidebarCollapsed, useAppActions } from '@core/state/appStore'
import { navigationConfig } from '@core/routing/navigationConfig'

const drawerWidth = 248
const collapsedWidth = 64

export function Sidebar() {
  const collapsed = useSidebarCollapsed()
  const { toggleSidebar } = useAppActions()
  const location = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          overflowX: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* AppBar spacer */}
        <Box sx={{ minHeight: 64 }} />

        {/* Collapse toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            px: 1,
            py: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton onClick={toggleSidebar} size="small">
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>

        {/* Navigation sections */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
          {navigationConfig.map((section, sectionIndex) => (
            <Box key={section.title}>
              {sectionIndex > 0 && <Divider sx={{ my: 1 }} />}

              {!collapsed && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 3,
                    py: 0.5,
                    display: 'block',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.disabled',
                    fontSize: '0.65rem',
                  }}
                >
                  {section.title}
                </Typography>
              )}

              <List disablePadding>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path

                  const button = (
                    <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        selected={isActive}
                        sx={{
                          minHeight: 40,
                          justifyContent: collapsed ? 'center' : 'initial',
                          px: collapsed ? 0 : 2,
                          mx: collapsed ? 0 : 1,
                          borderRadius: collapsed ? 0 : 1.5,
                          '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': { bgcolor: 'primary.dark' },
                          },
                          '&:hover': {
                            bgcolor: isActive ? 'primary.dark' : 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: collapsed ? 0 : 1.5,
                            justifyContent: 'center',
                            color: isActive ? 'primary.contrastText' : 'text.secondary',
                          }}
                        >
                          <Icon sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        {!collapsed && (
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: '0.85rem',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? 'primary.contrastText' : 'text.primary',
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  )

                  return collapsed ? (
                    <Tooltip key={item.label} title={item.label} placement="right">
                      {button}
                    </Tooltip>
                  ) : (
                    button
                  )
                })}
              </List>
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  )
}

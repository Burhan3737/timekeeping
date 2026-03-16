import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { PageHeader } from '@shared/components/PageHeader'
import { AlertsList } from './AlertsList'
import { AlertConfigPanel } from './AlertConfigPanel'
import { MOCK_ALERTS, MOCK_ALERT_CONFIGS } from '../mockData'
import type { Alert, AlertConfig, AlertType } from '../types'

export function AlertsPage() {
  const [tab, setTab] = useState(0)
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS)
  const [configs, setConfigs] = useState<AlertConfig[]>(MOCK_ALERT_CONFIGS)
  const [typeFilter, setTypeFilter] = useState<AlertType | ''>('')
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all')

  const unreadCount = alerts.filter((a) => !a.isRead).length

  const handleMarkRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isRead: true } : a))
  }

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })))
  }

  const handleToggleConfig = (id: string, enabled: boolean) => {
    setConfigs((prev) => prev.map((c) => c.id === id ? { ...c, enabled, updatedAt: new Date().toISOString() } : c))
  }

  const handleUpdateConfig = (id: string, data: Partial<AlertConfig>) => {
    setConfigs((prev) => prev.map((c) => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
  }

  return (
    <>
      <PageHeader
        title="Alerts"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                Notifications
                {unreadCount > 0 && (
                  <Box
                    component="span"
                    sx={{
                      bgcolor: 'error.main', color: 'error.contrastText',
                      borderRadius: '10px', px: 0.75, py: 0.1,
                      fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.6,
                    }}
                  >
                    {unreadCount}
                  </Box>
                )}
              </Box>
            }
          />
          <Tab label="Configuration" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <AlertsList
          alerts={alerts}
          typeFilter={typeFilter}
          readFilter={readFilter}
          onTypeFilterChange={setTypeFilter}
          onReadFilterChange={setReadFilter}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      )}

      {tab === 1 && (
        <AlertConfigPanel
          configs={configs}
          onToggle={handleToggleConfig}
          onUpdate={handleUpdateConfig}
        />
      )}
    </>
  )
}

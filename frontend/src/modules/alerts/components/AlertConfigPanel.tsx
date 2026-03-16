import { useState, useEffect } from 'react'
import {
  Box, Switch, Typography, TextField, Stack, Chip,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput,
} from '@mui/material'
import { DataTable } from '@shared/components/DataTable'
import { FormDialog } from '@shared/components/FormDialog'
import { ALERT_TYPE_LABELS } from '../mockData'
import type { AlertConfig } from '../types'

const ROLE_OPTIONS = ['SUPERVISOR', 'ADMIN', 'FIELD_WORKER', 'DATA_ENTRY_CLERK']

interface AlertConfigPanelProps {
  configs: AlertConfig[]
  onToggle: (id: string, enabled: boolean) => void
  onUpdate: (id: string, data: Partial<AlertConfig>) => void
}

export function AlertConfigPanel({ configs, onToggle, onUpdate }: AlertConfigPanelProps) {
  const [editTarget, setEditTarget] = useState<AlertConfig | null>(null)
  const [threshold, setThreshold] = useState('')
  const [recipients, setRecipients] = useState<string[]>([])

  useEffect(() => {
    if (editTarget) {
      setThreshold(editTarget.threshold?.toString() ?? '')
      setRecipients(editTarget.recipients)
    }
  }, [editTarget])

  const handleSave = () => {
    if (!editTarget) return
    onUpdate(editTarget.id, {
      threshold: threshold ? Number(threshold) : null,
      recipients,
    })
    setEditTarget(null)
  }

  const columns = [
    {
      id: 'type',
      label: 'Alert Type',
      sortable: true,
      render: (row: AlertConfig) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {ALERT_TYPE_LABELS[row.type] ?? row.type}
        </Typography>
      ),
    },
    {
      id: 'enabled',
      label: 'Enabled',
      sortable: false,
      render: (row: AlertConfig) => (
        <Switch
          checked={row.enabled}
          size="small"
          onChange={(e) => onToggle(row.id, e.target.checked)}
          color="primary"
        />
      ),
    },
    {
      id: 'threshold',
      label: 'Threshold',
      sortable: false,
      render: (row: AlertConfig) => (
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono, monospace', color: row.threshold ? 'text.primary' : 'text.disabled' }}>
          {row.threshold !== null ? `${row.threshold}h` : '—'}
        </Typography>
      ),
    },
    {
      id: 'recipients',
      label: 'Recipients',
      sortable: false,
      render: (row: AlertConfig) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.recipients.map((r) => (
            <Chip key={r} label={r} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
          ))}
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure alert rules, thresholds, and which roles receive each alert type. Click a row to edit.
      </Typography>

      <DataTable<AlertConfig>
        columns={columns}
        rows={configs}
        emptyMessage="No alert configurations found."
        onRowClick={setEditTarget}
      />

      <FormDialog
        open={!!editTarget}
        title={`Edit — ${editTarget ? ALERT_TYPE_LABELS[editTarget.type] : ''}`}
        onClose={() => setEditTarget(null)}
        onSubmit={handleSave}
        submitLabel="Save"
      >
        <Stack spacing={2.5}>
          <TextField
            label="Threshold (hours)"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: 1 }}
            helperText={threshold ? `Alert triggers when hours exceed ${threshold}` : 'No threshold — event-driven alert'}
          />
          <FormControl fullWidth>
            <InputLabel>Recipients</InputLabel>
            <Select
              multiple
              value={recipients}
              onChange={(e) => setRecipients(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={<OutlinedInput label="Recipients" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {selected.map((v) => <Chip key={v} label={v} size="small" />)}
                </Box>
              )}
            >
              {ROLE_OPTIONS.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </FormDialog>
    </Box>
  )
}

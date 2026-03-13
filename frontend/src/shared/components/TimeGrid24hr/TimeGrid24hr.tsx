import { useState } from 'react'
import { Box, Typography, Tooltip, useTheme } from '@mui/material'

export interface TimeSegment {
  id: string
  startTime: string   // HH:mm
  endTime: string     // HH:mm
  label?: string
  type: 'normal' | 'stepup' | 'overtime'
  tooltip?: string
}

interface TimeGrid24hrProps {
  segments: TimeSegment[]
  date?: string
  editable?: boolean
  onSegmentClick?: (segment: TimeSegment) => void
  showLegend?: boolean
  height?: number
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const TOTAL_MINUTES = 24 * 60

const LEGEND_ITEMS = [
  { type: 'normal', label: 'Regular' },
  { type: 'stepup', label: 'Step-Up' },
  { type: 'overtime', label: 'Overtime' },
] as const

export function TimeGrid24hr({
  segments,
  date,
  editable = false,
  onSegmentClick,
  showLegend = true,
  height = 40,
}: TimeGrid24hrProps) {
  const theme = useTheme()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const segmentColor = (type: TimeSegment['type']) => {
    if (type === 'normal') return theme.palette.primary.main
    if (type === 'stepup') return theme.palette.error.main
    return theme.palette.warning.main
  }

  return (
    <Box>
      {date && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          {date}
        </Typography>
      )}

      {/* Hour markers */}
      <Box sx={{ position: 'relative', mb: 0.25 }}>
        <Box sx={{ display: 'flex', ml: 0 }}>
          {HOURS.map((h) => (
            <Box
              key={h}
              sx={{
                flex: 1,
                textAlign: 'left',
                borderLeft: '1px solid',
                borderColor: 'divider',
                pl: 0.25,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6rem',
                  color: 'text.disabled',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {h === 0 ? '00' : h < 10 ? `0${h}` : h}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Grid bar */}
      <Box
        sx={{
          position: 'relative',
          height,
          bgcolor: 'action.hover',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Hour grid lines */}
        {HOURS.map((h) => (
          <Box
            key={h}
            sx={{
              position: 'absolute',
              left: `${(h / 24) * 100}%`,
              top: 0,
              bottom: 0,
              width: '1px',
              bgcolor: 'divider',
              opacity: 0.5,
            }}
          />
        ))}

        {/* Segments */}
        {segments.map((seg) => {
          const start = timeToMinutes(seg.startTime)
          const end = timeToMinutes(seg.endTime)
          const left = (start / TOTAL_MINUTES) * 100
          const width = ((end - start) / TOTAL_MINUTES) * 100
          const color = segmentColor(seg.type)
          const isHovered = hoveredId === seg.id

          const bar = (
            <Box
              key={seg.id}
              onClick={editable && onSegmentClick ? () => onSegmentClick(seg) : undefined}
              onMouseEnter={() => setHoveredId(seg.id)}
              onMouseLeave={() => setHoveredId(null)}
              sx={{
                position: 'absolute',
                left: `${left}%`,
                width: `${width}%`,
                top: 4,
                bottom: 4,
                bgcolor: color,
                borderRadius: 0.5,
                cursor: editable ? 'pointer' : 'default',
                opacity: isHovered ? 0.85 : 1,
                transition: 'opacity 0.15s',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                px: 0.5,
              }}
            >
              {width > 5 && seg.label && (
                <Typography
                  noWrap
                  sx={{
                    fontSize: '0.6rem',
                    color: '#fff',
                    fontWeight: 600,
                    lineHeight: 1,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {seg.label}
                </Typography>
              )}
            </Box>
          )

          const tooltipText = seg.tooltip ?? `${seg.startTime}–${seg.endTime}${seg.label ? ` · ${seg.label}` : ''}`

          return (
            <Tooltip key={seg.id} title={tooltipText} placement="top" arrow>
              {bar}
            </Tooltip>
          )
        })}
      </Box>

      {/* Legend */}
      {showLegend && (
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          {LEGEND_ITEMS.map(({ type, label }) => (
            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 0.5,
                  bgcolor: segmentColor(type),
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

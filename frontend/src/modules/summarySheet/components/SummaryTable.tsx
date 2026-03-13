import { useState } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Box, Typography, IconButton, Collapse, Tooltip, Paper,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import type { SummaryRow, SummaryTotals } from '../types'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function fmtHours(h: number): string {
  return h === 0 ? '—' : `${h}`
}

function cellBg(hours: number): string | undefined {
  if (hours > 8) return 'rgba(245, 158, 11, 0.12)'   // warning tint
  return undefined
}

interface SummaryTableProps {
  rows: SummaryRow[]
  dates: string[]
  totals: SummaryTotals
}

export function SummaryTable({ rows, dates, totals }: SummaryTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (userId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  const colCount = dates.length + 3 // expand + employee + days + total

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Table size="small" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell sx={{ width: 36, p: 0.5 }} />
            <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Employee</TableCell>
            {dates.map((d, i) => (
              <TableCell key={d} align="center" sx={{ fontWeight: 700, width: 72 }}>
                {DAY_LABELS[i]}
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 400, fontSize: '0.65rem' }}>
                  {d.slice(5)}
                </Typography>
              </TableCell>
            ))}
            <TableCell align="center" sx={{ fontWeight: 700, width: 72, color: 'primary.main' }}>
              Total
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const expanded = expandedRows.has(row.userId)
            const hasBreakdown = Object.keys(row.chargeCodeBreakdown).length > 0

            // collect all charge codes used this week
            const allCodes = Array.from(
              new Set(Object.values(row.chargeCodeBreakdown).flatMap((d) => Object.keys(d)))
            )

            return (
              <>
                {/* Main row */}
                <TableRow
                  key={row.userId}
                  hover
                  sx={{ cursor: hasBreakdown ? 'pointer' : 'default' }}
                  onClick={() => hasBreakdown && toggleRow(row.userId)}
                >
                  <TableCell sx={{ p: 0.5, textAlign: 'center' }}>
                    {hasBreakdown && (
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.userId) }}>
                        {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.userName}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.jobRole} · {row.locationName}</Typography>
                  </TableCell>
                  {dates.map((d) => {
                    const h = row.dailyHours[d] ?? 0
                    return (
                      <TableCell
                        key={d}
                        align="center"
                        sx={{ bgcolor: cellBg(h), fontFamily: 'JetBrains Mono, monospace', fontWeight: h > 8 ? 700 : 400, color: h > 8 ? 'warning.main' : 'text.primary' }}
                      >
                        {fmtHours(h)}
                      </TableCell>
                    )
                  })}
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                      color: row.weeklyTotal >= 40 ? 'warning.main' : 'primary.main',
                      bgcolor: row.weeklyTotal >= 40 ? 'rgba(245, 158, 11, 0.08)' : undefined,
                    }}
                  >
                    {row.weeklyTotal}
                  </TableCell>
                </TableRow>

                {/* Charge code breakdown rows */}
                <TableRow key={`${row.userId}-breakdown`}>
                  <TableCell colSpan={colCount} sx={{ p: 0, border: 0 }}>
                    <Collapse in={expanded} unmountOnExit>
                      <Box sx={{ bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Table size="small" sx={{ tableLayout: 'fixed' }}>
                          <TableBody>
                            {allCodes.map((code) => (
                              <TableRow key={code}>
                                <TableCell sx={{ width: 36, p: 0 }} />
                                <TableCell sx={{ minWidth: 180 }}>
                                  <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono, monospace', color: 'primary.main', fontWeight: 600, pl: 2 }}>
                                    {code}
                                  </Typography>
                                </TableCell>
                                {dates.map((d) => {
                                  const h = row.chargeCodeBreakdown[d]?.[code] ?? 0
                                  return (
                                    <TableCell key={d} align="center" sx={{ width: 72 }}>
                                      <Typography variant="caption" color={h > 0 ? 'text.primary' : 'text.disabled'} sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                        {h > 0 ? h : '—'}
                                      </Typography>
                                    </TableCell>
                                  )
                                })}
                                <TableCell sx={{ width: 72 }} />
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            )
          })}

          {/* Footer totals */}
          <TableRow sx={{ bgcolor: 'action.selected', borderTop: '2px solid', borderColor: 'divider' }}>
            <TableCell sx={{ p: 0.5 }} />
            <TableCell>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Daily Totals</Typography>
            </TableCell>
            {dates.map((d) => (
              <TableCell key={d} align="center" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                <Tooltip title={`${totals.dailyTotals[d] ?? 0}h total`}>
                  <span>{fmtHours(totals.dailyTotals[d] ?? 0)}</span>
                </Tooltip>
              </TableCell>
            ))}
            <TableCell align="center" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'primary.main' }}>
              {totals.grandTotal}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

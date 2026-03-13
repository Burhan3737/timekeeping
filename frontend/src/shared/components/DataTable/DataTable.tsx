import { useState, useMemo, ReactNode } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Skeleton,
  Typography,
  Paper,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import InboxIcon from '@mui/icons-material/Inbox'

export interface Column<T> {
  id: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => ReactNode
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T extends { id?: string | number }> {
  columns: Column<T>[]
  rows: T[]
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: boolean
  rowsPerPage?: number
  actions?: (row: T) => ReactNode
  onRowClick?: (row: T) => void
  emptyMessage?: string
  dense?: boolean
}

type SortDirection = 'asc' | 'desc'

function getCellValue<T>(row: T, id: keyof T | string): unknown {
  return (row as Record<string, unknown>)[id as string]
}

function matchesSearch<T>(row: T, columns: Column<T>[], query: string): boolean {
  const q = query.toLowerCase()
  return columns.some((col) => {
    const val = getCellValue(row, col.id)
    return typeof val === 'string' && val.toLowerCase().includes(q)
  })
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  rows,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search…',
  pagination = true,
  rowsPerPage: defaultRowsPerPage = 10,
  actions,
  onRowClick,
  emptyMessage = 'No records found.',
  dense = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof T | string>('')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  const handleSort = (colId: keyof T | string) => {
    if (sortBy === colId) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(colId)
      setSortDir('asc')
    }
    setPage(0)
  }

  const filtered = useMemo(() => {
    let data = rows
    if (search) data = data.filter((row) => matchesSearch(row, columns, search))
    if (sortBy) {
      data = [...data].sort((a, b) => {
        const av = getCellValue(a, sortBy)
        const bv = getCellValue(b, sortBy)
        if (av === bv) return 0
        const cmp = av == null ? -1 : bv == null ? 1 : av < bv ? -1 : 1
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return data
  }, [rows, search, sortBy, sortDir, columns])

  const paginated = pagination
    ? filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filtered

  const skeletonRows = Array.from({ length: defaultRowsPerPage })
  const colCount = columns.length + (actions ? 1 : 0)

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {searchable && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 280 } }}
          />
        </Box>
      )}

      <TableContainer>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align ?? 'left'}
                  width={col.width}
                  sx={{ fontWeight: 700, whiteSpace: 'nowrap', bgcolor: 'action.hover' }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortDir : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, bgcolor: 'action.hover', width: 100 }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              skeletonRows.map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: colCount }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount}>
                  <Box
                    sx={{
                      py: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.disabled',
                    }}
                  >
                    <InboxIcon sx={{ fontSize: 40 }} />
                    <Typography variant="body2">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, i) => (
                <TableRow
                  key={(row.id as string | number | undefined) ?? i}
                  hover={!!onRowClick}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.id)} align={col.align ?? 'left'}>
                      {col.render
                        ? col.render(row)
                        : String(getCellValue(row, col.id) ?? '—')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && !loading && (
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0) }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  )
}

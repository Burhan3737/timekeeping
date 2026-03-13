import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'

interface FilterOption {
  label: string
  value: string
}

interface FilterConfig {
  id: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

interface FilterBarProps {
  dateRange?: {
    startDate: string
    endDate: string
    onStartChange: (date: string) => void
    onEndChange: (date: string) => void
  }
  filters?: FilterConfig[]
  onReset?: () => void
}

export function FilterBar({ dateRange, filters, onReset }: FilterBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        p: 2,
        bgcolor: 'action.hover',
        borderRadius: 2,
        mb: 2,
      }}
    >
      {dateRange && (
        <>
          <TextField
            label="From"
            type="date"
            size="small"
            value={dateRange.startDate}
            onChange={(e) => dateRange.onStartChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={dateRange.endDate}
            onChange={(e) => dateRange.onEndChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </>
      )}

      {filters?.map((filter) => (
        <FormControl key={filter.id} size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{filter.label}</InputLabel>
          <Select
            value={filter.value}
            label={filter.label}
            onChange={(e) => filter.onChange(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {filter.options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      {onReset && (
        <Button
          variant="text"
          size="small"
          onClick={onReset}
          startIcon={<FilterListOffIcon />}
          sx={{ ml: 'auto', color: 'text.secondary' }}
        >
          Reset
        </Button>
      )}
    </Box>
  )
}

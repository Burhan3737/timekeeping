import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useTheme as useAppTheme } from '@core/state/appStore'
import { createLightTheme, createDarkTheme } from './themeConfig'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const currentTheme = useAppTheme()
  const theme = currentTheme === 'light' ? createLightTheme() : createDarkTheme()

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

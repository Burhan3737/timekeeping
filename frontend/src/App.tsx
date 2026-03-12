import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { MainLayout } from '@shared/components/layout/MainLayout'
import { HomePage } from '@modules/home/components/HomePage'
import { useTheme } from '@core/state/appStore'

function App() {
  const currentTheme = useTheme()

  const theme = createTheme({
    palette: {
      mode: currentTheme,
      primary: {
        main: '#2563eb',
      },
      secondary: {
        main: '#64748b',
      },
      background: {
        default: currentTheme === 'light' ? '#f8fafc' : '#0f172a',
        paper: currentTheme === 'light' ? '#ffffff' : '#1e293b',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/time-entries"
            element={
              <div>Time Entries Page (Coming Soon)</div>
            }
          />
          <Route
            path="/reports"
            element={<div>Reports Page (Coming Soon)</div>}
          />
        </Routes>
      </MainLayout>
    </ThemeProvider>
  )
}

export default App

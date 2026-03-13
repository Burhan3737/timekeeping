import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@shared/components/layout/MainLayout'
import { HomePage } from '@modules/home/components/HomePage'
import { ThemeProvider } from '@core/theme'

function App() {
  return (
    <ThemeProvider>
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

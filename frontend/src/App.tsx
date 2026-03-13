import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@shared/components/layout/MainLayout'
import { HomePage } from '@modules/home/components/HomePage'
import { LocationsPage } from '@modules/locations'
import { ChargeCodesPage } from '@modules/chargeCodes'
import { JobRolesPage } from '@modules/jobRoles'
import { UsersPage, UserProfilePage } from '@modules/users'
import { UserShiftsPage } from '@modules/userShifts'
import { TimeSessionsPage, SessionHistoryPage } from '@modules/timeSessions'
import { OvertimePage } from '@modules/overtime'
import { ThemeProvider } from '@core/theme'

// Placeholder for unbuilt pages — replace with real component imports as modules are built
// Nav structure (labels, icons, paths) is defined in: src/core/routing/navigationConfig.ts
function ComingSoon({ title }: { title: string }) {
  return (
    <div style={{ padding: 32, color: '#94a3b8' }}>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, margin: 0 }}>{title}</h2>
      <p style={{ fontFamily: 'Inter, sans-serif', marginTop: 8 }}>Coming soon</p>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Time Keeping */}
          <Route path="/time-sessions" element={<TimeSessionsPage />} />
          <Route path="/time-sessions/history" element={<SessionHistoryPage />} />
          <Route path="/overtime" element={<OvertimePage />} />

          {/* Reporting */}
          <Route path="/reporting/time-sheets" element={<ComingSoon title="Time Sheets" />} />
          <Route path="/reporting/overtime-requests" element={<ComingSoon title="Overtime Requests" />} />
          <Route path="/reporting/employees" element={<ComingSoon title="Employees" />} />
          <Route path="/reporting/summary-sheet" element={<ComingSoon title="Summary Sheet" />} />
          <Route path="/reporting/alerts" element={<ComingSoon title="Alerts" />} />

          {/* Setup */}
          <Route path="/setup/users" element={<UsersPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/setup/job-roles" element={<JobRolesPage />} />
          <Route path="/setup/charge-codes" element={<ChargeCodesPage />} />
          <Route path="/setup/locations" element={<LocationsPage />} />
          <Route path="/setup/user-shifts" element={<UserShiftsPage />} />
        </Routes>
      </MainLayout>
    </ThemeProvider>
  )
}

export default App

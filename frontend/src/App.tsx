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
import { TimeSheetsPage } from '@modules/timeSheets'
import { OvertimeRequestsPage } from '@modules/overtimeRequests'
import { EmployeesPage } from '@modules/employees'
import { SummarySheetPage } from '@modules/summarySheet'
import { AlertsPage } from '@modules/alerts'
import { ThemeProvider } from '@core/theme'

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
          <Route path="/reporting/time-sheets" element={<TimeSheetsPage />} />
          <Route path="/reporting/overtime-requests" element={<OvertimeRequestsPage />} />
          <Route path="/reporting/employees" element={<EmployeesPage />} />
          <Route path="/reporting/summary-sheet" element={<SummarySheetPage />} />
          <Route path="/reporting/alerts" element={<AlertsPage />} />

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

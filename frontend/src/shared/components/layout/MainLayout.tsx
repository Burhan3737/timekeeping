import { ReactNode } from 'react'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <div className="main-layout__header-content">
          <a href="/" className="main-layout__logo">Timekeeping</a>
          <nav className="main-layout__nav">
            <a href="/" className="main-layout__nav-link">Dashboard</a>
            <a href="/time-entries" className="main-layout__nav-link">Time Entries</a>
            <a href="/reports" className="main-layout__nav-link">Reports</a>
          </nav>
        </div>
      </header>

      <main className="main-layout__main">{children}</main>

      <footer className="main-layout__footer">
        © {new Date().getFullYear()} Timekeeping App. All rights reserved.
      </footer>
    </div>
  )
}

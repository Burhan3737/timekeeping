import './HomePage.css'

export function HomePage() {
  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">Welcome to Timekeeping</h1>
        <p className="home-page__subtitle">
          Track your time efficiently and generate insightful reports
        </p>
      </section>

      <section className="home-page__features">
        <div className="home-page__feature-card">
          <h3 className="home-page__feature-title">Track Time</h3>
          <p className="home-page__feature-description">
            Log your work hours with ease. Start and stop timers or add entries manually.
          </p>
        </div>

        <div className="home-page__feature-card">
          <h3 className="home-page__feature-title">View Reports</h3>
          <p className="home-page__feature-description">
            Get detailed insights into how you spend your time with visual reports.
          </p>
        </div>

        <div className="home-page__feature-card">
          <h3 className="home-page__feature-title">Export Data</h3>
          <p className="home-page__feature-description">
            Export your time entries to various formats for billing and analysis.
          </p>
        </div>
      </section>
    </div>
  )
}

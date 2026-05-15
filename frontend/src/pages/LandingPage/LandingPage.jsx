import './LandingPage.css'
import heroImage from './../../assets/hero.png'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-shell">
        <header className="landing-header">
          <div className="brand-block">
            <div className="brand-icon" />
            <span>Team Task Manager</span>
          </div>

          <nav className="landing-nav" aria-label="Primary navigation">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-cta">
              Sign Up
            </Link>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="hero-copy">
            <span className="hero-badge">Simplify team task management</span>
            <h1>Build better projects with clear ownership and fast delivery.</h1>
            <p>
              Create projects, assign team members, track tasks, and move work
              across statuses from one shared dashboard.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="button button-primary">
                Get Started
              </Link>
              <Link to="/login" className="button button-secondary">
                Login
              </Link>
            </div>

            <div className="hero-metrics">
              <div>
                <strong>Projects</strong>
                <span>Create and manage team workspaces.</span>
              </div>
              <div>
                <strong>Tasks</strong>
                <span>Assign, prioritize, and update statuses.</span>
              </div>
              <div>
                <strong>Dashboard</strong>
                <span>See progress, overdue items, and workload at a glance.</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-frame">
              <img src={heroImage} alt="Project task board preview" />
            </div>
          </div>
        </section>

        <section className="feature-row">
          <article className="feature-card">
            <h2>Creator is Admin</h2>
            <p>
              When a project is created, the creator becomes the project Admin
              and manages members and tasks.
            </p>
          </article>
          <article className="feature-card">
            <h2>Clear task flow</h2>
            <p>
              Tasks move through To Do, In Progress, and Done so the team stays
              aligned.
            </p>
          </article>
          <article className="feature-card">
            <h2>Role-based access</h2>
            <p>
              Admins manage projects and users. Members work on tasks assigned to
              them.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}

export default LandingPage

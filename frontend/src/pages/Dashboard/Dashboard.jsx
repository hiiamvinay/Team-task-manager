import './Dashboard.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

async function readResponseData(response) {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    return {
      message: 'Received an invalid response from the server',
    }
  }
}

function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const apiUrl = import.meta.env.VITE_API
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await readResponseData(response)

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load dashboard')
        }

        setMetrics(data.metrics)
      } catch (error) {
        toast.error(error.message || 'Unable to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [apiUrl, token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-card">
            <h1>Loading dashboard...</h1>
          </div>
        </section>
      </main>
    )
  }

  const tasksByStatus = metrics?.tasksByStatus || {
    'To Do': 0,
    'In Progress': 0,
    Done: 0,
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-hero">
          <div className="dashboard-hero-bar">
            <div>
              <p className="dashboard-kicker">Dashboard</p>
              <h1>Team progress at a glance</h1>
              <p className="dashboard-copy">
                Track overall task volume, compare work by status, and spot overdue tasks quickly.
              </p>
            </div>
            <button
              type="button"
              className="dashboard-button dashboard-button-muted"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-top-actions">
          <Link to="/projects" className="dashboard-button dashboard-button-primary">
            Open Project Management
          </Link>
          <Link to="/tasks" className="dashboard-button dashboard-button-muted">
            Open Task Management
          </Link>
        </div>

        <section className="dashboard-metrics-grid">
          <article className="dashboard-card dashboard-metric-card">
            <span className="dashboard-metric-label">Total tasks</span>
            <strong>{metrics?.totalTasks ?? 0}</strong>
            <p>All tasks across the projects you belong to.</p>
          </article>

          <article className="dashboard-card dashboard-metric-card">
            <span className="dashboard-metric-label">Overdue tasks</span>
            <strong>{metrics?.overdueTasks ?? 0}</strong>
            <p>Tasks past due that are not marked as Done.</p>
          </article>
        </section>

        <section className="dashboard-card dashboard-status-card">
          <div className="dashboard-section-header">
            <h2>Tasks by status</h2>
          </div>

          <div className="dashboard-status-grid">
            <div className="dashboard-status-item">
              <span>To Do</span>
              <strong>{tasksByStatus['To Do']}</strong>
            </div>
            <div className="dashboard-status-item">
              <span>In Progress</span>
              <strong>{tasksByStatus['In Progress']}</strong>
            </div>
            <div className="dashboard-status-item">
              <span>Done</span>
              <strong>{tasksByStatus.Done}</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Dashboard

import './TaskManagement.css'
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

function TaskManagement() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assigneeId: '',
  })
  const apiUrl = import.meta.env.VITE_API
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  const selectedProject = projects.find((project) => project.id === selectedProjectId)

  const loadProjects = async () => {
    const response = await fetch(`${apiUrl}/api/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await readResponseData(response)

    if (!response.ok) {
      throw new Error(data.message || 'Unable to load projects')
    }

    setProjects(data.projects || [])

    if (!selectedProjectId && data.projects?.length) {
      setSelectedProjectId(data.projects[0].id)
    }
  }

  const loadTasks = async (projectId) => {
    if (!projectId) {
      setTasks([])
      return
    }

    const response = await fetch(`${apiUrl}/api/tasks/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await readResponseData(response)

    if (!response.ok) {
      throw new Error(data.message || 'Unable to load tasks')
    }

    setTasks(data.tasks || [])
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadProjects()
      } catch (error) {
        toast.error(error.message || 'Unable to load task page')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const syncTasks = async () => {
      if (!selectedProjectId) {
        return
      }

      try {
        await loadTasks(selectedProjectId)
      } catch (error) {
        toast.error(error.message || 'Unable to load tasks')
      }
    }

    syncTasks()
    setForm((prev) => ({
      ...prev,
      assigneeId: '',
    }))
  }, [selectedProjectId])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          projectId: selectedProjectId,
          ...form,
        }),
      })
      const data = await readResponseData(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create task')
      }

      setForm({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assigneeId: '',
      })
      toast.success('Task created successfully')
      await loadTasks(selectedProjectId)
    } catch (error) {
      toast.error(error.message || 'Unable to create task')
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      const response = await fetch(`${apiUrl}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })
      const data = await readResponseData(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update task status')
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: data.task.status,
              }
            : task
        )
      )
      toast.success('Task status updated')
    } catch (error) {
      toast.error(error.message || 'Unable to update task status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this task?')

    if (!shouldDelete) {
      return
    }

    try {
      const response = await fetch(`${apiUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const data = await readResponseData(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete task')
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success(data.message || 'Task deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Unable to delete task')
    }
  }

  if (isLoading) {
    return (
      <main className="tasks-page">
        <section className="tasks-shell">
          <div className="tasks-card">
            <h1>Loading task workspace...</h1>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="tasks-page">
      <section className="tasks-shell">
        <header className="tasks-hero">
          <div className="tasks-hero-bar">
            <div>
              <p className="tasks-kicker">Task management</p>
              <h1>Create, assign, and move work forward</h1>
              <p className="tasks-copy">
                Choose a project, assign tasks to project members, and update status across To Do,
                In Progress, and Done.
              </p>
            </div>
            <div className="tasks-hero-actions">
              <Link to="/dashboard" className="tasks-button tasks-button-primary">
                Open Dashboard
              </Link>
              <button type="button" className="tasks-button tasks-button-muted" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="tasks-grid">
          <article className="tasks-card">
            <h2>Create task</h2>
            <form className="tasks-form" onSubmit={handleCreateTask}>
              <label htmlFor="project-select">Project</label>
              <select
                id="project-select"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <label htmlFor="task-title">Title</label>
              <input
                id="task-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Build login API"
                required
              />

              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                rows="4"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Add the endpoint and connect it to the frontend"
              />

              <div className="tasks-form-row">
                <div>
                  <label htmlFor="task-due-date">Due Date</label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    value={form.priority}
                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <label htmlFor="task-assignee">Assign To</label>
              <select
                id="task-assignee"
                value={form.assigneeId}
                onChange={(e) => setForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
                required
                disabled={!selectedProject}
              >
                <option value="">Select a project member</option>
                {selectedProject?.members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>

              <button type="submit" className="tasks-button tasks-button-primary">
                Create Task
              </button>
            </form>
          </article>

          <article className="tasks-card">
            <div className="tasks-section-header">
              <h2>Task list</h2>
              <span>{tasks.length} total</span>
            </div>

            {!selectedProjectId ? (
              <p className="tasks-empty">Select a project to manage its tasks.</p>
            ) : tasks.length === 0 ? (
              <p className="tasks-empty">No tasks yet for this project.</p>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <article key={task.id} className="task-card">
                    <div className="task-card-top">
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description || 'No description provided.'}</p>
                      </div>
                      <span className={`task-priority task-priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="task-meta">
                      <span>Assignee: {task.assignee?.name || 'Unknown'}</span>
                      <span>
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>

                    <div className="task-status-row">
                      <label htmlFor={`status-${task.id}`}>Status</label>
                      <select
                        id={`status-${task.id}`}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="tasks-button tasks-button-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete Task
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        </section>
      </section>
    </main>
  )
}

export default TaskManagement

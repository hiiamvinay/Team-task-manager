import './ProjectManagement.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const emptyMemberForm = {}

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

function ProjectManagement() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [memberForms, setMemberForms] = useState(emptyMemberForm)
  const apiUrl = import.meta.env.VITE_API
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  const loadProjectData = async () => {
    try {
      const [userResponse, projectResponse, usersResponse] = await Promise.all([
        fetch(`${apiUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${apiUrl}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${apiUrl}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

      const userData = await readResponseData(userResponse)
      const projectData = await readResponseData(projectResponse)
      const usersData = await readResponseData(usersResponse)

      if (!userResponse.ok || !projectResponse.ok || !usersResponse.ok) {
        throw new Error(
          userData.message || projectData.message || usersData.message || 'Unable to load projects'
        )
      }

      setUser(userData.user)
      setProjects(projectData.projects || [])
      setAllUsers(usersData.users || [])
    } catch (error) {
      toast.error(error.message || 'Unable to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjectData()
  }, [])

  const handleCreateProject = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
        }),
      })
      const data = await readResponseData(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create project')
      }

      setProjectName('')
      setProjectDescription('')
      toast.success('Project created successfully')
      await loadProjectData()
    } catch (error) {
      toast.error(error.message || 'Unable to create project')
    }
  }

  const handleMemberInputChange = (projectId, field, value) => {
    setMemberForms((prev) => ({
      ...prev,
      [projectId]: {
        email: prev[projectId]?.email || '',
        role: prev[projectId]?.role || 'Member',
        [field]: value,
      },
    }))
  }

  const handleAddMember = async (e, projectId) => {
    e.preventDefault()

    const form = memberForms[projectId] || { email: '', role: 'Member' }

    try {
      const response = await fetch(`${apiUrl}/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      })
      const data = await readResponseData(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to add member')
      }

      setMemberForms((prev) => ({
        ...prev,
        [projectId]: { email: '', role: 'Member' },
      }))
      toast.success(data.message || 'Member added successfully')
      await loadProjectData()
    } catch (error) {
      toast.error(error.message || 'Unable to add member')
    }
  }

  const handleRemoveMember = async (projectId, memberId) => {
    try {
      const response = await fetch(`${apiUrl}/api/projects/${projectId}/members/${memberId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const data = await readResponseData(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to remove member')
      }

      toast.success(data.message || 'Member removed successfully')
      await loadProjectData()
    } catch (error) {
      toast.error(error.message || 'Unable to remove member')
    }
  }

  const handleDeleteProject = async (projectId, projectName) => {
    const confirmed = window.confirm(`Delete project "${projectName}"? This cannot be undone.`)

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`${apiUrl}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const data = await readResponseData(response)

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete project')
      }

      toast.success(data.message || 'Project deleted successfully')
      await loadProjectData()
    } catch (error) {
      toast.error(error.message || 'Unable to delete project')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <main className="project-page">
        <section className="project-shell">
          <div className="project-card">
            <h1>Loading project workspace...</h1>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="project-page">
      <section className="project-shell">
        <header className="project-hero">
          <div className="project-hero-bar">
            <div>
              <p className="project-kicker">Project management</p>
              <h1>{user ? `Welcome back, ${user.name}` : 'Projects'}</h1>
              <p className="project-copy">
                Create projects, manage team membership as an Admin, and keep each project organized.
              </p>
            </div>
            <button
              type="button"
              className="project-button project-button-muted"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="project-top-actions">
          <Link to="/dashboard" className="project-button project-button-primary">
            Open Dashboard
          </Link>
          <Link to="/tasks" className="project-button project-button-muted">
            Open Task Management
          </Link>
        </div>

        <section className="project-grid">
          <article className="project-card project-card-form">
            <h2>Create project</h2>
            <form className="project-form" onSubmit={handleCreateProject}>
              <label htmlFor="project-name">Project name</label>
              <input
                id="project-name"
                type="text"
                placeholder="Website redesign"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />

              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                rows="4"
                placeholder="Add a short summary for your team"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />

              <button type="submit" className="project-button project-button-primary">
                Create Project
              </button>
            </form>
          </article>

          <article className="project-card project-card-projects">
            <div className="project-section-header">
              <h2>Your projects</h2>
              <span>{projects.length} total</span>
            </div>

            {projects.length === 0 ? (
              <p className="project-empty">
                No projects yet. Create your first one to become its Admin automatically.
              </p>
            ) : (
              <div className="project-list">
                {projects.map((project) => {
                  const form = memberForms[project.id] || { email: '', role: 'Member' }
                  const availableUsers = allUsers.filter(
                    (availableUser) =>
                      availableUser.id !== user?.id &&
                      !project.members?.some((member) => member.id === availableUser.id)
                  )

                  return (
                    <article key={project.id} className="project-item-card">
                      <div className="project-item-header">
                        <div>
                          <h3>{project.name}</h3>
                          <p>{project.description || 'No description added yet.'}</p>
                        </div>
                        <span className={`project-role project-role-${project.role.toLowerCase()}`}>
                          {project.role}
                        </span>
                      </div>

                      {project.role === 'Admin' ? (
                        <div className="project-toolbar">
                          <button
                            type="button"
                            className="project-button project-button-danger"
                            onClick={() => handleDeleteProject(project.id, project.name)}
                          >
                            Delete Project
                          </button>
                        </div>
                      ) : null}

                      <div className="project-members">
                        <h4>Members</h4>
                        {project.members?.length ? (
                          <ul className="member-list">
                            {project.members.map((member) => (
                              <li key={member.id} className="member-item">
                                <div>
                                  <strong>{member.name}</strong>
                                  <span>{member.email}</span>
                                </div>
                                <div className="member-actions">
                                  <span className="member-role">{member.role}</span>
                                  {project.role === 'Admin' && member.id !== user?.id ? (
                                    <button
                                      type="button"
                                      className="project-button project-button-muted"
                                      onClick={() => handleRemoveMember(project.id, member.id)}
                                    >
                                      Remove
                                    </button>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="project-empty">No members assigned yet.</p>
                        )}
                      </div>

                      {project.role === 'Admin' ? (
                        <form className="member-form" onSubmit={(e) => handleAddMember(e, project.id)}>
                          <h4>Manage members</h4>
                          <select
                            value={form.email}
                            onChange={(e) =>
                              handleMemberInputChange(project.id, 'email', e.target.value)
                            }
                            required
                          >
                            <option value="">Select a user</option>
                            {availableUsers.map((availableUser) => (
                              <option key={availableUser.id} value={availableUser.email}>
                                {availableUser.name} ({availableUser.email})
                              </option>
                            ))}
                          </select>
                          <select
                            value={form.role}
                            onChange={(e) =>
                              handleMemberInputChange(project.id, 'role', e.target.value)
                            }
                          >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <button
                            type="submit"
                            className="project-button project-button-primary"
                          >
                            Add Member
                          </button>
                        </form>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            )}
          </article>
        </section>
      </section>
    </main>
  )
}

export default ProjectManagement

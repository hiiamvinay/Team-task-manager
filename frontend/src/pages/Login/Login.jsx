
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', email)
        toast.success('Login successful')
        navigate('/dashboard')
      } else {
        toast.error(data.message || 'Invalid credentials')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-card">
          <h1>Welcome back</h1>
          <p className="login-subtitle">Log in to access your projects and tasks.</p>

          <form className="login-form" action="#" method="post">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" className="button button-primary" onClick={handleSubmit}>
              Login
            </button>
          </form>

          <p className="login-footer">
            Don’t have an account? <Link to="/signup"> Sign up here </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login

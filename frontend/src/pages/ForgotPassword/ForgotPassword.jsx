import './ForgotPassword.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        navigate('/reset-password', { state: { email } })
      } else {
        toast.error(data.message || 'Unable to send reset OTP')
      }
    } catch {
      toast.error('An error occurred while requesting password reset')
    }
  }

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-shell">
        <div className="forgot-password-card">
          <h1>Forgot your password?</h1>
          <p className="forgot-password-subtitle">Enter your email and we’ll send you an OTP to reset your password.</p>

          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="button button-primary">
              Send OTP
            </button>
          </form>

          <p className="forgot-password-footer">
            Remembered it? <Link to="/login">Back to login</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default ForgotPassword

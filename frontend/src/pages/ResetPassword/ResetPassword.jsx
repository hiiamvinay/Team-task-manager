import './ResetPassword.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

function ResetPassword() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const initialEmail = location.state?.email || ''
  const apiUrl = import.meta.env.VITE_API
  const inputRefs = useRef([])

  const displayedEmail = initialEmail || email

  const handleChange = (e, index) => {
    const value = e.target.value
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')

    if (!displayedEmail) {
      toast.error('Email is required')
      return
    }

    if (otpString.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: displayedEmail, otp: otpString, password }),
      })
      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message || 'Unable to reset password')
      }
    } catch {
      toast.error('An error occurred while resetting password')
    }
  }

  return (
    <main className="reset-password-page">
      <section className="reset-password-shell">
        <div className="reset-password-card">
          <h1>Reset password</h1>
          <p className="reset-password-subtitle">Enter the OTP from your email and choose a new password.</p>

          <form className="reset-password-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={displayedEmail}
              readOnly={Boolean(initialEmail)}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>OTP</label>
            <div className="reset-password-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  required
                />
              ))}
            </div>

            <label htmlFor="password">New password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="button button-primary">
              Reset Password
            </button>
          </form>

          <p className="reset-password-footer">
            Need a fresh OTP? <Link to="/forgot-password">Request another one</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default ResetPassword

import './OTP.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef } from 'react'
import { toast } from 'react-toastify'

function OTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const apiUrl = import.meta.env.VITE_API;
  const inputRefs = useRef([])

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
    if (otpString.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }
    try {
      const response = await fetch(`${apiUrl}/api/users/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('An error occurred during OTP verification')
    }
  }

  return (
    <main className="otp-page">
      <section className="otp-shell">
        <div className="otp-card">
          <h1>Verify Your Email</h1>
          <p className="otp-subtitle">Enter the OTP sent to your email to complete signup.</p>
          <form className="otp-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={email} readOnly />

            <label>OTP</label>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => inputRefs.current[index] = el}
                  required
                />
              ))}
            </div>

            <button type="submit" className="button button-primary">
              Verify OTP
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default OTP

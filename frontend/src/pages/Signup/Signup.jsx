import './Signup.css'
import { useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'    

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API;
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${apiUrl}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        navigate('/otp', { state: { email } })
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('An error occurred during signup')
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-shell">
        <div className="signup-card">
          <h1>Create an account</h1>
          <p className="signup-subtitle">Sign up to manage your projects and collaborate with your team.</p>
          <form className="signup-form" action="#" method="post">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" className="button button-primary" onClick={handleSubmit}>
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Signup

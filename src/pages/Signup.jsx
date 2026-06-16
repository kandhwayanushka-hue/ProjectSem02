import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const { addToast } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(name, email, password)
      addToast('Account created! Welcome to InventoManego', 'success')
      navigate('/dashboard')
    } catch (err) {
      addToast(err.response?.data?.error || 'Signup failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc', padding: 40 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <img src="/logo.png" alt="logo" width={64} height={64} style={{ borderRadius: '50%', marginBottom: 12 }} />
          <h2 style={{ color: '#1a365d', margin: 0, fontSize: 24 }}>Create Account</h2>
          <p style={{ color: '#888', fontSize: 14, marginTop: 6 }}>Join InventoManego</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: 15, outline: 'none' }}
              placeholder="John Doe" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: 15, outline: 'none' }}
              placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: 15, outline: 'none' }}
              placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="learn-btn"
            style={{ width: '100%', padding: '14px', fontSize: 16, borderRadius: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
          Already have an account? <Link to="/login" style={{ color: '#2b6cb0', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </section>
  )
}

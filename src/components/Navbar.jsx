import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { addToast } = useNotification()
  const isActive = (path) => pathname === path

  const handleLogout = () => {
    logout()
    addToast('Logged out successfully', 'info')
  }

  const linkItems = [
    { to: '/', label: 'HOME' },
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/products', label: 'PRODUCTS' },
    { to: '/orders', label: 'ORDERS' },
    { to: '/suppliers', label: 'SUPPLIERS' },
    { to: '/reports', label: 'REPORTS' },
    { to: '/warehouse', label: 'WAREHOUSE' },
  ]

  const userLinks = (
    <div className="nav-actions-group">
      <button onClick={() => addToast('🔔 You have 3 new low stock alerts!', 'error')} className="nav-icon-btn" title="Notifications">🔔</button>
      <span className="nav-user-name">{user?.name}</span>
      {user?.role === 'admin' && <span className="nav-role-badge">admin</span>}
      <button onClick={handleLogout} className="nav-text-btn">Logout</button>
    </div>
  )

  const guestLinks = (
    <div className="nav-actions-group">
      <Link to="/login" className="nav-text-btn">Sign In</Link>
      <Link to="/signup" className="nav-get-started">Get Started</Link>
    </div>
  )

  return (
    <nav className="navbar">
      <div className="nav-main-row">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="logo" width="40" height="40" style={{ borderRadius: '50%' }} />
            <span className="logo-text">InventoManego</span>
          </Link>
        </div>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          {linkItems.map(({ to, label }) => (
            <li key={to}><Link to={to} style={linkStyle(isActive(to))} onClick={() => setMenuOpen(false)}>{label}</Link></li>
          ))}
        </ul>
        <div className="actions">
          {user ? userLinks : guestLinks}
        </div>
      </div>
    </nav>
  )
}

function linkStyle(active) {
  return {
    textDecoration: 'none',
    color: active ? 'white' : '#cbd5e0',
    fontWeight: active ? 700 : 400,
    borderBottom: active ? '2px solid white' : '2px solid transparent',
    paddingBottom: 2,
    transition: 'all 0.2s'
  }
}

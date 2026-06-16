import { Link, useLocation } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { addToast } = useNotification()
  const isActive = (path) => pathname === path

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="logo" width="40" height="40" style={{ borderRadius: '50%' }} />
          InventoManego
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/" style={linkStyle(isActive('/'))}>HOME</Link></li>
        <li><Link to="/dashboard" style={linkStyle(isActive('/dashboard'))}>DASHBOARD</Link></li>
        <li><Link to="/products" style={linkStyle(isActive('/products'))}>PRODUCTS</Link></li>
        <li><Link to="/orders" style={linkStyle(isActive('/orders'))}>ORDERS</Link></li>
        <li><Link to="/suppliers" style={linkStyle(isActive('/suppliers'))}>SUPPLIERS</Link></li>
        <li><Link to="/reports" style={linkStyle(isActive('/reports'))}>REPORTS</Link></li>
        <li><Link to="/warehouse" style={linkStyle(isActive('/warehouse'))}>WAREHOUSE</Link></li>
      </ul>
      <div className="actions">
        <Link to="/" style={{ color: '#cbd5e0', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Get Started</Link>
        <button
          onClick={() => addToast('🔔 You have 3 new low stock alerts!', 'error')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#cbd5e0' }}
          title="Notifications"
        >🔔</button>
        <button
          onClick={() => addToast('👋 Welcome back!', 'success')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#cbd5e0', fontSize: '0.9rem' }}
        >Login</button>
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

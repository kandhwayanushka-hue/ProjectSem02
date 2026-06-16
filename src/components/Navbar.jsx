import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="logo" width="40" height="40" style={{ borderRadius: '50%' }} />
          InventoManego
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/dashboard">DASHBOARD</Link></li>
        <li><Link to="/products">PRODUCTS</Link></li>
        <li><Link to="/orders">ORDERS</Link></li>
        <li><Link to="/suppliers">SUPPLIERS</Link></li>
        <li><Link to="/reports">REPORTS</Link></li>
        <li><Link to="/warehouse">WAREHOUSE</Link></li>
      </ul>
      <div className="actions">
        <Link to="/">Get Started</Link>
        <Link to="/">🔔</Link>
        <Link to="/">Login</Link>
      </div>
    </nav>
  )
}

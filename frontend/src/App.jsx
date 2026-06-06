import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Audit from './pages/Audit'
import Suppliers from './pages/Suppliers'

function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <div>
      <nav>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('products')}>Products</button>
        <button onClick={() => setPage('orders')}>Orders</button>
        <button onClick={() => setPage('audit')}>Audit</button>
        <button onClick={() => setPage('suppliers')}>Suppliers</button>
      </nav>
      <div className="p-6">
        {page === 'dashboard' && <Dashboard />}
        {page === 'products' && <Products />}
        {page === 'orders' && <Orders />}
        {page === 'audit' && <Audit />}
        {page === 'suppliers' && <Suppliers />}
      </div>
    </div>
  )
}
export default App

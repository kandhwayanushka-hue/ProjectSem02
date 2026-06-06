import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'

function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <div>
      <nav className="bg-blue-700 text-white p-4 flex gap-6">
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('products')}>Products</button>
        <button onClick={() => setPage('orders')}>Orders</button>
      </nav>
      <div className="p-6">
        {page === 'dashboard' && <Dashboard />}
        {page === 'products' && <Products />}
        {page === 'orders' && <Orders />}
      </div>
    </div>
  )
}
export default App
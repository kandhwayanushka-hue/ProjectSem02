import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('products')
    if (saved) setProducts(JSON.parse(saved))
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))
  }, [])

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
  const lowStock = products.filter(p => p.quantity < 5)
  const totalOrders = orders.length

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalProducts}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{totalStock}</h3>
          <p>Total Stock</p>
        </div>
        <div className="stat-card">
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card warning">
          <h3>{lowStock.length}</h3>
          <p>Low Stock Items</p>
        </div>
      </div>

      <h2>Low Stock Alerts</h2>
      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Qty</th></tr></thead>
        <tbody>
          {lowStock.map(p => (
            <tr key={p.id} className="low-stock">
              <td>{p.name}</td><td>{p.category}</td><td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

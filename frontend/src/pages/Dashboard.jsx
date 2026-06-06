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
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0)
  const lowStock = products.filter(p => p.quantity < 5)
  const totalOrders = orders.length

  const categories = []
  const catMap = {}
  products.forEach(p => {
    if (!catMap[p.category]) {
      catMap[p.category] = 0
    }
    catMap[p.category] += p.quantity
  })
  for (const cat in catMap) {
    categories.push({ name: cat, stock: catMap[cat] })
  }
  const maxStock = Math.max(...categories.map(c => c.stock), 1)

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3>{totalProducts}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>{totalStock}</h3>
          <p>Total Stock</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <h3>${totalValue}</h3>
          <p>Total Value</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <h3>{lowStock.length}</h3>
          <p>Low Stock Items</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Stock by Category</h2>
          <div className="bar-chart">
            {categories.map(c => (
              <div key={c.name} className="bar-item">
                <span className="bar-label">{c.name}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: (c.stock / maxStock) * 100 + '%' }}></div>
                </div>
                <span className="bar-value">{c.stock}</span>
              </div>
            ))}
            {categories.length === 0 && <p className="text-muted">No products yet</p>}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Low Stock Alerts</h2>
          {lowStock.length === 0 ? (
            <p className="text-muted">All stock levels are healthy</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}

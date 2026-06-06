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

  const today = new Date()
  const nearExpiry = products.filter(p => p.expiry && new Date(p.expiry) - today < 7 * 24 * 60 * 60 * 1000 && new Date(p.expiry) > today)
  const expired = products.filter(p => p.expiry && new Date(p.expiry) < today)

  const categories = []
  const catMap = {}
  products.forEach(p => {
    if (!catMap[p.category]) catMap[p.category] = 0
    catMap[p.category] += p.quantity
  })
  for (const cat in catMap) categories.push({ name: cat, stock: catMap[cat] })
  const maxStock = Math.max(...categories.map(c => c.stock), 1)

  const locations = [...new Set(products.filter(p => p.location).map(p => p.location))]

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
          <h2>Quick Actions</h2>
          {lowStock.length > 0 && (
            <div className="alert-box" style={{ marginBottom: 12 }}>
              <strong>🔄 Auto-PO Required</strong>
              <p style={{ margin: '4px 0' }}>{lowStock.length} products need reordering</p>
              <button className="btn-edit" onClick={() => {
                const po = lowStock.map(p => `${p.name} - Qty: ${p.quantity} (Min: 5)`).join('\n')
                alert(`Purchase Order Suggestion:\n\n${po}`)
              }}>Generate PO</button>
            </div>
          )}
          {expired.length > 0 && (
            <div className="alert-box" style={{ borderLeft: '4px solid #b8737a', marginBottom: 12 }}>
              <strong>⛔ {expired.length} Expired Product(s)</strong>
              <p style={{ margin: '4px 0' }}>Remove or mark as dead stock</p>
            </div>
          )}
          {nearExpiry.length > 0 && (
            <div className="alert-box" style={{ borderLeft: '4px solid #c4a35a' }}>
              <strong>⚠️ {nearExpiry.length} Product(s) Near Expiry</strong>
              <p style={{ margin: '4px 0' }}>Plan promotions or discount</p>
            </div>
          )}
          {lowStock.length === 0 && expired.length === 0 && nearExpiry.length === 0 && (
            <p className="text-muted">All stock levels are healthy</p>
          )}
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 20 }}>
        {expired.length > 0 && (
          <div className="dashboard-card">
            <h2>Expired Products</h2>
            <table>
              <thead><tr><th>Name</th><th>Expiry</th><th>Qty</th></tr></thead>
              <tbody>
                {expired.map(p => (
                  <tr key={p.id} className="low-stock">
                    <td>{p.name}</td><td>{p.expiry}</td><td>{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lowStock.length > 0 && (
          <div className="dashboard-card">
            <h2>Low Stock Alerts</h2>
            <table>
              <thead><tr><th>Name</th><th>Supplier</th><th>Qty</th></tr></thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id} className="low-stock">
                    <td>{p.name}</td><td>{p.supplier || '-'}</td><td>{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {locations.length > 0 && (
        <div className="dashboard-card" style={{ marginTop: 20 }}>
          <h2>Stock by Location</h2>
          <table>
            <thead><tr><th>Location</th><th>Products</th><th>Total Stock</th></tr></thead>
            <tbody>
              {locations.map(loc => {
                const locProducts = products.filter(p => p.location === loc)
                return (
                  <tr key={loc}>
                    <td>{loc}</td>
                    <td>{locProducts.length}</td>
                    <td>{locProducts.reduce((s, p) => s + p.quantity, 0)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

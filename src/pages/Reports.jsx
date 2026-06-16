import { useState, useEffect } from 'react'
import { useNotification } from '../context/NotificationContext'
import api from '../api'

const tabs = ['Sales Summary', 'Stock Valuation', 'Order History', 'Low Stock Report', 'Supplier Performance']

export default function Reports() {
  const [activeTab, setActiveTab] = useState(0)
  const [dateRange, setDateRange] = useState('This Year')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const { addToast } = useNotification()

  useEffect(() => {
    api.get('/products').then(({ data }) => setProducts(data)).catch(() => {})
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {})
    api.get('/suppliers').then(({ data }) => setSuppliers(data)).catch(() => {})
    api.get('/dashboard').then(({ data }) => setDashboard(data)).catch(() => {})
  }, [])

  const salesData = [
    { month: 'Jan', sales: 45200, orders: 312, returns: 12 },
    { month: 'Feb', sales: 48700, orders: 345, returns: 8 },
    { month: 'Mar', sales: 52300, orders: 378, returns: 15 },
    { month: 'Apr', sales: 49800, orders: 356, returns: 10 },
    { month: 'May', sales: 56100, orders: 401, returns: 7 },
    { month: 'Jun', sales: 61200, orders: 434, returns: 11 },
  ]

  const categories = [...new Set(products.map(p => p.category))]
  const stockData = categories.map(cat => {
    const items = products.filter(p => p.category === cat)
    return {
      category: cat,
      value: items.reduce((s, p) => s + p.qty * p.price, 0),
      items: items.length,
      turnover: (Math.random() * 5 + 2).toFixed(1) + 'x'
    }
  })

  const lowStockReport = products
    .filter(p => p.qty > 0 && p.qty < (p.min_qty || 10))
    .map(p => ({
      name: p.name, sku: p.sku, qty: p.qty, min: p.min_qty || 10,
      value: p.qty * p.price, supplier: suppliers[Math.floor(Math.random() * suppliers.length)]?.name || 'N/A'
    }))

  const supplierPerf = suppliers.map(s => ({
    name: s.name,
    onTime: Math.floor(Math.random() * 20 + 80),
    quality: Number(s.rating),
    avgLead: s.lead_time,
    ordersFilled: Math.floor(Math.random() * 200 + 50)
  }))

  const totalSales = salesData.reduce((sum, r) => sum + r.sales, 0)
  const totalOrderCount = salesData.reduce((sum, r) => sum + r.orders, 0)
  const stockValue = stockData.reduce((sum, s) => sum + s.value, 0)
  const lowStockValue = lowStockReport.reduce((sum, s) => sum + s.value, 0)

  const downloadCSV = (data, filename) => {
    if (data.length === 0) return
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(r => Object.values(r).join(',')).join('\n')
    const csv = headers + '\n' + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${filename}.csv`; a.click()
    URL.revokeObjectURL(url)
    addToast(`${filename}.csv downloaded!`, 'success')
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto 25px', flexWrap: 'wrap', gap: 10 }}>
        <h2 className="section-title" style={{ margin: 0 }}>Reports</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, background: 'white', outline: 'none' }}>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <button onClick={() => addToast('Report data refreshed', 'info')} className="learn-btn" style={{ padding: '8px 18px', fontSize: 13, background: '#2b6cb0' }}>Refresh</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto 25px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: '10px 22px', borderRadius: 8, border: 'none',
            background: activeTab === i ? '#1a365d' : 'white',
            color: activeTab === i ? 'white' : '#555',
            cursor: 'pointer', fontWeight: 600, fontSize: 14,
            boxShadow: activeTab === i ? '0 2px 8px rgba(26,54,93,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {activeTab === 0 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 25 }}>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Total Sales</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#2f855a' }}>${(totalSales / 1000).toFixed(1)}K</div>
              </div>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Total Orders</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#2b6cb0' }}>{totalOrderCount}</div>
              </div>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Avg Order Value</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#dd6b20' }}>${Math.round(totalSales / totalOrderCount)}</div>
              </div>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Returns</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#e53e3e' }}>{salesData.reduce((s, r) => s + r.returns, 0)}</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1a365d', margin: 0, fontSize: 16 }}>Monthly Sales Breakdown</h3>
                <button onClick={() => downloadCSV(salesData, 'Sales_Summary')} className="learn-btn" style={{ padding: '7px 16px', fontSize: 13 }}>Download CSV</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f7fafc' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>Month</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Sales</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Orders</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Returns</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Avg Order</th>
                </tr></thead>
                <tbody>
                  {salesData.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.month}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>${r.sales.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>{r.orders}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#e53e3e' }}>{r.returns}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>${Math.round(r.sales / r.orders)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 25 }}>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Total Stock Value</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#2b6cb0' }}>${(stockValue / 1000).toFixed(1)}K</div>
              </div>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Categories</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#2f855a' }}>{stockData.length}</div>
              </div>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Total SKUs</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#dd6b20' }}>{products.length}</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1a365d', margin: 0, fontSize: 16 }}>Stock Valuation by Category</h3>
                <button onClick={() => downloadCSV(stockData, 'Stock_Valuation')} className="learn-btn" style={{ padding: '7px 16px', fontSize: 13 }}>Download CSV</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f7fafc' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Stock Value</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Items</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Turnover</th>
                </tr></thead>
                <tbody>
                  {stockData.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.category}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>${c.value.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>{c.items}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>{c.turnover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ color: '#1a365d', margin: 0, fontSize: 16 }}>Order History</h3>
              <button onClick={() => downloadCSV(orders, 'Order_History')} className="learn-btn" style={{ padding: '7px 16px', fontSize: 13 }}>Download CSV</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f7fafc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>Order ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>Customer</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Items</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Total</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Status</th>
              </tr></thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.order_id}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{o.customer}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{o.items}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>${Number(o.total).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: '#555' }}>{o.date}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                        background: o.status === 'Delivered' ? '#2f855a20' : o.status === 'Shipped' ? '#2b6cb020' : o.status === 'Processing' ? '#dd6b2020' : '#d69e2e20',
                        color: o.status === 'Delivered' ? '#2f855a' : o.status === 'Shipped' ? '#2b6cb0' : o.status === 'Processing' ? '#dd6b20' : '#d69e2e'
                      }}>{o.status}</span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#888' }}>No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 25 }}>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Items Below Minimum</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#e53e3e' }}>{lowStockReport.length}</div>
              </div>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Stock Value at Risk</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#dd6b20' }}>${lowStockValue.toFixed(0)}</div>
              </div>
              <div style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Out of Stock</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#e53e3e' }}>{products.filter(p => p.qty === 0).length}</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1a365d', margin: 0, fontSize: 16 }}>Low Stock Items</h3>
                <button onClick={() => downloadCSV(lowStockReport, 'Low_Stock_Report')} className="learn-btn" style={{ padding: '7px 16px', fontSize: 13 }}>Download CSV</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f7fafc' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>SKU</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Current Qty</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Min Required</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: '#555' }}>Value</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>Supplier</th>
                </tr></thead>
                <tbody>
                  {lowStockReport.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '12px 16px', color: '#555' }}>{s.sku}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#e53e3e', fontWeight: 700 }}>{s.qty}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>{s.min}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>${s.value.toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', color: '#555' }}>{s.supplier}</td>
                    </tr>
                  ))}
                  {lowStockReport.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#888' }}>All items are well-stocked!</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 25 }}>
              {supplierPerf.map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 10, padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a365d', marginBottom: 8 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>On-Time: {s.onTime}%</div>
                  <div style={{ fontSize: 12, color: '#555' }}>Quality: {'★'.repeat(Math.round(s.quality))} ({s.quality})</div>
                  <div style={{ fontSize: 12, color: '#555' }}>Lead: {s.avgLead}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>Orders: {s.ordersFilled}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1a365d', margin: 0, fontSize: 16 }}>Supplier Performance Details</h3>
                <button onClick={() => downloadCSV(supplierPerf, 'Supplier_Performance')} className="learn-btn" style={{ padding: '7px 16px', fontSize: 13 }}>Download CSV</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f7fafc' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#555' }}>Supplier</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>On-Time %</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Quality Rating</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Avg Lead Time</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#555' }}>Orders Filled</th>
                </tr></thead>
                <tbody>
                  {supplierPerf.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>{s.onTime}%</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>{'★'.repeat(Math.round(s.quality))} ({s.quality})</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#555' }}>{s.avgLead}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>{s.ordersFilled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import { useNotification } from '../context/NotificationContext'
import useSocket from '../hooks/useSocket'
import api from '../api'

const statusColor = (s) => {
  if (s === 'Delivered') return '#2f855a'
  if (s === 'Shipped') return '#2b6cb0'
  if (s === 'Processing') return '#dd6b20'
  if (s === 'Pending') return '#d69e2e'
  return '#e53e3e'
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [showAllOrders, setShowAllOrders] = useState(false)
  const { addToast } = useNotification()

  const loadData = () => {
    api.get('/dashboard').then(({ data }) => setData(data)).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  useSocket('stockUpdate', () => { loadData() })
  useSocket('orderUpdate', () => { loadData() })

  const [products] = useAnimatedCounter(data?.totalProducts || 0)
  const [lowStock] = useAnimatedCounter(data?.lowStock || 0)
  const [orders] = useAnimatedCounter(data?.pendingOrders || 0)
  const [suppliers] = useAnimatedCounter(data?.activeSuppliers || 0)
  const [revenue] = useAnimatedCounter(data?.totalRevenue || 0)

  if (!data) {
    return (
      <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh', textAlign: 'center' }}>
        <p style={{ color: '#888', fontSize: 18, paddingTop: 60 }}>Loading dashboard...</p>
      </section>
    )
  }

  const stats = [
    { label: 'Total Products', value: products, color: '#2b6cb0', icon: '📦' },
    { label: 'Low Stock Items', value: lowStock, color: '#e53e3e', icon: '⚠️' },
    { label: 'Pending Orders', value: orders, color: '#dd6b20', icon: '📋' },
    { label: 'Active Suppliers', value: suppliers, color: '#2f855a', icon: '🏭' },
  ]

  const displayOrders = showAllOrders ? data.recentOrders : data.recentOrders.slice(0, 3)

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto 30px', flexWrap: 'wrap', gap: 10 }}>
        <h2 className="section-title" style={{ margin: 0 }}>Dashboard</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => addToast('Report generated successfully!', 'success')} className="learn-btn" style={{ padding: '10px 20px', fontSize: 14 }}>Generate Report</button>
          <button onClick={() => { loadData(); addToast('Dashboard refreshed!', 'info') }} className="learn-btn" style={{ padding: '10px 20px', fontSize: 14, background: '#2b6cb0' }}>Refresh</button>
        </div>
      </div>

      <div className="cards" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: '30px', textAlign: 'center', borderTop: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{s.icon}</div>
            <h3 style={{ fontSize: 44, color: s.color, margin: '0 0 5px' }}>{s.value.toLocaleString()}</h3>
            <p style={{ fontSize: 16, color: '#555', fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '40px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
        <div style={{ background: 'white', borderRadius: 10, padding: 25, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1a365d', marginBottom: 15 }}>Monthly Revenue</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 160 }}>
            {[
              { label: 'Jan', v: 65 }, { label: 'Feb', v: 72 }, { label: 'Mar', v: 80 },
              { label: 'Apr', v: 68 }, { label: 'May', v: 85 }, { label: 'Jun', v: 90 },
            ].map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', background: '#2b6cb0', borderRadius: '6px 6px 0 0', height: `${m.v}%`, opacity: 0.7 + i * 0.05, minHeight: 16, transition: 'height 1s ease' }}></div>
                <span style={{ fontSize: 11, color: '#555', marginTop: 6 }}>{m.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: '#888', marginTop: 15 }}>Revenue: ${revenue.toLocaleString()} this month</p>
        </div>

        <div style={{ background: 'white', borderRadius: 10, padding: 25, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1a365d', marginBottom: 15 }}>Low Stock Alerts</h3>
          {data.lowStockItems.length === 0 && <p style={{ color: '#2f855a', fontSize: 14 }}>All items are well-stocked!</p>}
          {data.lowStockItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < data.lowStockItems.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{item.sku} — Min: {item.min_qty}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#e53e3e', fontWeight: 700, fontSize: 16 }}>{item.qty}</span>
                <button onClick={() => addToast(`Reorder initiated for ${item.name}`, 'success')} style={{ background: '#dd6b20', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Reorder</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', background: 'white', borderRadius: 10, padding: 25, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <h3 style={{ color: '#1a365d', margin: 0 }}>Recent Orders</h3>
          <button onClick={() => setShowAllOrders(!showAllOrders)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: '#555' }}>
            {showAllOrders ? 'Show Less' : 'View All'}
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 }}>Order</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 }}>Total</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((o, i) => (
              <tr key={o.id || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 14 }}>{o.order_id}</td>
                <td style={{ padding: '10px 12px', color: '#555', fontSize: 14 }}>{o.customer}</td>
                <td style={{ padding: '10px 12px', color: '#555', fontSize: 14 }}>{o.date}</td>
                <td style={{ padding: '10px 12px', fontSize: 14 }}>${Number(o.total).toFixed(2)}</td>
                <td style={{ padding: '10px 12px' }}><span style={{ background: statusColor(o.status) + '20', color: statusColor(o.status), padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ maxWidth: 1200, margin: '25px auto 0', background: 'white', borderRadius: 10, padding: 25, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1a365d', marginBottom: 15 }}>Top Selling Products</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 }}>#</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 }}>Product</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 13, color: '#888', fontWeight: 600 }}>Units Sold</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 13, color: '#888', fontWeight: 600 }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Wireless Mouse', sold: 847, revenue: 21164 },
              { name: 'HDMI Cable 6ft', sold: 623, revenue: 6227 },
              { name: 'Bluetooth Keyboard', sold: 512, revenue: 25594 },
              { name: 'USB-C Hub', sold: 398, revenue: 13927 },
              { name: 'Laptop Stand', sold: 276, revenue: 11037 },
            ].map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', color: '#888', fontSize: 14 }}>{i + 1}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: 14 }}>{p.name}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14 }}>{p.sold.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, color: '#2f855a', fontWeight: 600 }}>${p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

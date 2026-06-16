import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import { useNotification } from '../context/NotificationContext'

export default function Dashboard() {
  const { addToast } = useNotification()
  const [products] = useAnimatedCounter(1284)
  const [lowStock] = useAnimatedCounter(23)
  const [orders] = useAnimatedCounter(47)
  const [suppliers] = useAnimatedCounter(18)
  const [revenue] = useAnimatedCounter(84750)

  const stats = [
    { label: 'Total Products', value: products, ref: null, color: '#2b6cb0', icon: '📦' },
    { label: 'Low Stock Items', value: lowStock, ref: null, color: '#e53e3e', icon: '⚠️' },
    { label: 'Pending Orders', value: orders, ref: null, color: '#dd6b20', icon: '📋' },
    { label: 'Active Suppliers', value: suppliers, ref: null, color: '#2f855a', icon: '🏭' },
  ]

  const handleCardClick = (label) => {
    addToast(`📊 Navigating to ${label}...`, 'info')
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto 30px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Dashboard</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => addToast('📄 Report generated successfully!', 'success')} className="learn-btn" style={{ padding: '10px 20px', fontSize: 14 }}>
            Generate Report
          </button>
          <button onClick={() => addToast('🔄 Data refreshed!', 'info')} className="learn-btn" style={{ padding: '10px 20px', fontSize: 14, background: '#2b6cb0' }}>
            Refresh Data
          </button>
        </div>
      </div>

      <div className="cards" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {stats.map((s, i) => (
          <div
            className="card"
            key={i}
            onClick={() => handleCardClick(s.label)}
            style={{ padding: '30px', textAlign: 'center', cursor: 'pointer', borderTop: `4px solid ${s.color}` }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>{s.icon}</div>
            <h3 ref={s.ref} style={{ fontSize: 44, color: s.color, margin: '0 0 5px' }}>
              {s.label === 'Revenue' ? '$' : ''}{s.value.toLocaleString()}
            </h3>
            <p style={{ fontSize: 16, color: '#555', fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '40px auto 0', background: 'white', borderRadius: 10, padding: 30, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1a365d', marginBottom: 20 }}>Monthly Revenue</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 200 }}>
          {[
            { label: 'Jan', value: 65 }, { label: 'Feb', value: 72 }, { label: 'Mar', value: 80 },
            { label: 'Apr', value: 68 }, { label: 'May', value: 85 }, { label: 'Jun', value: 90 },
          ].map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%', background: '#2b6cb0', borderRadius: '6px 6px 0 0',
                height: `${m.value}%`, transition: 'height 1s ease',
                opacity: 0.7 + (i * 0.05), minHeight: 20
              }}></div>
              <span style={{ fontSize: 12, color: '#555', marginTop: 8 }}>{m.label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: '#888', marginTop: 15 }}>
          Revenue: ${revenue.toLocaleString()} this month
        </p>
      </div>
    </section>
  )
}

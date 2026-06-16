import { useState } from 'react'
import Modal from '../components/Modal'
import { useNotification } from '../context/NotificationContext'

const initialOrders = [
  { id: '#ORD-101', customer: 'TechCorp', items: 3, total: 124.97, status: 'Shipped', date: '2026-06-14', est: '2026-06-18' },
  { id: '#ORD-102', customer: 'ShopEasy', items: 1, total: 49.99, status: 'Processing', date: '2026-06-15', est: '2026-06-20' },
  { id: '#ORD-103', customer: 'GadgetZone', items: 5, total: 289.95, status: 'Pending', date: '2026-06-15', est: '2026-06-22' },
  { id: '#ORD-104', customer: 'OfficePro', items: 2, total: 69.98, status: 'Delivered', date: '2026-06-10', est: '2026-06-14' },
  { id: '#ORD-105', customer: 'HomeStore', items: 4, total: 159.96, status: 'Cancelled', date: '2026-06-12', est: '-' },
]

const nextStatus = { 'Pending': 'Processing', 'Processing': 'Shipped', 'Shipped': 'Delivered', 'Delivered': 'Delivered', 'Cancelled': 'Cancelled' }

const statusColor = (s) => {
  if (s === 'Delivered') return '#2f855a'
  if (s === 'Shipped') return '#2b6cb0'
  if (s === 'Processing') return '#dd6b20'
  if (s === 'Pending') return '#d69e2e'
  return '#e53e3e'
}

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const { addToast } = useNotification()

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  const updateStatus = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o
      const next = nextStatus[o.status]
      addToast(`📦 Order ${o.id} moved to ${next}`, 'success')
      return { ...o, status: next }
    }))
    setSelected(null)
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Orders</h2>

      <div style={{ maxWidth: 1000, margin: '0 auto 25px', display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: 20, border: filter === f ? 'none' : '2px solid #e2e8f0',
            background: filter === f ? '#1a365d' : 'white', color: filter === f ? 'white' : '#555',
            cursor: 'pointer', fontWeight: 600, fontSize: 14
          }}>{f}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a365d', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Order</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Items</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
                onClick={() => setSelected(o)}>
                <td style={{ padding: '15px', fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: '15px', color: '#555' }}>{o.customer}</td>
                <td style={{ padding: '15px' }}>{o.items}</td>
                <td style={{ padding: '15px' }}>${o.total.toFixed(2)}</td>
                <td style={{ padding: '15px', color: '#555', fontSize: 14 }}>{o.date}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ background: statusColor(o.status) + '20', color: statusColor(o.status),
                    padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{o.status}</span>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  {o.status !== 'Delivered' && o.status !== 'Cancelled' && (
                    <button onClick={(e) => { e.stopPropagation(); updateStatus(o.id) }}
                      style={{ background: '#2b6cb0', color: 'white', border: 'none', borderRadius: 6,
                        padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      Advance
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.id}`}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div><strong>Customer:</strong> <span style={{ color: '#555' }}>{selected.customer}</span></div>
              <div><strong>Items:</strong> <span style={{ color: '#555' }}>{selected.items}</span></div>
              <div><strong>Total:</strong> <span style={{ color: '#2f855a', fontWeight: 700 }}>${selected.total.toFixed(2)}</span></div>
              <div><strong>Status:</strong> <span style={{ color: statusColor(selected.status) }}>{selected.status}</span></div>
              <div><strong>Order Date:</strong> <span style={{ color: '#555' }}>{selected.date}</span></div>
              <div><strong>Est. Delivery:</strong> <span style={{ color: '#555' }}>{selected.est}</span></div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              {selected.status !== 'Delivered' && selected.status !== 'Cancelled' && (
                <button onClick={() => updateStatus(selected.id)} className="learn-btn"
                  style={{ padding: '10px 20px', fontSize: 14 }}>
                  Advance to {nextStatus[selected.status]}
                </button>
              )}
              <button onClick={() => { addToast(`📄 Invoice for ${selected.id} downloaded`, 'success'); setSelected(null) }}
                className="learn-btn" style={{ padding: '10px 20px', fontSize: 14, background: '#2b6cb0' }}>
                Download Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

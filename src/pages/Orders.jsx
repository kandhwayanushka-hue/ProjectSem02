import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
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

const nextStatus = { 'Pending': 'Processing', 'Processing': 'Shipped', 'Shipped': 'Delivered', 'Delivered': 'Delivered', 'Cancelled': 'Cancelled' }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const { addToast } = useNotification()

  const loadOrders = () => {
    api.get('/orders', { params: { status: filter } })
      .then(({ data }) => setOrders(data))
      .catch(() => {})
  }

  useEffect(() => { loadOrders() }, [filter])
  useSocket('orderUpdate', () => { loadOrders() })

  const updateStatus = async (id) => {
    try {
      const { data } = await api.put(`/orders/${id}/advance`)
      addToast(`Order ${data.order_id} moved to ${data.status}`, 'success')
      loadOrders()
    } catch {
      addToast('Failed to update order', 'error')
    }
    setSelected(null)
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

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
              <tr key={o.id || i} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
                onClick={() => setSelected(o)}>
                <td style={{ padding: '15px', fontWeight: 600 }}>{o.order_id}</td>
                <td style={{ padding: '15px', color: '#555' }}>{o.customer}</td>
                <td style={{ padding: '15px' }}>{o.items}</td>
                <td style={{ padding: '15px' }}>${Number(o.total).toFixed(2)}</td>
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
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: '#888' }}>No orders found.</p>}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.order_id}`}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div><strong>Customer:</strong> <span style={{ color: '#555' }}>{selected.customer}</span></div>
              <div><strong>Items:</strong> <span style={{ color: '#555' }}>{selected.items}</span></div>
              <div><strong>Total:</strong> <span style={{ color: '#2f855a', fontWeight: 700 }}>${Number(selected.total).toFixed(2)}</span></div>
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
              <button onClick={() => { addToast(`Invoice for ${selected.order_id} downloaded`, 'success'); setSelected(null) }}
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

import { useState } from 'react'
import Modal from '../components/Modal'
import { useNotification } from '../context/NotificationContext'

const initialProducts = [
  { name: 'Wireless Mouse', sku: 'WM-001', qty: 340, price: 24.99, category: 'Electronics', status: 'In Stock' },
  { name: 'Bluetooth Keyboard', sku: 'BK-002', qty: 215, price: 49.99, category: 'Electronics', status: 'In Stock' },
  { name: 'USB-C Hub', sku: 'UC-003', qty: 128, price: 34.99, category: 'Accessories', status: 'In Stock' },
  { name: 'HDMI Cable 6ft', sku: 'HD-004', qty: 502, price: 9.99, category: 'Cables', status: 'In Stock' },
  { name: 'Laptop Stand', sku: 'LS-005', qty: 89, price: 39.99, category: 'Accessories', status: 'Low Stock' },
  { name: 'Webcam HD', sku: 'WC-006', qty: 23, price: 59.99, category: 'Electronics', status: 'Low Stock' },
  { name: 'Mechanical Keyboard', sku: 'MK-007', qty: 0, price: 89.99, category: 'Electronics', status: 'Out of Stock' },
  { name: 'Monitor 27"', sku: 'MN-008', qty: 45, price: 299.99, category: 'Electronics', status: 'In Stock' },
]

export default function Products() {
  const [products] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const { addToast } = useNotification()

  const categories = ['All', ...new Set(products.map(p => p.category))]

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || p.category === category
    return matchSearch && matchCat
  })

  const statusColor = (status) => {
    if (status === 'In Stock') return '#2f855a'
    if (status === 'Low Stock') return '#dd6b20'
    return '#e53e3e'
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Products</h2>

      <div style={{ maxWidth: 1000, margin: '0 auto 25px', display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search products or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 250, padding: '12px 16px', borderRadius: 8,
            border: '2px solid #e2e8f0', fontSize: 15, outline: 'none'
          }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            padding: '12px 16px', borderRadius: 8, border: '2px solid #e2e8f0',
            fontSize: 15, background: 'white', outline: 'none', cursor: 'pointer'
          }}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => addToast('➕ New product added successfully!', 'success')}
          className="learn-btn" style={{ padding: '12px 24px', fontSize: 14 }}
        >+ Add Product</button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a365d', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>SKU</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Qty</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
                onClick={() => setSelected(p)}
              >
                <td style={{ padding: '15px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '15px', color: '#555' }}>{p.sku}</td>
                <td style={{ padding: '15px' }}>{p.category}</td>
                <td style={{ padding: '15px', color: p.qty < 30 ? '#e53e3e' : '#333' }}>{p.qty}</td>
                <td style={{ padding: '15px' }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    background: statusColor(p.status) + '20',
                    color: statusColor(p.status),
                    padding: '4px 12px', borderRadius: 20,
                    fontSize: 13, fontWeight: 600
                  }}>{p.status}</span>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={(e) => { e.stopPropagation(); addToast(`✏️ Editing ${p.name}...`, 'info') }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); addToast(`🗑️ ${p.name} deleted`, 'error') }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: 40, color: '#888' }}>No products found.</p>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div><strong>SKU:</strong> <span style={{ color: '#555' }}>{selected.sku}</span></div>
              <div><strong>Category:</strong> <span style={{ color: '#555' }}>{selected.category}</span></div>
              <div><strong>Quantity:</strong> <span style={{ color: selected.qty < 30 ? '#e53e3e' : '#2f855a' }}>{selected.qty}</span></div>
              <div><strong>Price:</strong> <span style={{ color: '#555' }}>${selected.price.toFixed(2)}</span></div>
              <div><strong>Status:</strong> <span style={{ color: statusColor(selected.status) }}>{selected.status}</span></div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={() => { addToast(`📝 Order more ${selected.name}`, 'info'); setSelected(null) }}
                className="learn-btn" style={{ padding: '10px 20px', fontSize: 14 }}>Reorder</button>
              <button onClick={() => { addToast(`📄 Exporting ${selected.name} details`, 'info'); setSelected(null) }}
                className="learn-btn" style={{ padding: '10px 20px', fontSize: 14, background: '#2b6cb0' }}>Export</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

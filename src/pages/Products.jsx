import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import BarcodeScanner from '../components/BarcodeScanner'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editProd, setEditProd] = useState(null)
  const [form, setForm] = useState({ name: '', sku: '', qty: 0, price: 0, category: '', min_qty: 10 })
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { addToast } = useNotification()

  const loadProducts = () => {
    api.get('/products', { params: { search, category } })
      .then(({ data }) => setProducts(data))
      .catch(() => addToast('Failed to load products', 'error'))
  }

  useEffect(() => { loadProducts() }, [])

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

  const openAdd = () => {
    setEditProd(null)
    setForm({ name: '', sku: '', qty: 0, price: 0, category: '', min_qty: 10 })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditProd(p)
    setForm({ name: p.name, sku: p.sku, qty: p.qty, price: p.price, category: p.category, min_qty: p.min_qty })
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editProd) {
        await api.put(`/products/${editProd.id}`, form)
        addToast(`Updated ${form.name}`, 'success')
      } else {
        await api.post('/products', form)
        addToast(`Added ${form.name}`, 'success')
      }
      setShowForm(false)
      loadProducts()
    } catch (err) {
      addToast(err.response?.data?.error || 'Operation failed', 'error')
    }
  }

  const deleteProd = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return
    try {
      await api.delete(`/products/${p.id}`)
      addToast(`Deleted ${p.name}`, 'success')
      loadProducts()
    } catch {
      addToast('Delete failed', 'error')
    }
  }

  const handleScan = (code) => {
    setShowScanner(false)
    if (code) {
      setSearch(code)
      addToast(`Scanned: ${code}`, 'info')
    } else {
      addToast('Could not read barcode', 'error')
    }
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Products</h2>

      <div style={{ maxWidth: 1000, margin: '0 auto 25px', display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: '12px 16px', borderRadius: 8,
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
        <button onClick={() => setShowScanner(true)}
          style={{
            padding: '12px 20px', borderRadius: 8, border: '2px solid #2b6cb0',
            background: 'white', color: '#2b6cb0', cursor: 'pointer', fontWeight: 600, fontSize: 14
          }}>Scan Barcode</button>
        {isAdmin && <button onClick={openAdd} className="learn-btn" style={{ padding: '12px 24px', fontSize: 14 }}>+ Add Product</button>}
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
              <tr key={p.id || i} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
                onClick={() => setSelected(p)}
              >
                <td style={{ padding: '15px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '15px', color: '#555' }}>{p.sku}</td>
                <td style={{ padding: '15px' }}>{p.category}</td>
                <td style={{ padding: '15px', color: p.qty < p.min_qty ? '#e53e3e' : '#333' }}>{p.qty}</td>
                <td style={{ padding: '15px' }}>${Number(p.price).toFixed(2)}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    background: statusColor(p.status || 'In Stock') + '20',
                    color: statusColor(p.status || 'In Stock'),
                    padding: '4px 12px', borderRadius: 20,
                    fontSize: 13, fontWeight: 600
                  }}>{p.status || 'In Stock'}</span>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(p) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✏️</button>
                  {isAdmin && (
                    <button onClick={(e) => { e.stopPropagation(); deleteProd(p) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>🗑️</button>
                  )}
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
              <div><strong>Quantity:</strong> <span style={{ color: selected.qty < selected.min_qty ? '#e53e3e' : '#2f855a' }}>{selected.qty}</span></div>
              <div><strong>Price:</strong> <span style={{ color: '#555' }}>${Number(selected.price).toFixed(2)}</span></div>
              <div><strong>Min Stock:</strong> <span style={{ color: '#555' }}>{selected.min_qty}</span></div>
              <div><strong>Status:</strong> <span style={{ color: statusColor(selected.status) }}>{selected.status}</span></div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={() => { addToast(`Reorder initiated for ${selected.name}`, 'success'); setSelected(null) }}
                className="learn-btn" style={{ padding: '10px 20px', fontSize: 14 }}>Reorder</button>
              <button onClick={() => { addToast(`Exported ${selected.name} details`, 'success'); setSelected(null) }}
                className="learn-btn" style={{ padding: '10px 20px', fontSize: 14, background: '#2b6cb0' }}>Export</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editProd ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Product Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>SKU</label>
              <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Quantity</label>
                <input type="number" min="0" value={form.qty} onChange={e => setForm({ ...form, qty: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Price ($)</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Category</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Min Stock Level</label>
              <input type="number" min="0" value={form.min_qty} onChange={e => setForm({ ...form, min_qty: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{
              padding: '10px 24px', borderRadius: 25, border: '1px solid #e2e8f0',
              background: 'white', cursor: 'pointer', fontSize: 14
            }}>Cancel</button>
            <button type="submit" className="learn-btn" style={{ padding: '10px 24px', fontSize: 14 }}>
              {editProd ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>

      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </section>
  )
}

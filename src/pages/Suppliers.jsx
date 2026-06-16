import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editSupplier, setEditSupplier] = useState(null)
  const [form, setForm] = useState({ name: '', contact: '', email: '', phone: '', lead_time: '', rating: 5, status: 'Active' })
  const [errors, setErrors] = useState({})
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { addToast } = useNotification()

  const loadSuppliers = () => {
    api.get('/suppliers').then(({ data }) => setSuppliers(data)).catch(() => {})
  }

  useEffect(() => { loadSuppliers() }, [])

  const openAdd = () => {
    setEditSupplier(null)
    setForm({ name: '', contact: '', email: '', phone: '', lead_time: '', rating: 5, status: 'Active' })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (s) => {
    setEditSupplier(s)
    setForm({ name: s.name, contact: s.contact, email: s.email, phone: s.phone, lead_time: s.lead_time, rating: s.rating, status: s.status })
    setErrors({})
    setShowModal(true)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Supplier name is required'
    if (!form.contact.trim()) errs.contact = 'Contact person is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.lead_time.trim()) errs.lead_time = 'Lead time is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      if (editSupplier) {
        await api.put(`/suppliers/${editSupplier.id}`, form)
        addToast(`${form.name} updated!`, 'success')
      } else {
        await api.post('/suppliers', form)
        addToast(`${form.name} added!`, 'success')
      }
      setShowModal(false)
      loadSuppliers()
    } catch {
      addToast('Operation failed', 'error')
    }
  }

  const deleteSupplier = async (s) => {
    if (!window.confirm(`Delete ${s.name}?`)) return
    try {
      await api.delete(`/suppliers/${s.id}`)
      addToast(`${s.name} removed`, 'success')
      loadSuppliers()
    } catch {
      addToast('Delete failed', 'error')
    }
  }

  const toggleStatus = async (id) => {
    const s = suppliers.find(x => x.id === id)
    if (!s) return
    const newStatus = s.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await api.put(`/suppliers/${id}`, { ...s, status: newStatus })
      addToast(`${s.name} is now ${newStatus}`, 'info')
      loadSuppliers()
    } catch {
      addToast('Status change failed', 'error')
    }
  }

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    return '★'.repeat(full) + '☆'.repeat(5 - full)
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto 30px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Suppliers</h2>
        {isAdmin && <button onClick={openAdd} className="learn-btn" style={{ padding: '12px 24px', fontSize: 14 }}>+ Add Supplier</button>}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 25, flexWrap: 'wrap', justifyContent: 'center' }}>
        {suppliers.map(s => (
          <div key={s.id} className="card" style={{
            padding: '25px', textAlign: 'left', width: 300, position: 'relative',
            opacity: s.status === 'Inactive' ? 0.6 : 1
          }}>
            <div style={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✏️</button>
              {isAdmin && <button onClick={() => deleteSupplier(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>🗑️</button>}
            </div>
            <h3 style={{ color: '#1a365d', margin: '0 0 12px', fontSize: 18 }}>{s.name}</h3>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}> {s.contact}</p>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}> {s.email}</p>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}> {s.phone}</p>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}> Lead Time: {s.lead_time}</p>
            <p style={{ margin: '4px 0', fontSize: 14 }}> {renderStars(s.rating)} <span style={{ color: '#555' }}>({s.rating})</span></p>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                background: s.status === 'Active' ? '#2f855a20' : '#e53e3e20',
                color: s.status === 'Active' ? '#2f855a' : '#e53e3e'
              }}>{s.status}</span>
              <button onClick={() => toggleStatus(s.id)} style={{
                background: 'none', border: '1px solid #e2e8f0', borderRadius: 6,
                padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#555'
              }}>{s.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editSupplier ? 'Edit Supplier' : 'Add New Supplier'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { label: 'Supplier Name', key: 'name', type: 'text' },
              { label: 'Contact Person', key: 'contact', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Phone', key: 'phone', type: 'text' },
              { label: 'Lead Time (e.g. 5 days)', key: 'lead_time', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 6,
                    border: errors[f.key] ? '2px solid #e53e3e' : '1px solid #e2e8f0',
                    fontSize: 14, outline: 'none'
                  }}
                />
                {errors[f.key] && <span style={{ color: '#e53e3e', fontSize: 12 }}>{errors[f.key]}</span>}
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Rating (1-5)</label>
              <input type="range" min="1" max="5" step="0.1" value={form.rating}
                onChange={e => setForm({ ...form, rating: e.target.value })} style={{ width: '100%' }} />
              <span style={{ fontSize: 20 }}>{renderStars(Number(form.rating))}</span>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowModal(false)} style={{
              padding: '10px 24px', borderRadius: 25, border: '1px solid #e2e8f0',
              background: 'white', cursor: 'pointer', fontSize: 14
            }}>Cancel</button>
            <button type="submit" className="learn-btn" style={{ padding: '10px 24px', fontSize: 14 }}>
              {editSupplier ? 'Update Supplier' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

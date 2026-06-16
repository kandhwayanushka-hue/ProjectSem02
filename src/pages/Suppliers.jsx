import { useState } from 'react'
import Modal from '../components/Modal'
import { useNotification } from '../context/NotificationContext'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'GlobalTech Supplies', contact: 'Ravi Kumar', email: 'ravi@globaltech.com', phone: '+91-9876543210', leadTime: '5 days', rating: 4.8, status: 'Active' },
    { id: 2, name: 'Prime Components', contact: 'Sneha Patel', email: 'sneha@primecomp.in', phone: '+91-9876543211', leadTime: '3 days', rating: 4.5, status: 'Active' },
    { id: 3, name: 'NextGen Parts', contact: 'Ankit Sharma', email: 'ankit@nextgen.in', phone: '+91-9876543212', leadTime: '7 days', rating: 4.2, status: 'Active' },
    { id: 4, name: 'Apex Logistics', contact: 'Priya Singh', email: 'priya@apexlog.com', phone: '+91-9876543213', leadTime: '4 days', rating: 4.9, status: 'Active' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editSupplier, setEditSupplier] = useState(null)
  const { addToast } = useNotification()

  const [form, setForm] = useState({ name: '', contact: '', email: '', phone: '', leadTime: '', rating: 5, status: 'Active' })
  const [errors, setErrors] = useState({})

  const openAdd = () => {
    setEditSupplier(null)
    setForm({ name: '', contact: '', email: '', phone: '', leadTime: '', rating: 5, status: 'Active' })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (s) => {
    setEditSupplier(s)
    setForm({ name: s.name, contact: s.contact, email: s.email, phone: s.phone, leadTime: s.leadTime, rating: s.rating, status: s.status })
    setErrors({})
    setShowModal(true)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Supplier name is required'
    if (!form.contact.trim()) errs.contact = 'Contact person is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.leadTime.trim()) errs.leadTime = 'Lead time is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    if (editSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editSupplier.id ? { ...s, ...form, rating: Number(form.rating) } : s))
      addToast(`✏️ ${form.name} updated successfully!`, 'success')
    } else {
      const newSupplier = { id: Date.now(), ...form, rating: Number(form.rating) }
      setSuppliers(prev => [...prev, newSupplier])
      addToast(`✅ ${form.name} added as a new supplier!`, 'success')
    }
    setShowModal(false)
  }

  const deleteSupplier = (s) => {
    if (window.confirm(`Delete ${s.name}?`)) {
      setSuppliers(prev => prev.filter(x => x.id !== s.id))
      addToast(`🗑️ ${s.name} removed`, 'error')
    }
  }

  const toggleStatus = (id) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id !== id) return s
      const newStatus = s.status === 'Active' ? 'Inactive' : 'Active'
      addToast(`🔄 ${s.name} is now ${newStatus}`, 'info')
      return { ...s, status: newStatus }
    }))
  }

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    return '★'.repeat(full) + '☆'.repeat(5 - full)
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto 30px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Suppliers</h2>
        <button onClick={openAdd} className="learn-btn" style={{ padding: '12px 24px', fontSize: 14 }}>
          + Add Supplier
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 25, flexWrap: 'wrap', justifyContent: 'center' }}>
        {suppliers.map(s => (
          <div key={s.id} className="card" style={{
            padding: '25px', textAlign: 'left', width: 300, position: 'relative',
            opacity: s.status === 'Inactive' ? 0.6 : 1
          }}>
            <div style={{
              position: 'absolute', top: 15, right: 15, display: 'flex', gap: 8
            }}>
              <button onClick={() => openEdit(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✏️</button>
              <button onClick={() => deleteSupplier(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
            </div>
            <h3 style={{ color: '#1a365d', margin: '0 0 12px', fontSize: 18 }}>{s.name}</h3>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}>👤 {s.contact}</p>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}>📧 {s.email}</p>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}>📞 {s.phone}</p>
            <p style={{ margin: '4px 0', fontSize: 14, color: '#555' }}>⏱ Lead Time: {s.leadTime}</p>
            <p style={{ margin: '4px 0', fontSize: 14 }}>⭐ {renderStars(s.rating)} <span style={{ color: '#555' }}>({s.rating})</span></p>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                background: s.status === 'Active' ? '#2f855a20' : '#e53e3e20',
                color: s.status === 'Active' ? '#2f855a' : '#e53e3e'
              }}>{s.status}</span>
              <button onClick={() => toggleStatus(s.id)} style={{
                background: 'none', border: '1px solid #e2e8f0', borderRadius: 6,
                padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#555'
              }}>
                {s.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
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
              { label: 'Lead Time (e.g. 5 days)', key: 'leadTime', type: 'text' },
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
              <input
                type="range" min="1" max="5" step="0.1"
                value={form.rating}
                onChange={e => setForm({ ...form, rating: e.target.value })}
                style={{ width: '100%' }}
              />
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

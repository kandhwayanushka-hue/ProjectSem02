import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import useSocket from '../hooks/useSocket'
import api from '../api'

export default function Warehouse() {
  const [warehouses, setWarehouses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editWh, setEditWh] = useState(null)
  const [transferFrom, setTransferFrom] = useState(null)
  const [form, setForm] = useState({ name: '', location: '', capacity: 50, manager: '', stock_items: 0, status: 'Active' })
  const [errors, setErrors] = useState({})
  const [transferModal, setTransferModal] = useState(false)
  const [transfer, setTransfer] = useState({ fromId: '', toId: '', itemName: '', qty: '' })
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { addToast } = useNotification()

  const loadWarehouses = () => {
    api.get('/warehouses').then(({ data }) => setWarehouses(data)).catch(() => {})
  }

  useEffect(() => { loadWarehouses() }, [])
  useSocket('stockUpdate', () => { loadWarehouses() })

  const openAdd = () => {
    setEditWh(null)
    setForm({ name: '', location: '', capacity: 50, manager: '', stock_items: 0, status: 'Active' })
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (w) => {
    setEditWh(w)
    setForm({ name: w.name, location: w.location, capacity: w.capacity, manager: w.manager, stock_items: w.stock_items, status: w.status })
    setErrors({})
    setShowModal(true)
  }

  const openTransfer = (w) => {
    setTransferFrom(w)
    setTransfer({ fromId: w.id, toId: '', itemName: '', qty: '' })
    setTransferModal(true)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    if (!form.manager.trim()) errs.manager = 'Manager name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      if (editWh) {
        await api.put(`/warehouses/${editWh.id}`, form)
        addToast(`${form.name} updated`, 'success')
      } else {
        await api.post('/warehouses', form)
        addToast(`${form.name} added`, 'success')
      }
      setShowModal(false)
      loadWarehouses()
    } catch {
      addToast('Operation failed', 'error')
    }
  }

  const deleteWh = async (w) => {
    if (!window.confirm(`Delete ${w.name}?`)) return
    try {
      await api.delete(`/warehouses/${w.id}`)
      addToast(`${w.name} removed`, 'success')
      loadWarehouses()
    } catch {
      addToast('Delete failed', 'error')
    }
  }

  const toggleStatus = async (id) => {
    const w = warehouses.find(x => x.id === id)
    if (!w) return
    const ns = w.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await api.put(`/warehouses/${id}`, { ...w, status: ns })
      addToast(`${w.name} is now ${ns}`, 'info')
      loadWarehouses()
    } catch {
      addToast('Status change failed', 'error')
    }
  }

  const handleTransfer = async (e) => {
    e.preventDefault()
    if (transfer.fromId === transfer.toId) {
      addToast('Cannot transfer to the same warehouse', 'error')
      return
    }
    try {
      await api.post('/warehouses/transfer', {
        fromId: Number(transfer.fromId),
        toId: Number(transfer.toId),
        itemName: transfer.itemName,
        qty: Number(transfer.qty)
      })
      addToast(`Transfer complete!`, 'success')
      setTransferModal(false)
      loadWarehouses()
    } catch (err) {
      addToast(err.response?.data?.error || 'Transfer failed', 'error')
    }
  }

  const capacityColor = (c) => {
    if (c >= 85) return '#e53e3e'
    if (c >= 60) return '#dd6b20'
    return '#2f855a'
  }

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto 30px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Warehouses</h2>
        {isAdmin && <button onClick={openAdd} className="learn-btn" style={{ padding: '12px 24px', fontSize: 14 }}>+ Add Warehouse</button>}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 25, flexWrap: 'wrap', justifyContent: 'center' }}>
        {warehouses.map(w => {
          const color = capacityColor(w.capacity)
          return (
            <div key={w.id} className="card" style={{
              padding: '25px', textAlign: 'left', width: 320, position: 'relative',
              opacity: w.status === 'Inactive' ? 0.6 : 1
            }}>
              <div style={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(w)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2 }}>✏️</button>
                {isAdmin && <button onClick={() => deleteWh(w)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2 }}>🗑️</button>}
              </div>
              <h3 style={{ color: '#1a365d', margin: '0 0 6px', fontSize: 18 }}>{w.name}</h3>
              <p style={{ fontSize: 13, color: '#718096', margin: '0 0 15px' }}>📍 {w.location}</p>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: '#555' }}>Capacity</span>
                  <span style={{ color, fontWeight: 700 }}>{w.capacity}%</span>
                </div>
                <div style={{ height: 10, background: '#edf2f7', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${w.capacity}%`, height: '100%', background: color, borderRadius: 5, transition: 'width 0.8s ease' }}></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, marginBottom: 12 }}>
                <div><span style={{ color: '#888' }}>Manager:</span><br /><span style={{ fontWeight: 600 }}>{w.manager}</span></div>
                <div><span style={{ color: '#888' }}>Stock Items:</span><br /><span style={{ fontWeight: 600 }}>{w.stock_items?.toLocaleString()}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                  background: w.status === 'Active' ? '#2f855a20' : '#e53e3e20',
                  color: w.status === 'Active' ? '#2f855a' : '#e53e3e'
                }}>{w.status}</span>
                <button onClick={() => toggleStatus(w.id)} style={{
                  background: 'none', border: '1px solid #e2e8f0', borderRadius: 6,
                  padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#555'
                }}>{w.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => openTransfer(w)} style={{
                  background: '#2b6cb0', color: 'white', border: 'none', borderRadius: 6,
                  padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600
                }}>Transfer</button>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editWh ? 'Edit Warehouse' : 'Add Warehouse'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { label: 'Warehouse Name', key: 'name' },
              { label: 'Location', key: 'location' },
              { label: 'Manager Name', key: 'manager' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 6,
                    border: errors[f.key] ? '2px solid #e53e3e' : '1px solid #e2e8f0',
                    fontSize: 14, outline: 'none'
                  }} />
                {errors[f.key] && <span style={{ color: '#e53e3e', fontSize: 12 }}>{errors[f.key]}</span>}
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Capacity % ({form.capacity}%)</label>
              <input type="range" min="0" max="100" value={form.capacity}
                onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Stock Items Count</label>
              <input type="number" min="0" value={form.stock_items}
                onChange={e => setForm({ ...form, stock_items: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowModal(false)} style={{
              padding: '10px 24px', borderRadius: 25, border: '1px solid #e2e8f0',
              background: 'white', cursor: 'pointer', fontSize: 14
            }}>Cancel</button>
            <button type="submit" className="learn-btn" style={{ padding: '10px 24px', fontSize: 14 }}>
              {editWh ? 'Update' : 'Add Warehouse'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={transferModal} onClose={() => setTransferModal(false)} title={`Transfer Stock from ${transferFrom?.name || ''}`}>
        <form onSubmit={handleTransfer}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>From</label>
              <input value={transferFrom?.name || ''} disabled style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #e2e8f0', fontSize: 14, background: '#f7fafc'
              }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>To Warehouse</label>
              <select value={transfer.toId} onChange={e => setTransfer({ ...transfer, toId: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', background: 'white' }}>
                <option value="">Select destination...</option>
                {warehouses.filter(w => w.id !== transfer.fromId).map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.location})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Item Name</label>
              <input value={transfer.itemName} onChange={e => setTransfer({ ...transfer, itemName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>Quantity</label>
              <input type="number" min="1" value={transfer.qty} onChange={e => setTransfer({ ...transfer, qty: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setTransferModal(false)} style={{
              padding: '10px 24px', borderRadius: 25, border: '1px solid #e2e8f0',
              background: 'white', cursor: 'pointer', fontSize: 14
            }}>Cancel</button>
            <button type="submit" className="learn-btn" style={{ padding: '10px 24px', fontSize: 14 }}>Transfer</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

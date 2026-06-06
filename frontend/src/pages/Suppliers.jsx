import { useState, useEffect } from 'react'

export default function Suppliers() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('suppliers')
    if (saved) setSuppliers(JSON.parse(saved))
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) setProducts(JSON.parse(savedProducts))
  }, [])

  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers))
  }, [suppliers])

  function addSupplier(e) {
    e.preventDefault()
    if (!name) return
    setSuppliers([...suppliers, { id: Date.now(), name, contact, email }])
    setName(''); setContact(''); setEmail('')
  }

  function deleteSupplier(id) {
    const used = products.filter(p => p.supplier === suppliers.find(s => s.id === id)?.name)
    if (used.length > 0 && !confirm(`${used.length} product(s) use this supplier. Delete anyway?`)) return
    setSuppliers(suppliers.filter(s => s.id !== id))
  }

  return (
    <div>
      <h1>Suppliers</h1>

      <form onSubmit={addSupplier}>
        <input placeholder="Supplier Name*" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Add Supplier</button>
      </form>

      <table>
        <thead><tr><th>Name</th><th>Contact</th><th>Email</th><th>Products Supplied</th><th>Action</th></tr></thead>
        <tbody>
          {suppliers.map(s => {
            const suppliedCount = products.filter(p => p.supplier === s.name).length
            return (
              <tr key={s.id}>
                <td>{s.name}</td><td>{s.contact}</td><td>{s.email}</td>
                <td>{suppliedCount}</td>
                <td><button className="btn-delete" onClick={() => deleteSupplier(s.id)}>Delete</button></td>
              </tr>
            )
          })}
          {suppliers.length === 0 && <tr><td colSpan={5} className="text-muted">No suppliers yet</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

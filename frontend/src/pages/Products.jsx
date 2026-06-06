import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('products')
    if (saved) setProducts(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  function handleSubmit(e) {
    e.preventDefault()
    if (name === '' || quantity === '') return

    if (editingId) {
      setProducts(products.map(p =>
        p.id === editingId
          ? { ...p, name, category, quantity: Number(quantity), price: Number(price) }
          : p
      ))
      setEditingId(null)
    } else {
      setProducts([...products, {
        id: Date.now(), name, category,
        quantity: Number(quantity), price: Number(price)
      }])
    }
    setName(''); setCategory(''); setQuantity(''); setPrice('')
  }

  function editProduct(p) {
    setName(p.name); setCategory(p.category)
    setQuantity(String(p.quantity)); setPrice(String(p.price))
    setEditingId(p.id)
  }

  function deleteProduct(id) {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div>
      <h1>Products</h1>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Qty" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <button type="submit">{editingId ? 'Update' : 'Add Product'}</button>
      </form>

      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Qty</th><th>Price</th><th>Action</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.category}</td><td>{p.quantity}</td>
              <td>${p.price}</td>
              <td>
                <button className="btn-edit" onClick={() => editProduct(p)}>Edit</button>
                <button className="btn-delete" onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

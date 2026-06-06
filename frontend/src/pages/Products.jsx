import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
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

    const product = {
      id: editingId || Date.now(),
      name, category,
      quantity: Number(quantity),
      price: Number(price),
      image: imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
    }

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? product : p))
      setEditingId(null)
    } else {
      setProducts([...products, product])
    }
    setName(''); setCategory(''); setQuantity(''); setPrice(''); setImageUrl('')
  }

  function editProduct(p) {
    setName(p.name); setCategory(p.category)
    setQuantity(String(p.quantity)); setPrice(String(p.price))
    setImageUrl(p.image || '')
    setEditingId(p.id)
  }

  function deleteProduct(id) {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div>
      <h1>Products</h1>

      <form onSubmit={handleSubmit}>
        <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <input placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <button type="submit">{editingId ? 'Update' : 'Add Product'}</button>
      </form>

      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-img">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="product-info">
              <h3>{p.name}</h3>
              <p className="product-category">{p.category}</p>
              <p className="product-price">${p.price}</p>
              <p className="product-qty">Qty: {p.quantity}</p>
              {p.quantity < 5 && <span className="badge-low">Low Stock</span>}
            </div>
            <div className="product-actions">
              <button className="btn-edit" onClick={() => editProduct(p)}>Edit</button>
              <button className="btn-delete" onClick={() => deleteProduct(p.id)}>Delete</button>
            </div>
            <div className="product-qr">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=Product:${p.name}, Price:$${p.price}`} alt="QR" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

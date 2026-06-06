import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [barcode, setBarcode] = useState('')
  const [supplier, setSupplier] = useState('')
  const [expiry, setExpiry] = useState('')
  const [location, setLocation] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

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
      name, category, quantity: Number(quantity), price: Number(price),
      image: imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      barcode: barcode || `BAR-${Date.now()}`,
      supplier, expiry, location
    }

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? product : p))
      setEditingId(null)
    } else {
      setProducts([...products, product])
    }
    setName(''); setCategory(''); setQuantity(''); setPrice('')
    setImageUrl(''); setBarcode(''); setSupplier(''); setExpiry(''); setLocation('')
  }

  function editProduct(p) {
    setName(p.name); setCategory(p.category)
    setQuantity(String(p.quantity)); setPrice(String(p.price))
    setImageUrl(p.image || ''); setBarcode(p.barcode || '')
    setSupplier(p.supplier || ''); setExpiry(p.expiry || ''); setLocation(p.location || '')
    setEditingId(p.id)
  }

  function deleteProduct(id) {
    setProducts(products.filter(p => p.id !== id))
  }

  function exportCSV() {
    const rows = [['Name', 'Category', 'Qty', 'Price', 'Barcode', 'Supplier', 'Expiry', 'Location']]
    products.forEach(p => rows.push([p.name, p.category, p.quantity, p.price, p.barcode, p.supplier, p.expiry, p.location]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'products.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const today = new Date()
  const nearExpiry = products.filter(p => p.expiry && new Date(p.expiry) - today < 7 * 24 * 60 * 60 * 1000 && new Date(p.expiry) > today)
  const expired = products.filter(p => p.expiry && new Date(p.expiry) < today)
  const lowStockForPO = products.filter(p => p.quantity < 5)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search) ||
    p.supplier?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <button onClick={exportCSV} style={{ background: '#2d2b4a' }}>Export CSV</button>
      </div>

      {lowStockForPO.length > 0 && (
        <div className="alert-box">
          <strong>🔄 Auto-PO Suggested:</strong> {lowStockForPO.length} products below reorder level.
          <button className="btn-edit" style={{ marginLeft: 12 }} onClick={() => {
            const po = lowStockForPO.map(p => `${p.name} (Qty: ${p.quantity})`).join('\n')
            alert(`Suggested Purchase Order:\n\n${po}\n\nOpen Orders page to place orders.`)
          }}>View Suggested PO</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input placeholder="Name*" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Qty*" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <input placeholder="Barcode" value={barcode} onChange={e => setBarcode(e.target.value)} />
        <input placeholder="Supplier" value={supplier} onChange={e => setSupplier(e.target.value)} />
        <input placeholder="Expiry Date" type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
        <input placeholder="Location/Warehouse" value={location} onChange={e => setLocation(e.target.value)} />
        <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <button type="submit">{editingId ? 'Update' : 'Add Product'}</button>
      </form>

      <input placeholder="Search by name, barcode, or supplier..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', marginBottom: 20, padding: 12, borderRadius: 8, border: '1px solid #d4cfc8', background: '#faf7f2' }} />

      {expired.length > 0 && (
        <div className="alert-box" style={{ borderLeft: '4px solid #b8737a', marginBottom: 16 }}>
          <strong>⚠️ Expired Products:</strong> {expired.length} item(s) past expiry date.
        </div>
      )}

      <div className="product-grid">
        {filtered.map(p => {
          const isExpired = p.expiry && new Date(p.expiry) < today
          const isNearExpiry = p.expiry && !isExpired && new Date(p.expiry) - today < 7 * 24 * 60 * 60 * 1000
          return (
            <div key={p.id} className="product-card" style={{ borderColor: isExpired ? '#b8737a' : isNearExpiry ? '#c4a35a' : '' }}>
              <div className="product-img">
                <img src={p.image} alt={p.name} />
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="product-category">{p.category} {p.location && `| ${p.location}`}</p>
                <p className="product-price">${p.price}</p>
                <p className="product-qty">Qty: {p.quantity}</p>
                {p.barcode && <p className="product-qty">Barcode: {p.barcode}</p>}
                {p.supplier && <p className="product-qty">Supplier: {p.supplier}</p>}
                {p.expiry && <p className="product-qty">Expiry: {p.expiry} {isExpired ? '⛔' : isNearExpiry ? '⚠️' : '✅'}</p>}
                {p.quantity < 5 && <span className="badge-low">Low Stock</span>}
                {isExpired && <span className="badge-low" style={{ background: '#b8737a', color: 'white', borderColor: '#b8737a', marginLeft: 6 }}>Expired</span>}
                {isNearExpiry && <span className="badge-low" style={{ background: '#c4a35a', color: 'white', borderColor: '#c4a35a', marginLeft: 6 }}>Near Expiry</span>}
              </div>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => editProduct(p)}>Edit</button>
                <button className="btn-delete" onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
              <div className="product-qr">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${p.barcode || p.id}`} alt="QR" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

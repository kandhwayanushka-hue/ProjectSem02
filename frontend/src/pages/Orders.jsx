import { useState, useEffect } from 'react'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [productName, setProductName] = useState('')
  const [qty, setQty] = useState('')
  const [type, setType] = useState('PURCHASE')

  useEffect(() => {
    const saved = localStorage.getItem('orders')
    if (saved) setOrders(JSON.parse(saved))
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) setProducts(JSON.parse(savedProducts))
  }, [])

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  function addOrder(e) {
    e.preventDefault()
    if (!productName || !qty) return

    const newOrder = {
      id: Date.now(), productName,
      quantity: Number(qty), type,
      date: new Date().toLocaleDateString()
    }

    const updatedProducts = products.map(p => {
      if (p.name === productName) {
        if (type === 'PURCHASE') return { ...p, quantity: p.quantity + Number(qty) }
        if (type === 'SALES') return { ...p, quantity: p.quantity - Number(qty) }
      }
      return p
    })
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))

    setOrders([...orders, newOrder])
    setProductName('')
    setQty('')
  }

  return (
    <div>
      <h1>Orders</h1>

      <form onSubmit={addOrder}>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="PURCHASE">Purchase (Stock In)</option>
          <option value="SALES">Sales (Stock Out)</option>
        </select>
        <input placeholder="Product Name" value={productName} onChange={e => setProductName(e.target.value)} />
        <input placeholder="Quantity" type="number" value={qty} onChange={e => setQty(e.target.value)} />
        <button type="submit">Add Order</button>
      </form>

      <table>
        <thead><tr><th>Product</th><th>Qty</th><th>Type</th><th>Date</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.productName}</td><td>{o.quantity}</td>
              <td>{o.type}</td><td>{o.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

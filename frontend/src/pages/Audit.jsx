import { useState, useEffect } from 'react'

export default function Audit() {
  const [products, setProducts] = useState([])
  const [scanInput, setScanInput] = useState('')
  const [counts, setCounts] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('products')
    if (saved) setProducts(JSON.parse(saved))
  }, [])

  function handleScan() {
    if (!scanInput) return
    const found = products.find(p =>
      p.barcode === scanInput || p.name.toLowerCase() === scanInput.toLowerCase()
    )
    if (found) {
      setCounts({ ...counts, [found.id]: (counts[found.id] || 0) + 1 })
    } else {
      alert('Product not found. Check barcode or name.')
    }
    setScanInput('')
  }

  function finishAudit() {
    const updated = products.map(p => ({
      ...p,
      quantity: counts[p.id] !== undefined ? counts[p.id] : p.quantity
    }))
    localStorage.setItem('products', JSON.stringify(updated))
    const diff = products.filter(p => counts[p.id] !== undefined && counts[p.id] !== p.quantity)
    alert(`Audit complete! ${diff.length} product(s) updated.`)
    setCounts({})
  }

  const mismatches = products.filter(p => counts[p.id] !== undefined && counts[p.id] !== p.quantity)

  return (
    <div>
      <h1>Stock Audit</h1>
      <p>Scan or type barcode to count products. Physical count replaces system quantity.</p>

      <form onSubmit={e => { e.preventDefault(); handleScan() }}>
        <input placeholder="Scan barcode or type product name..."
          value={scanInput} onChange={e => setScanInput(e.target.value)}
          style={{ flex: 1 }} autoFocus />
        <button type="submit">Count +1</button>
      </form>

      {Object.keys(counts).length > 0 && (
        <>
          <h2>Counted Products ({Object.keys(counts).length})</h2>
          <table>
            <thead><tr><th>Product</th><th>System Qty</th><th>Counted</th><th>Difference</th></tr></thead>
            <tbody>
              {products.filter(p => counts[p.id] !== undefined).map(p => (
                <tr key={p.id} className={counts[p.id] !== p.quantity ? 'low-stock' : ''}>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>{counts[p.id]}</td>
                  <td>{counts[p.id] - p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {mismatches.length > 0 && (
            <div className="alert-box" style={{ marginTop: 16 }}>
              <strong>⚠️ {mismatches.length} mismatch(es) found</strong>
            </div>
          )}

          <button onClick={finishAudit} style={{ background: '#2d2b4a', color: 'white', marginTop: 16 }}>
            Finish Audit & Update Stock
          </button>
        </>
      )}
    </div>
  )
}

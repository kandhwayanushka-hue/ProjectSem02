const products = [
  { name: 'Wireless Mouse', sku: 'WM-001', qty: 340, price: '$24.99' },
  { name: 'Bluetooth Keyboard', sku: 'BK-002', qty: 215, price: '$49.99' },
  { name: 'USB-C Hub', sku: 'UC-003', qty: 128, price: '$34.99' },
  { name: 'HDMI Cable 6ft', sku: 'HD-004', qty: 502, price: '$9.99' },
  { name: 'Laptop Stand', sku: 'LS-005', qty: 89, price: '$39.99' },
  { name: 'Webcam HD', sku: 'WC-006', qty: 64, price: '$59.99' },
]

export default function Products() {
  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Products</h2>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#1a365d', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>SKU</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Quantity</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '15px', color: '#555' }}>{p.sku}</td>
                <td style={{ padding: '15px' }}>{p.qty}</td>
                <td style={{ padding: '15px' }}>{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

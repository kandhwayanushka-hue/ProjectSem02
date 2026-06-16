const orders = [
  { id: '#ORD-101', customer: 'TechCorp', items: 3, total: '$124.97', status: 'Shipped' },
  { id: '#ORD-102', customer: 'ShopEasy', items: 1, total: '$49.99', status: 'Processing' },
  { id: '#ORD-103', customer: 'GadgetZone', items: 5, total: '$289.95', status: 'Pending' },
  { id: '#ORD-104', customer: 'OfficePro', items: 2, total: '$69.98', status: 'Delivered' },
]

export default function Orders() {
  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Orders</h2>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#1a365d', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Items</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: '15px', color: '#555' }}>{o.customer}</td>
                <td style={{ padding: '15px' }}>{o.items}</td>
                <td style={{ padding: '15px' }}>{o.total}</td>
                <td style={{ padding: '15px' }}>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

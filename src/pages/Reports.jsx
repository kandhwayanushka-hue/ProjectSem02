export default function Reports() {
  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Reports</h2>
      <div className="cards">
        {['Sales Summary', 'Stock Valuation', 'Order History', 'Low Stock Report', 'Supplier Performance'].map((r, i) => (
          <div className="card" key={i} style={{ padding: '30px', cursor: 'pointer' }}>
            <h3 style={{ color: '#1a365d', marginBottom: '8px' }}>{r}</h3>
            <p style={{ color: '#555' }}>View and export detailed {r.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </section>
  )
}

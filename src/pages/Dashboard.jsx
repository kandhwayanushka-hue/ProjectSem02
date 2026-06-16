export default function Dashboard() {
  const stats = [
    { label: 'Total Products', value: '1,284' },
    { label: 'Low Stock Items', value: '23' },
    { label: 'Pending Orders', value: '47' },
    { label: 'Active Suppliers', value: '18' },
  ]

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Dashboard</h2>
      <div className="cards">
        {stats.map((s, i) => (
          <div className="card" key={i} style={{ padding: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '40px', color: '#1a365d', margin: '0 0 10px' }}>{s.value}</h3>
            <p style={{ fontSize: '16px', color: '#555' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

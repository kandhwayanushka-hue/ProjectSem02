export default function Warehouse() {
  const warehouses = [
    { name: 'Central Warehouse', location: 'Mumbai', capacity: '85%', status: 'Active' },
    { name: 'East Hub', location: 'Kolkata', capacity: '62%', status: 'Active' },
    { name: 'West Distribution', location: 'Ahmedabad', capacity: '45%', status: 'Active' },
    { name: 'South Fulfillment', location: 'Chennai', capacity: '91%', status: 'Active' },
  ]

  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Warehouses</h2>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#1a365d', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Location</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Capacity</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', fontWeight: 600 }}>{w.name}</td>
                <td style={{ padding: '15px', color: '#555' }}>{w.location}</td>
                <td style={{ padding: '15px' }}>{w.capacity}</td>
                <td style={{ padding: '15px', color: '#2f855a' }}>{w.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

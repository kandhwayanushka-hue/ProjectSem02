const suppliers = [
  { name: 'GlobalTech Supplies', contact: 'Ravi Kumar', leadTime: '5 days', rating: 4.8 },
  { name: 'Prime Components', contact: 'Sneha Patel', leadTime: '3 days', rating: 4.5 },
  { name: 'NextGen Parts', contact: 'Ankit Sharma', leadTime: '7 days', rating: 4.2 },
  { name: 'Apex Logistics', contact: 'Priya Singh', leadTime: '4 days', rating: 4.9 },
]

export default function Suppliers() {
  return (
    <section style={{ padding: '40px', background: '#f7fafc', minHeight: '80vh' }}>
      <h2 className="section-title">Suppliers</h2>
      <div className="cards">
        {suppliers.map((s, i) => (
          <div className="card" key={i} style={{ padding: '25px', textAlign: 'left' }}>
            <h3 style={{ color: '#1a365d', marginBottom: '10px' }}>{s.name}</h3>
            <p style={{ margin: '5px 0' }}>Contact: {s.contact}</p>
            <p style={{ margin: '5px 0' }}>Lead Time: {s.leadTime}</p>
            <p style={{ margin: '5px 0' }}>Rating: {'★'.repeat(Math.round(s.rating))} ({s.rating})</p>
          </div>
        ))}
      </div>
    </section>
  )
}

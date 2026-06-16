const features = [
  {
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    title: 'Real-Time Stock Tracking',
    desc: 'Monitor stock levels across all warehouses with live updates.',
  },
  {
    img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop',
    title: 'Order Management',
    desc: 'Manage purchase orders and sales orders in one place.',
  },
  {
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    title: 'Barcode / QR Scanning',
    desc: 'Scan items in and out with barcode and QR code automation.',
  },
  {
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    title: 'Analytics Dashboard',
    desc: 'Visual insights into sales trends, stock turnover and demand.',
  },
  {
    img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
    title: 'Low Stock Alerts',
    desc: 'Get notified when inventory runs low or items near expiry.',
  },
  {
    img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
    title: 'Supplier Management',
    desc: 'Maintain supplier profiles, lead times, and performance history.',
  },
]

export default function FeatureCards() {
  return (
    <section className="destinations">
      <h2 className="section-title">Core Features</h2>
      <div className="cards">
        {features.map((f, i) => (
          <div className="card" key={i}>
            <img src={f.img} alt={f.title} />
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

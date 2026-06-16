export default function SecondShowcase() {
  return (
    <section className="destinations">
      <h2 className="section-title">Multi-Warehouse Support</h2>
      <div className="cards">
        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop"
            alt="Warehouse 1"
          />
          <h3>Central Warehouse</h3>
          <p>Primary hub for bulk storage and distribution.</p>
        </div>
        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop"
            alt="Warehouse 2"
          />
          <h3>Retail Outlets</h3>
          <p>Real-time stock sync across all retail locations.</p>
        </div>
        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop"
            alt="Warehouse 3"
          />
          <h3>Fulfillment Centers</h3>
          <p>Dedicated spaces for order picking and dispatch.</p>
        </div>
      </div>
    </section>
  )
}

export default function ShowcaseSection() {
  return (
    <section className="container-1">
      <div className="container-1-image left">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=400&fit=crop"
          alt="Analytics Dashboard"
        />
      </div>
      <div className="container-1-content">
        <p className="sponsored">Powered by InventoManego</p>
        <h1>Understand your business with powerful analytics</h1>
        <p className="description">
          Visual dashboards give you real-time visibility into stock levels,
          sales performance, and demand forecasting — all in one place.
        </p>
        <button className="learn-btn">Explore Dashboard</button>
      </div>
      <div className="container-1-image right">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=400&fit=crop"
          alt="Team at work"
        />
      </div>
    </section>
  )
}

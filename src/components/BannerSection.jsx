import { useEffect } from 'react'

export default function BannerSection() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.inv-banner-imgs-wrap')?.classList.add('active')
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="gft-inv-banner-sec">
      <div className="inv-banner-cont-wrap">
        <h1>Inventory Management Software for 2026</h1>
        <p>Achieve real-time stock accuracy, automate reorders, track batches and barcodes, and manage inventory across outlets with a fast, mobile-first inventory management software.</p>
      </div>
      <div className="inv-banner-imgs-wrap">
        <div className="inv-banner-imgs inv-banner-img1">
          <div className="banner-card-label">Products</div>
        </div>
        <div className="inv-banner-imgs inv-banner-img2">
          <div className="phone-mockup">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="phone-header">Dashboard</div>
              <div className="phone-stat">
                <span>Stock</span>
                <span className="phone-val">1,284</span>
              </div>
              <div className="phone-stat">
                <span>Orders</span>
                <span className="phone-val">47</span>
              </div>
              <div className="phone-bar">
                <div className="phone-bar-fill" style={{width: '75%'}}></div>
              </div>
              <div className="phone-bar-label">Warehouse Capacity</div>
            </div>
          </div>
        </div>
        <div className="inv-banner-img-cards">
          <div className="inv-banner-imgs inv-banner-img3">
            <div className="banner-mini-card">
              <span>📦</span>
              <div>
                <strong>Low Stock</strong>
                <small>23 items</small>
              </div>
            </div>
          </div>
          <div className="inv-banner-imgs inv-banner-img4">
            <div className="banner-mini-card">
              <span>🚚</span>
              <div>
                <strong>Pending</strong>
                <small>12 orders</small>
              </div>
            </div>
          </div>
        </div>
        <div className="inv-banner-imgs inv-banner-img5">
          <div className="banner-card-label banner-card-label-right">Analytics</div>
        </div>
      </div>
    </section>
  )
}

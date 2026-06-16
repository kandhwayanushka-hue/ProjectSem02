# InventoManego — Inventory Management System

A web-based system to help businesses track, manage, and optimize inventory in real time. Designed for retailers, restaurants, and multi-outlet businesses, it ensures accurate stock visibility, faster decision-making, and automation across daily operations.

## Features

- **Real-time stock tracking** — Live inventory updates across all warehouses via WebSocket (Socket.io)
- **Barcode/QR code automation** — Scan items using device camera (`html5-qrcode`) for rapid product lookup and entry
- **Order management** — Purchase & sales order lifecycle (Pending → Processing → Shipped → Delivered) with one-click status advancement
- **Mobile-first workflows** — Fully responsive design with hamburger navigation, optimized for phones and tablets
- **Alerts for low stock/expiry** — Dashboard alerts for low stock and out-of-stock items with reorder actions
- **Analytics dashboard with reports** — Monthly revenue bar chart, stock valuation, order history, supplier performance, and CSV export

## Technical Highlights

- **Database integration** — SQLite backend with schema for products, suppliers, orders, warehouses, stock transfers, and user accounts
- **API support** — RESTful API ready for e-commerce and POS system integration (all CRUD endpoints)
- **Role-based access control** — Admin (`demo@example.com`) vs regular user (`user@example.com`): delete/add actions restricted to admins
- **Scalable architecture** — Designed for multiple outlets/warehouses with stock transfer between locations

## Benefits

- Prevents stockouts and reduces waste
- Improves decision-making with accurate data
- Saves time through automation
- Enhances customer satisfaction

---

**Check out the live app:** [https://invento-manego.vercel.app](https://invento-manego.vercel.app)



# InventoManego — Inventory Management System

A full-stack web application for real-time inventory tracking, order management, supplier management, and warehouse operations. Built with React + Vite frontend and Node.js + Express + SQLite backend.

## Live Demo

- **Frontend:** https://invento-manego.vercel.app
- **Backend API:** https://projectSem02.onrender.com
- **Demo Login:** `demo@example.com` / `password123`

## Features

### Stock & Product Management
- Full CRUD for products with search, filter by category, and status tracking (In Stock / Low Stock / Out of Stock)
- Real-time stock updates via WebSocket (Socket.io)
- Barcode/QR code scanning using device camera (`html5-qrcode`)

### Order Management
- Order listing with status filter tabs (Pending → Processing → Shipped → Delivered)
- One-click status advancement with real-time UI updates
- Order detail modal with estimated delivery dates

### Supplier Management
- Add, edit, delete suppliers with validation
- Activate/deactivate toggle with visual opacity feedback
- Rating slider and star display

### Warehouse Management
- Add, edit, delete warehouses with capacity bars (color-coded: green/yellow/red)
- Stock transfer between warehouses with audit trail
- Activate/deactivate toggle

### Dashboard & Analytics
- Animated stat counters (products, low stock, orders, suppliers, revenue)
- Monthly revenue bar chart
- Recent orders table with view all toggle
- Low stock alerts with reorder button
- Top-selling products table

### Reports
- 5 report tabs: Sales Summary, Stock Valuation, Order History, Low Stock Report, Supplier Performance
- Summary stat cards with computed metrics
- Date range filter
- CSV download for each report

### Authentication
- Login/signup with JWT tokens (persisted via localStorage)
- Protected routes (redirect to login if unauthenticated)
- Demo credentials pre-loaded

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router 7 |
| Backend | Node.js, Express, better-sqlite3 |
| Real-time | Socket.io (server + client) |
| Auth | bcryptjs + jsonwebtoken |
| Barcode | html5-qrcode |
| HTTP | Axios |
| Deployment | Vercel (frontend) + Render (backend) |

## Project Structure

```
├── src/                  # React frontend
│   ├── components/       # Reusable UI (Navbar, Modal, Toast, BarcodeScanner, etc.)
│   ├── context/          # AuthContext, NotificationContext
│   ├── hooks/            # useAnimatedCounter, useSocket
│   ├── pages/            # Dashboard, Products, Orders, Suppliers, Warehouse, Reports, Login, Signup
│   ├── api.js            # Axios instance with auth interceptor
│   ├── App.jsx           # Root with routing
│   └── main.jsx          # Entry point
├── server/               # Node.js backend
│   ├── index.js          # Express app, SQLite DB, Socket.io, all API routes
│   └── package.json
├── vite.config.js        # Vite config with dev proxy
├── render.yaml           # Render deployment blueprint
└── package.json
```

## Local Development

```bash
# Terminal 1: Backend
cd server
npm install
npm start          # Runs on http://localhost:5000

# Terminal 2: Frontend
npm install
npm run dev        # Runs on http://localhost:5173 (proxies /api to :5000)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Sign in |
| POST | /api/auth/signup | No | Create account |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/products | No | List products |
| POST | /api/products | Yes | Create product |
| PUT | /api/products/:id | Yes | Update product |
| DELETE | /api/products/:id | Yes | Delete product |
| GET | /api/orders | No | List orders |
| PUT | /api/orders/:id/advance | Yes | Advance order status |
| POST | /api/orders | Yes | Create order |
| DELETE | /api/orders/:id | Yes | Delete order |
| GET | /api/suppliers | No | List suppliers |
| POST | /api/suppliers | Yes | Add supplier |
| PUT | /api/suppliers/:id | Yes | Update supplier |
| DELETE | /api/suppliers/:id | Yes | Delete supplier |
| GET | /api/warehouses | No | List warehouses |
| POST | /api/warehouses | Yes | Add warehouse |
| PUT | /api/warehouses/:id | Yes | Update warehouse |
| DELETE | /api/warehouses/:id | Yes | Delete warehouse |
| POST | /api/warehouses/transfer | Yes | Transfer stock |
| GET | /api/dashboard | No | Dashboard stats |

## Deployment

Frontend is auto-deployed via Vercel from the `main` branch. Backend is deployed on Render using `render.yaml`.

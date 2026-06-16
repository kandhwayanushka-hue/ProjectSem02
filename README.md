# InventoManego — Inventory Management System

A full-stack web application for real-time inventory tracking, order management, supplier management, and warehouse operations. Built with React + Vite frontend and Node.js + Express + SQLite backend.

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

## Live Demo

- **Frontend:** https://invento-manego.vercel.app


import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const JWT_SECRET = 'invento-manego-secret-key-2026'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

// ---------- Database ----------
const db = new Database(join(__dirname, 'invento.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    qty INTEGER DEFAULT 0,
    price REAL DEFAULT 0,
    category TEXT DEFAULT '',
    min_qty INTEGER DEFAULT 10,
    status TEXT DEFAULT 'In Stock',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    customer TEXT NOT NULL,
    items INTEGER DEFAULT 1,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    est TEXT DEFAULT '',
    date TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    lead_time TEXT DEFAULT '',
    rating REAL DEFAULT 5,
    status TEXT DEFAULT 'Active',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS warehouses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT DEFAULT '',
    capacity INTEGER DEFAULT 50,
    manager TEXT DEFAULT '',
    stock_items INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS stock_transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_wh INTEGER,
    to_wh INTEGER,
    item_name TEXT,
    qty INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

// Seed data if empty
const seed = () => {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c
  if (userCount === 0) {
    const hash = bcrypt.hashSync('password123', 10)
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Admin User', 'demo@example.com', hash, 'admin')
    const userHash = bcrypt.hashSync('user123', 10)
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Regular User', 'user@example.com', userHash, 'user')
  }

  const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c
  if (prodCount === 0) {
    const products = [
      ['Wireless Mouse', 'WM-001', 340, 24.99, 'Electronics', 30],
      ['Bluetooth Keyboard', 'BK-002', 215, 49.99, 'Electronics', 20],
      ['USB-C Hub', 'UC-003', 128, 34.99, 'Accessories', 15],
      ['HDMI Cable 6ft', 'HD-004', 502, 9.99, 'Cables', 50],
      ['Laptop Stand', 'LS-005', 89, 39.99, 'Accessories', 30],
      ['Webcam HD', 'WC-006', 23, 59.99, 'Electronics', 25],
      ['Mechanical Keyboard', 'MK-007', 0, 89.99, 'Electronics', 15],
      ['Monitor 27"', 'MN-008', 45, 299.99, 'Electronics', 10],
    ]
    const insert = db.prepare('INSERT INTO products (name, sku, qty, price, category, min_qty) VALUES (?, ?, ?, ?, ?, ?)')
    for (const p of products) insert.run(...p)
  }

  const orderCount = db.prepare('SELECT COUNT(*) as c FROM orders').get().c
  if (orderCount === 0) {
    const orders = [
      ['#ORD-101', 'TechCorp', 3, 124.97, 'Shipped', '2026-06-18'],
      ['#ORD-102', 'ShopEasy', 1, 49.99, 'Processing', '2026-06-20'],
      ['#ORD-103', 'GadgetZone', 5, 289.95, 'Pending', '2026-06-22'],
      ['#ORD-104', 'OfficePro', 2, 69.98, 'Delivered', '2026-06-14'],
      ['#ORD-105', 'HomeStore', 4, 159.96, 'Pending', '2026-06-24'],
    ]
    const insert = db.prepare("INSERT INTO orders (order_id, customer, items, total, status, est, date) VALUES (?, ?, ?, ?, ?, ?, date('now'))")
    for (const o of orders) insert.run(...o)
  }

  const suppCount = db.prepare('SELECT COUNT(*) as c FROM suppliers').get().c
  if (suppCount === 0) {
    const suppliers = [
      ['GlobalTech Supplies', 'Ravi Kumar', 'ravi@globaltech.com', '+91-9876543210', '5 days', 4.8],
      ['Prime Components', 'Sneha Patel', 'sneha@primecomp.in', '+91-9876543211', '3 days', 4.5],
      ['NextGen Parts', 'Ankit Sharma', 'ankit@nextgen.in', '+91-9876543212', '7 days', 4.2],
      ['Apex Logistics', 'Priya Singh', 'priya@apexlog.com', '+91-9876543213', '4 days', 4.9],
    ]
    const insert = db.prepare('INSERT INTO suppliers (name, contact, email, phone, lead_time, rating) VALUES (?, ?, ?, ?, ?, ?)')
    for (const s of suppliers) insert.run(...s)
  }

  const whCount = db.prepare('SELECT COUNT(*) as c FROM warehouses').get().c
  if (whCount === 0) {
    const whs = [
      ['Central Warehouse', 'Mumbai', 85, 'Amit Verma', 1240, 'Active'],
      ['East Hub', 'Kolkata', 62, 'Sunita Das', 876, 'Active'],
      ['West Distribution', 'Ahmedabad', 45, 'Rohit Shah', 543, 'Active'],
      ['South Fulfillment', 'Chennai', 91, 'Lakshmi Nair', 1567, 'Active'],
      ['North Storage', 'Delhi', 32, 'Vikram Singh', 389, 'Inactive'],
    ]
    const insert = db.prepare('INSERT INTO warehouses (name, location, capacity, manager, stock_items, status) VALUES (?, ?, ?, ?, ?, ?)')
    for (const w of whs) insert.run(...w)
  }
}
seed()

// ---------- Auth Middleware ----------
const auth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'No token provided' })
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (header) {
    try { req.user = jwt.verify(header.split(' ')[1], JWT_SECRET) } catch {}
  }
  next()
}

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
    next()
  })
}

// ---------- Auth Routes ----------
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' })
  try {
    const hash = bcrypt.hashSync(password, 10)
    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hash)
    const token = jwt.sign({ id: result.lastInsertRowid, name, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: result.lastInsertRowid, name, email, role: 'user' } })
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already registered' })
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

app.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id)
  res.json(user)
})

// ---------- Products ----------
app.get('/api/products', optionalAuth, (req, res) => {
  const { search, category } = req.query
  let sql = 'SELECT * FROM products'
  const params = []
  const conditions = []
  if (search) { conditions.push('(name LIKE ? OR sku LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }
  if (category && category !== 'All') { conditions.push('category = ?'); params.push(category) }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
  sql += ' ORDER BY id DESC'
  const products = db.prepare(sql).all(...params)
  if (category || search) return res.json(products)
  res.json(products.map(p => ({
    ...p,
    status: p.qty <= 0 ? 'Out of Stock' : p.qty < p.min_qty ? 'Low Stock' : 'In Stock'
  })))
})

app.post('/api/products', auth, (req, res) => {
  const { name, sku, qty, price, category, min_qty } = req.body
  if (!name || !sku) return res.status(400).json({ error: 'Name and SKU required' })
  const result = db.prepare('INSERT INTO products (name, sku, qty, price, category, min_qty) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, sku, qty || 0, price || 0, category || '', min_qty || 10)
  io.emit('stockUpdate', { type: 'product_added' })
  res.json({ id: result.lastInsertRowid, name, sku })
})

app.put('/api/products/:id', auth, (req, res) => {
  const { name, sku, qty, price, category, min_qty } = req.body
  db.prepare(`UPDATE products SET name=?, sku=?, qty=?, price=?, category=?, min_qty=?, updated_at=datetime('now') WHERE id=?`)
    .run(name, sku, qty, price, category, min_qty, req.params.id)
  io.emit('stockUpdate', { type: 'product_updated', id: Number(req.params.id) })
  res.json({ success: true })
})

app.delete('/api/products/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  io.emit('stockUpdate', { type: 'product_deleted' })
  res.json({ success: true })
})

// ---------- Orders ----------
app.get('/api/orders', optionalAuth, (req, res) => {
  const { status } = req.query
  let sql = 'SELECT * FROM orders'
  const params = []
  if (status && status !== 'All') { sql += ' WHERE status = ?'; params.push(status) }
  sql += ' ORDER BY id DESC'
  res.json(db.prepare(sql).all(...params))
})

app.put('/api/orders/:id/advance', auth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const nextMap = { 'Pending': 'Processing', 'Processing': 'Shipped', 'Shipped': 'Delivered', 'Delivered': 'Delivered', 'Cancelled': 'Cancelled' }
  const next = nextMap[order.status]
  if (next === order.status) return res.json(order)
  db.prepare(`UPDATE orders SET status = ?, date = datetime('now') WHERE id = ?`).run(next, req.params.id)
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)
  io.emit('orderUpdate', updated)
  res.json(updated)
})

app.post('/api/orders', auth, (req, res) => {
  const { customer, items, total } = req.body
  const oid = '#ORD-' + Date.now().toString().slice(-6)
  db.prepare(`INSERT INTO orders (order_id, customer, items, total, est, date) VALUES (?, ?, ?, ?, datetime('now', '+5 days'), datetime('now'))`)
    .run(oid, customer, items || 1, total || 0)
  io.emit('orderUpdate', { type: 'new_order' })
  res.json({ order_id: oid, success: true })
})

app.delete('/api/orders/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id)
  io.emit('orderUpdate', { type: 'order_deleted' })
  res.json({ success: true })
})

// ---------- Suppliers ----------
app.get('/api/suppliers', optionalAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM suppliers ORDER BY id DESC').all())
})

app.post('/api/suppliers', auth, (req, res) => {
  const { name, contact, email, phone, lead_time, rating } = req.body
  if (!name) return res.status(400).json({ error: 'Supplier name required' })
  const result = db.prepare('INSERT INTO suppliers (name, contact, email, phone, lead_time, rating) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, contact || '', email || '', phone || '', lead_time || '', rating || 5)
  res.json({ id: result.lastInsertRowid, success: true })
})

app.put('/api/suppliers/:id', auth, (req, res) => {
  const { name, contact, email, phone, lead_time, rating, status } = req.body
  db.prepare('UPDATE suppliers SET name=?, contact=?, email=?, phone=?, lead_time=?, rating=?, status=? WHERE id=?')
    .run(name, contact, email, phone, lead_time, rating, status, req.params.id)
  res.json({ success: true })
})

app.delete('/api/suppliers/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM suppliers WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// ---------- Warehouses ----------
app.get('/api/warehouses', optionalAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM warehouses ORDER BY id DESC').all())
})

app.post('/api/warehouses', auth, (req, res) => {
  const { name, location, capacity, manager, stock_items, status } = req.body
  if (!name) return res.status(400).json({ error: 'Warehouse name required' })
  const result = db.prepare('INSERT INTO warehouses (name, location, capacity, manager, stock_items, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, location || '', capacity || 50, manager || '', stock_items || 0, status || 'Active')
  res.json({ id: result.lastInsertRowid, success: true })
})

app.put('/api/warehouses/:id', auth, (req, res) => {
  const { name, location, capacity, manager, stock_items, status } = req.body
  db.prepare('UPDATE warehouses SET name=?, location=?, capacity=?, manager=?, stock_items=?, status=? WHERE id=?')
    .run(name, location, capacity, manager, stock_items, status, req.params.id)
  io.emit('stockUpdate', { type: 'warehouse_updated' })
  res.json({ success: true })
})

app.delete('/api/warehouses/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM warehouses WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

app.post('/api/warehouses/transfer', auth, (req, res) => {
  const { fromId, toId, itemName, qty } = req.body
  if (fromId === toId) return res.status(400).json({ error: 'Cannot transfer to same warehouse' })
  const from = db.prepare('SELECT * FROM warehouses WHERE id = ?').get(fromId)
  const to = db.prepare('SELECT * FROM warehouses WHERE id = ?').get(toId)
  if (!from || !to) return res.status(404).json({ error: 'Warehouse not found' })
  const q = Number(qty)
  db.prepare('UPDATE warehouses SET stock_items = ? WHERE id = ?').run(from.stock_items - q, fromId)
  db.prepare('UPDATE warehouses SET stock_items = ? WHERE id = ?').run(to.stock_items + q, toId)
  db.prepare('INSERT INTO stock_transfers (from_wh, to_wh, item_name, qty) VALUES (?, ?, ?, ?)').run(fromId, toId, itemName, q)
  io.emit('stockUpdate', { type: 'transfer', fromId, toId, itemName, qty: q })
  res.json({ success: true })
})

// ---------- Dashboard ----------
app.get('/api/dashboard', optionalAuth, (req, res) => {
  const products = db.prepare('SELECT COUNT(*) as c, COALESCE(SUM(qty), 0) as total_qty FROM products').get()
  const lowStock = db.prepare('SELECT COUNT(*) as c FROM products WHERE qty > 0 AND qty < min_qty').get()
  const outOfStock = db.prepare('SELECT COUNT(*) as c FROM products WHERE qty = 0').get()
  const pendingOrders = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status IN ('Pending', 'Processing')").get()
  const suppliers = db.prepare("SELECT COUNT(*) as c FROM suppliers WHERE status = 'Active'").get()
  const revenue = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'Cancelled'").get()

  const recentOrders = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 5').all()
  const lowStockItems = db.prepare('SELECT * FROM products WHERE qty > 0 AND qty < min_qty ORDER BY qty ASC LIMIT 5').all()
  const monthlySales = db.prepare(`
    SELECT strftime('%m', date) as month,
           COALESCE(SUM(total), 0) as sales,
           COUNT(*) as orders
    FROM orders WHERE status != 'Cancelled'
    GROUP BY strftime('%m', date)
  `).all()

  res.json({
    totalProducts: products.c,
    totalStockQty: products.total_qty,
    lowStock: lowStock.c,
    outOfStock: outOfStock.c,
    pendingOrders: pendingOrders.c,
    activeSuppliers: suppliers.c,
    totalRevenue: revenue.total,
    recentOrders,
    lowStockItems: lowStockItems.map(p => ({
      ...p,
      status: p.qty <= 0 ? 'Out of Stock' : 'Low Stock'
    })),
    monthlySales
  })
})

// ---------- Socket.io ----------
io.on('connection', (socket) => {
  socket.on('join', (room) => socket.join(room))
  socket.on('leave', (room) => socket.leave(room))
})

// ---------- Start ----------
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

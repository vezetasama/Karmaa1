# 🎮 Karma — Instant Game Top-ups & Gift Cards

A Kunyo-clone web platform for purchasing game top-ups and gift cards with instant delivery.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| State | Zustand |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (bcryptjs) |
| Payment | eSewa / Khalti (mock for MVP) |

## 📋 Prerequisites

- **Node.js** (v18+): https://nodejs.org/
- **MongoDB** (v6+): https://www.mongodb.com/try/download/community

## 🚀 Quick Start

### 1. Install MongoDB

Download and install MongoDB Community Server, then start it:

```bash
# Windows: MongoDB should run as a service after installation
# Or start manually:
mongod
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- 3 products (Free Fire, PUBG Mobile, Mobile Legends)
- Admin user: `admin@karma.com` / `admin123`
- Test user: `user@karma.com` / `user123`

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Visit: **http://localhost:5173**

## 📁 Project Structure

```
Karma/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/   # Navbar, Footer, ProductCard, etc.
│   │   ├── pages/        # Home, Products, Cart, Checkout, etc.
│   │   ├── store/        # Zustand stores (auth, cart)
│   │   └── services/     # Axios API client
│   └── ...
├── server/          # Express Backend
│   ├── config/      # Database connection
│   ├── controllers/ # Route handlers
│   ├── middleware/   # JWT auth
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── services/    # Delivery & payment
│   └── seed.js      # Database seeder
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/products` | No | List products |
| GET | `/api/products/:slug` | No | Get product |
| POST | `/api/orders` | Yes | Create order |
| GET | `/api/orders/my` | Yes | User's orders |
| POST | `/api/payments/initiate` | Yes | Start payment |
| POST | `/api/payments/verify` | Yes | Verify payment |

## 🎨 Design

Dark mode with glassmorphism, neon purple (#6c5ce7) + cyan (#00d2d3) accents.

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
- **Git**: For version control
- **VS Code**: Recommended editor for this project

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
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin panel (optional separate dev server)
cd ../admin
npm install
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates products and an admin user. For production, run `npm run prepare-host` instead (strong password + clean orders).

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

## 🌐 Deploy on Render (free plan)

This repo includes `render.yaml` for a single **free** web service that builds the React app and serves it from Express.

### Before first deploy

1. Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and copy the connection string.
2. In Render → your service → **Environment**, set:
   - `MONGODB_URI` — Atlas connection string
   - `JWT_SECRET` — long random string (32+ characters)
   - `GOOGLE_CLIENT_ID` — same as `VITE_GOOGLE_CLIENT_ID`
   - `SMTP_*` and `EMAIL_FROM` — for verification / password emails
3. On your machine (with MongoDB running), prepare a clean database and admin login:

```bash
cd backend
npm run prepare-host
```

This clears test orders, sets a strong admin account, and writes credentials to `backend/ADMIN_CREDENTIALS.local.txt` (gitignored).

You can also clear orders from **Admin → Orders → Clear all data** before going live.

### Admin login (after prepare-host)

Default email: `admin@karmastore.np`  
Password: see `backend/ADMIN_CREDENTIALS.local.txt` or set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before running `prepare-host`.

### Google Sign-In on production

In Google Cloud Console → OAuth client → **Authorized JavaScript origins**, add:

- `https://karma-website1.onrender.com` (or your Render URL)

## 📁 Project Structure

```
FOOD-DEL/            # Karma project (open this folder in the editor)
├── frontend/        # Customer React app (Vite)
├── admin/           # Admin panel app (same stack; deploy separately if needed)
├── backend/         # Express API + MongoDB
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── seed.js
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

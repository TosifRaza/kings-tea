# KING'S TEA — MERN Stack Luxury Tea Brand

**The Art of Royal Tea** — A world-class luxury tea e-commerce platform built with the MERN stack.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS + Redux Toolkit |
| Admin Portal | React.js + Vite + Tailwind CSS + Redux Toolkit |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (HTTP-only cookies) |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

## Project Structure

```
kings-tea/
├── Backend/                    — Express.js API Server (Port 5000)
│   ├── src/
│   │   ├── config/            — Database connection
│   │   ├── controllers/       — Request handlers (13 controllers)
│   │   ├── middleware/        — Auth & authorization middleware
│   │   ├── models/            — Mongoose schemas (11 models)
│   │   ├── routes/            — Express routes (13 route modules)
│   │   ├── utils/             — Response handler, token utilities
│   │   └── server.js          — Entry point
│   ├── package.json
│   └── .env
│
├── Frontend/                   — Customer-facing React app (Port 3000)
│   ├── src/
│   │   ├── components/        — UI components (home, shop, product, etc.)
│   │   ├── pages/             — Route pages
│   │   ├── layouts/           — MainLayout with Header/Footer
│   │   ├── routes/            — React Router config
│   │   ├── services/          — Axios API calls
│   │   ├── store/             — Redux Toolkit slices
│   │   ├── hooks/             — Custom hooks
│   │   ├── utils/             — Constants
│   │   ├── assets/            — Static data
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── Admin-Portal/               — Admin dashboard React app (Port 3001)
│   ├── src/
│   │   ├── components/        — Admin UI components
│   │   ├── pages/             — Admin pages (10 pages)
│   │   ├── layouts/           — AdminLayout with sidebar
│   │   ├── routes/            — Admin route config
│   │   ├── services/          — Axios API calls
│   │   ├── store/             — Redux Toolkit slices
│   │   ├── utils/             — Constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or bun

### 1. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in Backend/.env
```

### 2. Start Backend (Port 5000)
```bash
cd Backend
npm install
npm run dev
```

### 3. Seed the Database
```bash
# Visit in browser or use curl:
curl http://localhost:5000/api/seed
```

This creates:
- 6 categories
- 12 premium tea products
- 1 admin user (admin@kingstea.com / admin123)

### 4. Start Frontend (Port 3000)
```bash
cd Frontend
npm install
npm run dev
```

Visit: http://localhost:3000

### 5. Start Admin Portal (Port 3001)
```bash
cd Admin-Portal
npm install
npm run dev
```

Visit: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user

### Products
- `GET /api/products` — List products (with filters)
- `GET /api/products/:id` — Get product
- `POST /api/products` — Create product (admin)
- `PUT /api/products/:id` — Update product (admin)
- `DELETE /api/products/:id` — Delete product (admin)

### Categories, Orders, Users, Cart, Wishlist, Reviews, Blog, Subscriptions, Newsletter, Contact, Stats
All have full CRUD endpoints — see Backend/src/routes/ for details.

## Roles

| Role | Access |
|------|--------|
| super_admin | Full system access |
| admin | All admin features |
| manager | Most admin features |
| customer | Shop, profile, orders |

## Color Palette

| Name | Hex |
|------|-----|
| Tea Green | #1F4D3A |
| Warm Ivory | #F8F3E9 |
| Royal Terracotta | #A65A3A |
| Imperial Gold | #C9A86A |
| Deep Walnut | #3A281C |

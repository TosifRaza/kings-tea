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

### 1. Configure the backend
```bash
cd Backend
copy .env.example .env
# Set MONGODB_URI and a long random JWT_SECRET in Backend/.env.
# Add Cloudinary credentials to enable product image uploads.
```

### 2. Create the first administrator (one time)
```bash
npm install
npm run admin:bootstrap
```

Set `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, and a unique
`BOOTSTRAP_ADMIN_PASSWORD` in `Backend/.env` first. The command refuses to
run if a super administrator already exists. Remove those bootstrap values
after setup. It does not seed demo products or reviews.

### Local demo review data

Public product ratings are calculated from approved reviews. To populate a local
development database with clearly labeled sample reviews, set `NODE_ENV` to
`development` and `ENABLE_DEMO_REVIEW_SEED=true`, then run this in `Backend`:

```bash
npm run seed:reviews:demo
```

Demo scores are returned separately from customer ratings and shown with a
demo label. A one-time production demo seed requires both
`ALLOW_PRODUCTION_DEMO_REVIEW_SEED=true` and the
`--confirm-production-demo-seed` command-line flag. It skips products that
already have approved customer reviews and does not delete data. Use that only
when you intend the storefront to display clearly labeled sample reviews.

### Optional: add the 50-product catalog batch

The batch is additive and safe to rerun. It requires the six existing catalog
categories and writes 50 unique products plus their photo gallery references
and media metadata. Product galleries use the four licensed category photos;
Himalayan Black Reserve also includes its estate photograph. Confirm the
real product names, prices, packaging, and inventory before making products
available for purchase. The batch starts with zero stock, no ratings or
reviews, and no bestseller claims.

```bash
cd Backend
npm run catalog:generate-packet-art
# Point MONGODB_URI at the intended database, then:
# PowerShell: $env:CONFIRM_CATALOG_BATCH_50='true'; npm run catalog:seed-50
# POSIX shell: CONFIRM_CATALOG_BATCH_50=true npm run catalog:seed-50
```

The production backend runs this additive import once after connecting to MongoDB
when `NODE_ENV=production`; a database marker prevents subsequent restarts from
repeating it. Do not copy production connection strings into source control.

### 3. Start the backend (Port 5001)
```bash
npm run dev
```

### 4. Start the storefront (Port 3000)
```bash
cd Frontend
npm install
npm run dev
```

Visit: http://localhost:3000

### 5. Start the admin portal (Port 3001)
```bash
cd Admin-Portal
npm install
npm run dev
```

Visit: http://localhost:3001

Add products and categories from the admin portal. The catalog seed endpoint
is disabled in production and requires both `ENABLE_CATALOG_SEED=true` and an
administrator session in non-production environments.

### Product arrival-field migration
The product model stores the new-arrival flag as `newArrival`; the API continues
to expose `isNew` for compatibility with both existing frontends. To migrate
existing MongoDB documents, back up the database, run
`npm run migrate:product-arrival` to inspect the count, then run
`npm run migrate:product-arrival -- --apply` to apply the field rename. Production requires
`CONFIRM_PRODUCT_ARRIVAL_MIGRATION=true` in the command environment.

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
- `GET /api/site-content/homepage` — Published home section order and settings.
- `GET /api/site-content/public/:key` — Published FAQ, policy, navigation, footer, and other supported content records.
- `GET /api/subscriptions/plans` — Published subscription plan details. Enrollment remains disabled without a recurring payment integration.
- `GET /api/admin/media` — Paginated protected media library.
- `POST /api/admin/media` — Upload an image and metadata to Cloudinary (multipart field `image`).
- `PATCH /api/admin/media/:id` — Edit media source, licensing, attribution, alt text, and usage.
- `GET /api/seo/sitemap.xml` — Product and public page sitemap.
- `GET /api/health` — API and database readiness.

### Checkout and payments
- `GET /api/payments/config` — public payment readiness and public Razorpay key ID.
- `POST /api/payments/create-order` — authenticated server-priced checkout; requires an `Idempotency-Key` header.
- `POST /api/payments/verify` — authenticated payment signature and captured-payment verification.
- `POST /api/payments/webhook` — Razorpay webhook signature verification.

See `Backend/src/routes/` for other endpoints and role requirements. Checkout is enabled only when all payment credentials are configured. The server calculates prices, validates stock, verifies captured payments, and decrements inventory in a database transaction. Card details are handled by Razorpay Checkout and are never stored by this application.

Order amounts are in INR. Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in the backend environment and configure the Razorpay webhook URL as `https://<backend-host>/api/payments/webhook` for `payment.captured` events. Keep secrets server-side. Configure the same values in Render's backend environment before checkout can be used.

### Media metadata migration
Product uploads now go to Cloudinary and create durable database metadata records;
new product and category associations are tracked by their model controllers.
Before production changes, take a database backup. Run `npm run migrate:media`
to inspect existing catalog and published/draft site-content image URLs. Apply
only after review with `npm run migrate:media -- --apply`; in production also
set `CONFIRM_MEDIA_MIGRATION=true` for that command. Static project assets are
registered as references, not copied to Cloudinary; use the published
`Frontend/public/images/**/ATTRIBUTION*` records to verify their rights. Existing
media URLs without verifiable licensing remain marked for manual rights review.

### Admin content
The admin portal has Homepage Content (section settings/order), Site Content
(FAQ, policies, navigation, footer, brand story, brewing guides, store settings),
Media Library, Review Moderation, and Subscription Plans pages. These editors
save drafts and publish to MongoDB-backed APIs. Subscription enrollment stays
disabled because no recurring billing provider is configured. Newsletter consent
and subscriber records work; transactional confirmation and unsubscribe email
delivery still require a mail provider integration.

### Production deployment
The frontend and admin are independent Vite static builds; the API is the Node
service. Set the environment variables from each `.env.example` in the matching
hosting service, configure Cloudinary and Razorpay only with real account keys,
and connect each Render service to this GitHub repository/branch. A successful
push triggers Render only if its GitHub auto-deploy setting is enabled. After a
deploy, check `/api/health`, `/api/seo/sitemap.xml`, the storefront, and the
admin build. The product arrival and media metadata scripts are explicit,
backup-first operations and are not run automatically on server startup.

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

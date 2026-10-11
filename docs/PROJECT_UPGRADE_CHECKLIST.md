# King's Tea project audit and upgrade checklist

Audit baseline: 2026-10-11. This tracks repository work only; it does not include values from local environment files.

## Architecture found

- Customer storefront: React 19, Vite 6, React Router 6, Tailwind 4, Redux Toolkit, Axios.
- Admin portal: separate React 19/Vite app with product, order, customer, category, blog, subscription, newsletter, and contact screens.
- API: Node.js CommonJS, Express 4, Mongoose 8, MongoDB Atlas/local MongoDB.
- Authentication: bcrypt password hashing and JWT in an HTTP-only cookie or Bearer header. Admin APIs inconsistently enforce roles.
- Media: product uploads use Cloudinary transformations; catalog and lifestyle images also ship as static frontend assets. No asset metadata/media-library model exists.
- Deployment: frontend/admin/backend are separately buildable; Vite proxies to API port 5001. No checked-in deployment manifest, migration runner, test framework, or lint script was found.
- Existing data models/routes cover users, products, categories, collections, orders, carts, wishlists, reviews, testimonials, blog posts, subscriptions, newsletter subscribers, contact messages, and admin stats.

## Feature inventory

| Area | Status | Audit notes |
| --- | --- | --- |
| Product/category/collection browsing | Partially working | Public APIs and customer pages exist; some homepage/product copy and footer/business links remain static. |
| Admin portal | Improved; still partial | Catalog/order/customer/review screens, homepage draft/publish settings with section toggles/order/basic copy, site-content editor, media library, subscription plan editor now exist. Advanced homepage settings still use JSON; full visual preview and broader collection/gift workflows remain. |
| Product media | Improved; existing data migration pending | New product uploads create Cloudinary-backed asset records; category and published content image references are associated with media records. A backup-first migration registers existing catalog assets; rights for older assets still require manual review. |
| Authentication | Improved; more hardening needed | JWT + bcrypt exist; write-route role checks now cover catalog/content administration, cookie parsing is mounted, and payload sizes are bounded. |
| Orders/inventory | Implemented, needs provider/database verification | Razorpay checkout creates server-priced orders, checks stock, verifies signatures/captured payment, uses Mongo transactions to decrement inventory, and attempts provider refunds if stock changed. Requires configured Razorpay webhook and transaction-capable MongoDB. |
| Payments | Implemented, blocked pending credentials | Razorpay order/create, hosted checkout, verification, webhook HMAC, and guarded fail-closed configuration are wired. Live payment lifecycle has not been verified because credentials and webhook dashboard setup are not available here. |
| Reviews | Approval workflow added | New reviews are held for moderation, verified-purchase is derived from paid/delivered orders, and public product ratings use approved review records only. |
| Newsletter | Partially working | Consent is required and stored; unsubscribe uses a hashed random token, admin export is server-side and restricted. No email delivery/confirmation link is integrated, so unsubscribe token is only offered in the subscribing browser. |
| SEO/accessibility | Improved; still partial | Global metadata, robots.txt, database-backed sitemap, and product title/description/canonical/JSON-LD added. Accessibility and full viewport audits remain. |
| Responsive UX | Partially working | Recent mobile fixes exist; no browser automation or viewport regression suite is configured. |
| Tests/builds | Missing test suite | Frontend/admin have production build scripts; backend has no test/lint scripts. |

## Prioritized implementation

### P0: security and purchase integrity
- [x] Apply server-side role checks to catalog/content mutation routes and user administration.
- [x] Restrict catalog seeding to explicitly enabled non-production admin use.
- [x] Prevent unpaid orders from reserving stock; stock changes occur after verified captured payment.
- [x] Remove unverified customer/admin ability to mark payment status.
- [x] Scope subscription reads/cancellations to the owner; pause enrollment while no real plan/payment system exists.
- [x] Remove database-URI logging from image migration tooling.
- [x] Add cookie parsing and bounded request sizes.
- [x] Add subscription plan model and secure admin CRUD; enrollment stays disabled until recurring payment support exists.

### P1: genuine content and admin workflows
- [x] Add review approval API and publish only approved reviews; derive verified-purchase from actual paid and delivered orders.
- [x] Add admin review approval and rejection workflow.
- [~] Homepage has API-backed category and newest-product sections, Tea Finder, benefits, collections, genuine approved review highlights, CMS-driven guides/FAQ, policy/contact links, dynamic hero/story, newsletter, and footer. Admin can toggle/reorder sections and edit common copy; advanced banner/module settings remain JSON-based.
- [x] Add durable Cloudinary media upload/library, metadata fields, product/category/content associations, FAQ/policy/navigation/footer/brewing-guide CMS records and public FAQ/policy rendering. Existing media requires backup-first metadata migration.
- [x] Homepage draft/published visibility is explicit in schema and public API.
- [~] Consent storage, token-based unsubscribe endpoint, and protected CSV export are implemented; email delivery/confirmation is blocked on mail-provider credentials.

### P2: catalog/media, operations, and presentation
- [~] New uploads have Cloudinary records and associations; run the documented media metadata migration to register existing media.
- [~] Product listing now validates pagination/sort/search; broader admin pagination, index review and integration checks remain.
- [ ] Add configured store settings for currency/shipping/tax and avoid inventing business policies.
- [~] Add base metadata, robots.txt, generated sitemap, and product structured data; accessibility, image alt/source audit and viewport regression checks remain.
- [ ] Add automated API and viewport checks where practical, plus deployment/environment documentation.

## Work log

- [x] Initial repository/file/config inventory completed without opening `.env` values.
- [x] P0 baseline security and purchase-integrity safeguards.
- [~] P0 Razorpay payment/order/webhook path implemented; live verification blocked by credentials and deployment setup. Subscription-plan ownership/pricing still outstanding.
- [~] P1 homepage section draft/publish/order workflow and newsletter consent/export implemented. Full CMS/editorial workflows remain outstanding.
- [ ] P2 media/SEO/accessibility/responsive hardening.
- [x] Production builds for storefront and admin portal; backend JavaScript syntax check.
- [~] Public production API smoke checks and live deployment verification passed after commit `feb37cb`; full authenticated checkout/media/CMS workflows and browser viewport checks still need credentials/browser tooling.

### Verification notes

- Storefront and admin production builds pass. Both emit a bundle-size warning for a JavaScript chunk over 500 kB.
- Backend JavaScript syntax checks pass. Production dependency audits report zero vulnerabilities for all three apps.
- Full backend audit still reports a high-severity `braces` advisory in the development-only `nodemon -> chokidar@3.6.0` chain; the current upstream `braces@3.0.3` line has no patched release. This dependency is not installed in production.
- The storefront/admin production builds and backend syntax checks were rerun after Razorpay, homepage-content, and newsletter changes. Builds pass and still emit >500 kB chunk warnings.
- No API/browser test suite is configured. No database integration, payment sandbox, viewport/browser, or live-deployment check was run. Never claim those checks passed.
- Razorpay requires `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`, a `payment.captured` webhook pointed at `/api/payments/webhook`, and a MongoDB deployment that supports transactions (such as Atlas replica set).
- Image attribution is documented in `Frontend/public/images/tea-products/ATTRIBUTION.md` and `Frontend/public/images/hero-slides/credits.txt`. These are still static assets; the required database-backed media workflow and production media library are not implemented.
- Commit `feb37cb` was pushed to `main`; Render deployed the storefront and backend. Verified storefront `/` and `/robots.txt` return HTTP 200; backend `/api/health`, `/api/products?limit=1`, `/api/subscriptions/plans`, `/api/site-content/public/faq`, `/api/payments/config`, and `/api/seo/sitemap.xml` return HTTP 200. The media admin route returns HTTP 401 unauthenticated. Backend health reports the database connected.
- Production payment readiness is false because Razorpay credentials/webhook configuration are absent. No homepage content document is published yet, so the homepage uses the built-in layout until an administrator publishes a config. The product-arrival and media metadata migrations were not run; create a backup and follow the documented production confirmation steps.
- Subscription plan administration, site-content CMS endpoints/public FAQ and policy pages, media upload/library and asset metadata, product search validation, SEO sitemap/robots, Tea Finder, auth/newsletter rate limits, and factual contact-page rendering are deployed. Do not run the migration scripts against production without a current backup.
- Browser viewport checks at the requested mobile sizes, authenticated admin end-to-end flows, payment sandbox flow, and mail-provider confirmation email were not verified here. No browser test runner is configured.
- Homepage discovery modules are rendered in the built-in layout when no homepage document is published. Mood/gift/review/guide/FAQ content still depends on real published collections, selected catalog products, approved reviews, or CMS entries; empty states are shown instead of invented business content.

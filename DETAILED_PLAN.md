# Gift Delivery Platform — Detailed Technical Plan

> **Status:** Planning Phase  
> **Last Updated:** 2026-05-27  
> **Use:** Internal reference for development team. Continue from here in future sessions.

---

## 1. Product Vision

A multi-country gift delivery platform where:
- **Customers** browse country-specific product catalogs, build a cart, enter a delivery address, and pay online
- **Warehouse Managers** (one per country) manage their country's inventory — products, stock, photos, pricing
- **Super Admins** oversee all countries, managers, and platform analytics
- The platform calculates delivery cost based on pincode zone mapping, adds country-specific taxes, and routes orders to the correct warehouse

---

## 2. Tech Stack Decisions

### Frontend

| Layer | Technology | Reason |
|-------|-----------|--------|
| Web App | **Next.js 14** (React) | SSR for SEO, App Router, fast page loads |
| Mobile App | **React Native** (Expo) | Code sharing with web, cross-platform |
| State Management | **Zustand** | Lightweight, simple for cart/auth state |
| UI Components | **shadcn/ui** + Tailwind CSS | Rapid UI, accessible, customizable |
| Forms | **React Hook Form** + Zod | Validation, schema-first |

### Backend

| Layer | Technology | Reason |
|-------|-----------|--------|
| API Framework | **Node.js + Express** (or NestJS) | Familiar, fast prototyping; NestJS for structure at scale |
| Language | **TypeScript** | Type safety across stack |
| ORM | **Prisma** | Type-safe DB queries, migrations |
| Job Queue | **BullMQ** (Redis-backed) | Async tasks: emails, notifications |
| File Uploads | **Multer** → **AWS S3** | Scalable image storage |

### Infrastructure

| Component | Choice | Notes |
|-----------|--------|-------|
| Hosting | **AWS** | ECS Fargate (containers) or EC2 |
| Database | **PostgreSQL (RDS)** | Relational, handles complex queries |
| Cache | **Redis (ElastiCache)** | Sessions, product cache, cart |
| Storage | **AWS S3** | Product images |
| CDN | **AWS CloudFront** | Fast image/asset delivery globally |
| Auth | **AWS Cognito** | User pools, roles, JWT tokens |
| API Gateway | **AWS API Gateway** | Rate limiting, routing |

---

## 3. Database Schema (Core Tables)

```sql
-- Countries with config
countries (
  id, name, code, currency, tax_rate_percent, is_active
)

-- Delivery zones per country, mapped to pincodes
delivery_zones (
  id, country_id, zone_name, zone_type (metro/state/remote), 
  delivery_fee, estimated_days
)

-- Pincode → Zone mapping
pincodes (
  id, pincode, city, state, country_id, zone_id
)

-- Users (customers)
users (
  id, cognito_sub, email, phone, full_name, 
  role (customer/warehouse_manager/admin), country_scope_id (for managers)
)

-- Warehouse managers (extends users)
warehouse_managers (
  id, user_id, country_id, is_active
)

-- Product categories
categories (
  id, name, country_id, parent_category_id
)

-- Products (scoped to country)
products (
  id, name, description, country_id, category_id,
  base_price, currency, stock_quantity, 
  is_active, created_by (warehouse_manager_id)
)

-- Product images
product_images (
  id, product_id, s3_key, s3_url, is_primary, sort_order
)

-- Customer addresses
addresses (
  id, user_id, recipient_name, line1, line2, 
  city, state, country_id, pincode, phone
)

-- Orders
orders (
  id, customer_id, warehouse_manager_id, country_id,
  address_id, pincode, zone_id,
  subtotal, delivery_fee, tax_amount, service_fee, 
  discount_amount, coupon_code, grand_total, currency,
  status (pending/confirmed/packed/shipped/delivered/cancelled),
  payment_status (pending/paid/failed/refunded),
  stripe_payment_intent_id,
  created_at, updated_at
)

-- Order items
order_items (
  id, order_id, product_id, product_name_snapshot,
  unit_price_snapshot, quantity, subtotal
)

-- Coupons
coupons (
  id, code, discount_type (percent/fixed), discount_value,
  min_order_amount, max_uses, uses_count, 
  valid_from, valid_until, country_id (null = global)
)

-- Notifications log
notifications (
  id, user_id, type (email/sms), event, 
  recipient, status, sent_at
)
```

---

## 4. API Endpoints (REST)

### Auth
```
POST   /api/auth/register          → Create account (Cognito)
POST   /api/auth/login             → Get JWT tokens
POST   /api/auth/refresh           → Refresh token
POST   /api/auth/logout
GET    /api/auth/me                → Current user profile
```

### Countries & Catalog
```
GET    /api/countries              → List active countries
GET    /api/countries/:id/products → Products for a country (paginated)
GET    /api/products/:id           → Single product detail
GET    /api/categories?country=:id → Categories for country
```

### Cart & Checkout
```
POST   /api/cart/validate          → Validate cart items still in stock
POST   /api/pricing/estimate       → Calculate price given cart + pincode
POST   /api/orders                 → Create order
GET    /api/orders/:id             → Order detail
GET    /api/orders                 → Customer's order history
```

### Payments
```
POST   /api/payments/create-intent → Stripe PaymentIntent
POST   /api/payments/webhook       → Stripe webhook (order confirmation)
POST   /api/payments/refund/:orderId
```

### Warehouse Manager
```
GET    /api/manager/inventory               → Products for my country
POST   /api/manager/products               → Create product
PUT    /api/manager/products/:id           → Update product
DELETE /api/manager/products/:id           → Delete product
POST   /api/manager/products/:id/images    → Upload images
DELETE /api/manager/products/:id/images/:imgId
PATCH  /api/manager/products/:id/stock     → Update quantity only
GET    /api/manager/orders                 → Orders for my country
PATCH  /api/manager/orders/:id/status      → Update fulfillment status
```

### Admin
```
GET    /api/admin/countries        → Manage all countries
POST   /api/admin/countries
PUT    /api/admin/countries/:id
GET    /api/admin/managers         → All warehouse managers
POST   /api/admin/managers         → Create manager account
DELETE /api/admin/managers/:id
GET    /api/admin/analytics        → Revenue, orders, by country
GET    /api/admin/pincodes/upload  → Bulk pincode zone upload (CSV)
```

---

## 5. Pricing Engine — Implementation Detail

### Algorithm (Pseudocode)
```typescript
async function calculateOrderPrice(cart: CartItem[], pincode: string, countryId: string, couponCode?: string) {
  // 1. Validate pincode
  const zone = await db.pincodes.findFirst({
    where: { pincode, countryId },
    include: { deliveryZone: true }
  })
  if (!zone) throw new Error('Unserviceable pincode')

  // 2. Items subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 3. Delivery fee from zone
  const deliveryFee = zone.deliveryZone.delivery_fee

  // 4. Country tax
  const country = await db.countries.findUnique({ where: { id: countryId } })
  const taxAmount = subtotal * (country.tax_rate_percent / 100)

  // 5. Service fee (platform margin)
  const serviceFee = (subtotal + deliveryFee) * 0.02

  // 6. Coupon discount
  let discount = 0
  if (couponCode) {
    const coupon = await validateCoupon(couponCode, subtotal, countryId)
    discount = coupon.discount_type === 'percent'
      ? subtotal * (coupon.discount_value / 100)
      : coupon.discount_value
  }

  // 7. Grand total
  const grandTotal = subtotal + deliveryFee + taxAmount + serviceFee - discount

  return { subtotal, deliveryFee, taxAmount, serviceFee, discount, grandTotal }
}
```

### Pincode Zone Configuration (Admin CSV Upload)
```csv
pincode,city,state,country_code,zone_type,delivery_fee,estimated_days
10001,New York,NY,US,metro,5.00,1-2
90001,Los Angeles,CA,US,metro,5.00,1-2
73301,Austin,TX,US,state,10.00,2-3
99501,Anchorage,AK,US,remote,25.00,5-7
```

---

## 6. Key Screens / Pages

### Customer App
| Page | Key Features |
|------|-------------|
| **Home / Landing** | Hero, featured products, country selector |
| **Login / Register** | Email + password, social login (Google), OTP |
| **Country Selection** | Flag + name grid, search |
| **Product Catalog** | Grid/list view, filters by category, price, search |
| **Product Detail** | Image gallery, description, stock status, Add to Cart |
| **Cart** | Item list, qty adjustments, remove, subtotal preview |
| **Checkout — Address** | Address form with Google Maps autocomplete, pincode validation |
| **Checkout — Summary** | Itemized price breakdown before payment |
| **Payment** | Stripe Elements embed (card, Apple Pay, Google Pay) |
| **Order Confirmation** | Order ID, tracking number, estimated delivery |
| **Order History** | List of past orders, status badges |
| **Order Detail** | Full order breakdown, track status |

### Warehouse Manager Portal
| Page | Key Features |
|------|-------------|
| **Manager Login** | Separate route `/manager/login` |
| **Dashboard** | Summary: total products, pending orders, low stock alerts |
| **Inventory List** | Table with search, filter by category, stock badge |
| **Add / Edit Product** | Form: name, price, description, category, stock, image upload |
| **Order Queue** | Incoming orders for this country, sorted by date |
| **Order Detail** | Customer info (name only, no personal data leak), items, address city/pincode |
| **Fulfillment** | Status dropdown: Confirmed → Packed → Shipped |

### Admin Panel
| Page | Key Features |
|------|-------------|
| **Admin Dashboard** | Revenue chart, orders by country, top products |
| **Country Management** | Add/edit country, tax rate, currency, activate/deactivate |
| **Manager Management** | Add/remove warehouse managers, assign country |
| **Pincode Manager** | CSV upload for bulk zone mapping, manual add |
| **Analytics** | Orders, revenue, conversion by country and date range |

---

## 7. Authentication & Authorization

### Roles (Cognito User Groups)
- `CUSTOMER` — default on registration
- `WAREHOUSE_MANAGER` — assigned by admin, has `country_scope_id`
- `SUPER_ADMIN` — full platform access

### Route Guards
```typescript
// Middleware on API routes
const guards = {
  customer:  ['CUSTOMER', 'WAREHOUSE_MANAGER', 'SUPER_ADMIN'],
  manager:   ['WAREHOUSE_MANAGER', 'SUPER_ADMIN'],
  admin:     ['SUPER_ADMIN'],
}

// Warehouse manager scoping — enforced at service layer
if (user.role === 'WAREHOUSE_MANAGER') {
  query.where.countryId = user.country_scope_id  // always injected
}
```

### Security Considerations
- All passwords handled by Cognito (no raw passwords in DB)
- JWTs signed by Cognito, verified server-side on every request
- Warehouse managers are hard-scoped to their country at API level
- Stripe webhook validated by signature header
- S3 bucket is private — images served via CloudFront signed URLs or public read with path obfuscation
- Rate limiting on auth endpoints (100 req/15min per IP)
- HTTPS enforced everywhere

---

## 8. Notifications Plan

| Event | Customer | Warehouse Manager |
|-------|----------|-------------------|
| Order placed | Email + SMS | Email + In-app |
| Payment confirmed | Email | — |
| Order packed | Email + SMS | — |
| Order shipped | Email + SMS with tracking | — |
| Order delivered | Email | — |
| Low stock | — | Email |
| New order assigned | — | Email + SMS |

### Tools
- **SendGrid**: Transactional email with HTML templates
- **Twilio**: SMS for order status updates
- **BullMQ**: Queue notifications so they don't block the API response

---

## 9. Mobile App Plan (Phase 4)

- Built with **React Native + Expo**
- Shares API with web app (same backend)
- Shares Zod validation schemas and TypeScript types via a shared `packages/shared` monorepo package
- Features parity with web customer experience (not manager portal — managers use web)
- Push notifications via **Expo Push Notifications** (wraps APNs + FCM)
- Deep links for order tracking URLs from emails

---

## 10. Monorepo Structure

```
gift-delivery/
├── apps/
│   ├── web/                  # Next.js customer + manager portal
│   ├── mobile/               # React Native Expo app
│   └── admin/                # Next.js admin panel (can share with web)
├── packages/
│   ├── api/                  # Express/NestJS backend
│   ├── shared/               # Shared types, Zod schemas, utils
│   └── ui/                   # Shared UI components (optional)
├── infra/
│   ├── terraform/            # AWS infrastructure as code
│   └── docker/               # Dockerfiles
├── scripts/
│   └── seed-pincodes.ts      # Bulk pincode import script
├── docs/
│   ├── BRD_DIAGRAM.md        # Client-facing BRD
│   └── DETAILED_PLAN.md      # This file
└── package.json              # Turborepo root
```

---

## 11. Third-Party Cost Estimate (Monthly, at 1000 orders/month)

| Service | Usage | Est. Monthly Cost |
|---------|-------|-------------------|
| AWS (EC2/ECS + RDS + Redis) | 2 small instances | ~$80–120 |
| AWS S3 + CloudFront | ~10GB storage, 100GB transfer | ~$15 |
| AWS Cognito | Up to 50k MAU free | $0 |
| Stripe | 1000 txns × avg $50 × 2.9% + $0.30 | ~$1,750 (collected from customers) |
| SendGrid | ~3000 emails/month | Free (up to 100/day) → ~$15/mo |
| Twilio SMS | ~2000 SMS × $0.0075 | ~$15 |
| Google Maps API | ~5000 requests | ~$85 |
| **Total Platform Cost** | | **~$330/month** |
| **Stripe Revenue** | Platform keeps 2% service fee | **~+$1,000/month on 1000 orders** |

> Note: Stripe fees are passed through as part of the transaction. The 2% platform service fee in the pricing engine covers Stripe fees and platform profit.

---

## 12. Phase-by-Phase Development Plan

### Phase 1 — Foundation (Weeks 1–6)
- [ ] Monorepo setup (Turborepo + TypeScript)
- [ ] AWS infrastructure provisioning (Terraform)
- [ ] PostgreSQL schema design + Prisma migrations
- [ ] AWS Cognito setup — user pools, roles
- [ ] Auth service: register, login, JWT middleware
- [ ] Country management + basic product catalog API
- [ ] Basic Next.js shell with login + country selection

### Phase 2 — Core Customer Flow (Weeks 7–12)
- [ ] Product catalog page + search + filters
- [ ] Shopping cart (Zustand + Redis backend)
- [ ] Pincode database population (major cities per target country)
- [ ] Pricing engine implementation
- [ ] Checkout flow — address form + Google Maps
- [ ] Stripe integration — PaymentIntent + webhook
- [ ] Order confirmation emails via SendGrid

### Phase 3 — Warehouse Portal (Weeks 8–13, parallel)
- [ ] Warehouse manager login route + role guard
- [ ] Inventory dashboard + product CRUD
- [ ] S3 image upload for products
- [ ] Order queue view for manager
- [ ] Fulfillment status updates
- [ ] SMS alerts via Twilio for new orders

### Phase 4 — Mobile App (Weeks 13–17)
- [ ] Expo project setup
- [ ] Auth flow (Cognito with Expo)
- [ ] Country selection + catalog screens
- [ ] Cart + checkout screens
- [ ] Payment via Stripe React Native SDK
- [ ] Order history + tracking screens
- [ ] Push notifications (Expo)

### Phase 5 — Admin Panel (Weeks 14–16)
- [ ] Super admin login + dashboard
- [ ] Country management UI
- [ ] Manager account creation
- [ ] Pincode CSV upload tool
- [ ] Revenue analytics charts

### Phase 6 — QA & Launch (Weeks 17–19)
- [ ] End-to-end testing (Playwright)
- [ ] Performance testing + caching optimization
- [ ] Security audit (OWASP checklist)
- [ ] UAT with client
- [ ] Production deployment + monitoring setup (CloudWatch)
- [ ] Go-live

---

## 13. Open Questions for Client

1. **Target countries at launch** — which countries first? (Affects pincode DB scope)
2. **Currency handling** — single currency or per-country currency with FX conversion?
3. **Physical delivery partner** — does the client have existing logistics partners per country, or use EasyPost?
4. **Manager portal access** — web-only for managers, or do they need mobile too?
5. **Returns / Refunds policy** — how should refunds be triggered and by whom?
6. **Product categories** — predefined global categories or each manager defines their own?
7. **Guest checkout** — allow ordering without account registration?
8. **Multi-language support** — one language or localization per country?
9. **Platform commission rate** — is 2% service fee acceptable or should it vary by country?
10. **Pincode data source** — does client have pincode-to-zone mapping, or do we build/buy that data?

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Pincode database incomplete | Orders fail for valid addresses | Phase 1: seed top 500 pincodes per country; add "request delivery" fallback |
| Payment failure rate high | Lost sales | Retry flow + multiple payment methods (card + PayPal) |
| Warehouse manager uploads wrong product to wrong country | Data integrity | Country scoping enforced at API + DB level, not just UI |
| Stripe not available in all target countries | Blocked payments | Evaluate per-country payment processors; add PayPal as fallback |
| Image storage costs scale fast | Budget overrun | Compress images on upload (Sharp.js), set max file size 2MB |
| Mobile app store approval delays | Launch delay | Start App Store submission 4 weeks before target launch |

---

*Continue development from **Phase 1 — Foundation**. Reference `BRD_DIAGRAM.md` for client presentations.*

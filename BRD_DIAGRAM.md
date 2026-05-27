# Gift Delivery Platform — Business Requirements Diagram

> **Purpose:** Client-facing overview of the platform architecture, user flows, modules, third-party integrations, and pricing engine logic.

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph CLIENT["CLIENT LAYER"]
        WEB["🌐 Web App\n(React / Next.js)"]
        MOB["📱 Mobile App\n(React Native)"]
    end

    subgraph API["API GATEWAY LAYER"]
        GW["API Gateway\n(AWS API Gateway / Kong)"]
        AUTH_MW["Auth Middleware\n(JWT Validation)"]
    end

    subgraph SERVICES["MICROSERVICES / BACKEND"]
        AUTH_SVC["Auth Service"]
        CATALOG_SVC["Product Catalog Service"]
        CART_SVC["Cart & Order Service"]
        PRICING_SVC["Pricing Engine"]
        PAYMENT_SVC["Payment Service"]
        WAREHOUSE_SVC["Warehouse / Inventory Service"]
        NOTIF_SVC["Notification Service"]
    end

    subgraph DATA["DATA LAYER"]
        DB["PostgreSQL\n(Primary DB)"]
        REDIS["Redis\n(Cache / Sessions)"]
        S3["AWS S3\n(Product Images)"]
    end

    subgraph THIRD_PARTY["THIRD-PARTY INTEGRATIONS"]
        COGNITO["AWS Cognito\n(Authentication)"]
        STRIPE["Stripe / PayPal\n(Payments)"]
        SENDGRID["SendGrid\n(Email)"]
        TWILIO["Twilio\n(SMS)"]
        MAPS["Google Maps API\n(Address Validation)"]
        CDN["CloudFront CDN\n(Static Assets)"]
        SHIP["EasyPost / ShipStation\n(Logistics)"]
    end

    WEB --> GW
    MOB --> GW
    GW --> AUTH_MW
    AUTH_MW --> AUTH_SVC
    AUTH_MW --> CATALOG_SVC
    AUTH_MW --> CART_SVC
    AUTH_MW --> PRICING_SVC
    AUTH_MW --> PAYMENT_SVC
    AUTH_MW --> WAREHOUSE_SVC
    AUTH_MW --> NOTIF_SVC

    AUTH_SVC --> COGNITO
    CATALOG_SVC --> DB
    CATALOG_SVC --> S3
    CART_SVC --> DB
    CART_SVC --> REDIS
    PRICING_SVC --> DB
    PAYMENT_SVC --> STRIPE
    WAREHOUSE_SVC --> DB
    WAREHOUSE_SVC --> S3
    NOTIF_SVC --> SENDGRID
    NOTIF_SVC --> TWILIO
    CART_SVC --> MAPS
    CART_SVC --> SHIP
    WEB --> CDN
    MOB --> CDN
```

---

## 2. Platform Modules

```mermaid
mindmap
  root((Gift Delivery Platform))
    Customer Portal
      User Registration & Login
      Country Selection
      Product Browsing & Search
      Shopping Cart
      Address Entry & Validation
      Checkout & Payment
      Order Tracking
      Order History
    Warehouse Manager Portal
      Secure Manager Login
      Inventory Dashboard
      Add / Edit / Delete Products
      Upload Product Photos
      Set Stock Quantities
      View Country Orders
      Update Order Fulfillment Status
    Pricing Engine
      Item Base Price
      Delivery Zone Lookup by Pincode
      Country Tax Calculation
      Platform Service Fee
      Discount & Coupon Engine
    Admin Super Panel
      Manage All Countries
      Manage Warehouse Managers
      Platform Analytics
      Revenue Reports
    Notifications
      Order Confirmation Email
      SMS Alerts
      Warehouse Manager Alerts
      Delivery Status Updates
```

---

## 3. Customer User Flow

```mermaid
flowchart TD
    A([User Lands on Website / Opens App]) --> B{Already Logged In?}
    B -- No --> C[Register / Login Page]
    C --> D[Authenticate via AWS Cognito]
    D --> E[Redirect to Country Selection]
    B -- Yes --> E

    E[Select Delivery Country] --> F[Product Catalog Loads\nFiltered by Country]
    F --> G[Browse / Search Products]
    G --> H[View Product Detail\nPhoto · Price · Description · Stock]
    H --> I{Add to Cart?}
    I -- Yes --> J[Shopping Cart]
    I -- No --> G
    J --> K{Continue Shopping?}
    K -- Yes --> G
    K -- No --> L[Proceed to Checkout]

    L --> M[Enter Recipient Address\n+ Pincode]
    M --> N[Google Maps Validates Address]
    N --> O[Pricing Engine Calculates Total]
    O --> P[Show Order Summary\nItems + Delivery + Tax + Service Fee]
    P --> Q{Confirm Order?}
    Q -- No --> L
    Q -- Yes --> R[Payment Page\nStripe / PayPal]
    R --> S{Payment Success?}
    S -- No --> T[Show Error · Retry]
    T --> R
    S -- Yes --> U[Order Confirmed]
    U --> V[Email + SMS Confirmation sent\nvia SendGrid + Twilio]
    V --> W[Warehouse Manager Notified]
    W --> X[Track Order Status]
```

---

## 4. Warehouse Manager Flow

```mermaid
flowchart TD
    A([Warehouse Manager]) --> B[Login to Manager Portal\nSeparate URL / Route]
    B --> C[Authenticate — Role: WAREHOUSE_MANAGER]
    C --> D{Country Scope Assigned?}
    D -- No --> Z[Access Denied]
    D -- Yes --> E[Dashboard — Country Inventory]

    E --> F{Choose Action}
    F --> G[Add New Product]
    F --> H[Edit Existing Product]
    F --> I[Update Stock Quantity]
    F --> J[View Incoming Orders]
    F --> K[Mark Order as Fulfilled]

    G --> G1[Fill: Name · Category · Price\nDescription · Photos · Stock]
    G1 --> G2[Upload Images to S3]
    G2 --> G3[Product Published to Catalog]

    H --> H1[Edit Product Details]
    H1 --> H2[Update Published]

    I --> I1[Enter New Quantity]
    I1 --> I2[Stock Updated · Low Stock Alert Triggered]

    J --> J1[View Orders for This Country]
    J1 --> J2[Order Detail — Items · Address · Pincode]

    K --> K1[Mark as Packed / Shipped]
    K1 --> K2[Customer Notified via SMS + Email]
```

---

## 5. Pricing Engine — How Price is Calculated

```mermaid
flowchart TD
    A[Customer Enters Pincode at Checkout] --> B[Pincode Lookup Service]

    B --> C{Pincode in Database?}
    C -- No --> D[Return: Unserviceable Area Error]
    C -- Yes --> E[Retrieve Delivery Zone for Pincode]

    E --> F{Zone Type}
    F --> Z1["Zone 1 — Metro City\nFlat Delivery: $5"]
    F --> Z2["Zone 2 — Same Region / State\nFlat Delivery: $10"]
    F --> Z3["Zone 3 — Different State\nFlat Delivery: $15"]
    F --> Z4["Zone 4 — Remote / Rural\nFlat Delivery: $20–25"]

    Z1 --> G[Get Country Tax Rate\nfrom Country Config Table]
    Z2 --> G
    Z3 --> G
    Z4 --> G

    G --> H[Calculate Price Breakdown]
    H --> H1["Items Subtotal\n= Sum of selected item prices × qty"]
    H1 --> H2["Delivery Fee\n= Zone-based flat rate"]
    H2 --> H3["Tax Amount\n= Items Subtotal × Country Tax %"]
    H3 --> H4["Service Fee\n= (Subtotal + Delivery) × 2%"]
    H4 --> H5["Discount\n= Apply coupon code if provided"]
    H5 --> I["GRAND TOTAL\n= Subtotal + Delivery + Tax + Service Fee − Discount"]

    I --> J[Display Itemized Price Breakdown to User]
    J --> K[User Confirms → Payment Gateway]
```

### Price Formula Reference

| Component | Calculation |
|-----------|-------------|
| **Items Subtotal** | `Σ (item_price × quantity)` |
| **Delivery Fee** | Zone lookup by pincode → flat rate |
| **Tax** | `items_subtotal × country_tax_rate` |
| **Service Fee** | `(subtotal + delivery) × 0.02` (2%) |
| **Coupon Discount** | Fixed amount or `subtotal × discount_%` |
| **Grand Total** | `subtotal + delivery + tax + service_fee − discount` |

---

## 6. Third-Party Tools & Integrations

```mermaid
graph LR
    subgraph AUTH["Authentication"]
        COGNITO["AWS Cognito\n✓ User pools\n✓ Social login\n✓ MFA\n✓ Role-based access\n💰 Free tier generous"]
    end

    subgraph PAYMENT["Payments"]
        STRIPE["Stripe\n✓ 135+ currencies\n✓ Country-based tax\n✓ Refunds\n💰 2.9% + $0.30/txn"]
        PAYPAL["PayPal (fallback)\n✓ Global reach\n💰 3.49% + fixed fee"]
    end

    subgraph COMMS["Communications"]
        SENDGRID["SendGrid\n✓ Order emails\n✓ Templates\n💰 Free: 100 emails/day"]
        TWILIO["Twilio\n✓ SMS alerts\n✓ Global SMS\n💰 ~$0.0075/SMS"]
    end

    subgraph MAPS["Location"]
        GMAPS["Google Maps API\n✓ Address autocomplete\n✓ Pincode validation\n💰 $17/1000 requests"]
    end

    subgraph MEDIA["Media / Storage"]
        S3["AWS S3\n✓ Product images\n✓ Scalable\n💰 ~$0.023/GB/month"]
        CF["AWS CloudFront CDN\n✓ Fast image delivery\n💰 ~$0.0085/GB"]
        CLOUDINARY["Cloudinary (alt)\n✓ Image transforms\n✓ Free tier\n💰 Free: 25GB storage"]
    end

    subgraph SHIP["Shipping"]
        EASYPOST["EasyPost\n✓ Multi-carrier API\n✓ Rate shopping\n💰 Pay per label"]
    end

    subgraph INFRA["Infrastructure"]
        AWS["AWS Stack\n✓ EC2 / ECS\n✓ RDS PostgreSQL\n✓ ElastiCache Redis\n✓ API Gateway"]
    end
```

---

## 7. Role Summary

| Role | Access | Scope |
|------|--------|-------|
| **Customer** | Web + Mobile App | Own orders, own profile |
| **Warehouse Manager** | Manager Portal (Web) | Products + Orders for assigned country only |
| **Super Admin** | Admin Panel | All countries, all managers, analytics |

---

## 8. High-Level Delivery Timeline

```mermaid
gantt
    title Gift Delivery Platform — Delivery Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1 — Foundation
    Project Setup & Architecture       :p1a, 2026-06-01, 2w
    Auth & User Management             :p1b, after p1a, 2w
    Country + Product Catalog          :p1c, after p1b, 3w

    section Phase 2 — Core Features
    Cart & Checkout Flow               :p2a, after p1c, 2w
    Pricing Engine + Pincode Zones     :p2b, after p2a, 2w
    Payment Integration (Stripe)       :p2c, after p2b, 2w

    section Phase 3 — Warehouse Portal
    Warehouse Manager Portal           :p3a, after p1c, 3w
    Inventory & Image Upload           :p3b, after p3a, 2w
    Order Management for Managers      :p3c, after p3b, 2w

    section Phase 4 — Notifications & Polish
    Email + SMS Notifications          :p4a, after p2c, 2w
    Order Tracking                     :p4b, after p4a, 1w
    Mobile App (React Native)          :p4c, after p3c, 4w

    section Phase 5 — Launch
    QA & UAT Testing                   :p5a, after p4b, 2w
    Deployment & Go-Live               :p5b, after p5a, 1w
```

---

*This diagram is generated for client presentation. Refer to `DETAILED_PLAN.md` for full technical specifications.*

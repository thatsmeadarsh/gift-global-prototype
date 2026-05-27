# Pre-Implementation Requirements
### GiftGlobal Platform — Client Action Items

**Prepared for:** Client  
**Prepared by:** Development Team  
**Date:** May 2026  
**Purpose:** This document lists everything we need from you before we begin building the platform. None of this requires technical knowledge — it is information only your business team can provide. The sooner these are ready, the smoother and faster the build will be.

---

## How to Use This Document

Each section below describes:
- **What we need** — the actual information or decision
- **Why we need it** — how it affects the platform
- **Format** — how to provide it (spreadsheet, email, document, etc.)
- **Priority** — whether it blocks the start of development or can come later

---

## 1. Delivery Zones & Postal Code Mapping

**What we need**

For each country you are launching in, we need a list of postal codes grouped into delivery zones — typically Metro (major cities), Standard (other towns), and Remote (rural areas) — with:
- The flat delivery fee for each zone
- The estimated number of delivery days for each zone

**Why we need it**

When a customer enters a delivery address, the platform automatically calculates the delivery charge and shows an estimated arrival date. Without this data, the platform cannot calculate a price and the customer cannot complete their order.

**Example of what this looks like**

| Country | Zone | Postal Code Range / Examples | Delivery Fee | Estimated Days |
|---------|------|------------------------------|--------------|----------------|
| Germany | Metro | 10115, 20095, 80331, 60311 | €5 | 1–2 days |
| Germany | Standard | 30001–39999, 40001–49999 | €10 | 2–3 days |
| Germany | Remote | 18001–19999 | €20 | 4–6 days |
| India | Metro | 110001, 400001, 560001, 600001 | ₹120 | 1–2 days |
| India | Standard | 380001–389999 | ₹200 | 2–4 days |
| India | Remote | 790001–799999 | ₹400 | 5–7 days |

**Format:** Excel or CSV spreadsheet, one sheet per country  
**Priority:** 🔴 Must have before development starts — this blocks the checkout feature entirely

---

## 2. Countries at Launch

**What we need**

A confirmed list of the countries the platform will operate in on Day 1, and a rough timeline for adding more countries in future phases.

**Why we need it**

Each country requires its own product catalog, warehouse manager, postal code data, tax configuration, currency, and potentially a different payment provider. Knowing the launch countries up front lets us build the right structure and avoid expensive rework later.

**Questions to answer:**
- Which countries are launching first?
- Is there a target launch date?
- Are there countries you plan to add within 6 months of launch?

**Format:** A simple list in an email or document  
**Priority:** 🔴 Must have before development starts

---

## 3. Tax Rates per Country

**What we need**

The official tax rate (VAT, GST, or sales tax) that applies to gift products in each country you are launching in.

**Why we need it**

The platform automatically adds tax to every order at checkout. This is displayed transparently to the customer before they pay. If the wrong rate is configured, you may under-collect or over-collect tax, which creates legal and accounting problems.

**Important notes:**
- Tax rates can vary by product category (e.g., food may be taxed differently than luxury goods)
- If your business has a tax accountant or legal advisor, they are the right person to confirm these numbers
- If you are unsure, tell us and we will apply a single rate per country as a starting point — but this should be confirmed before going live

**Example:**

| Country | Tax Rate | Tax Type |
|---------|----------|----------|
| Germany | 19% | VAT |
| India | 18% | GST |
| USA | 8.5% | Sales Tax (varies by state — confirm approach) |
| France | 20% | VAT |

**Format:** A simple table in an email or spreadsheet  
**Priority:** 🔴 Must have before development starts

---

## 4. Logistics & Delivery Partner

**What we need**

The name of the delivery company (courier, logistics provider) you will use in each country to physically ship orders from the warehouse to the customer's address.

**Why we need it**

The platform needs to connect with your delivery partner's system to:
- Generate shipping labels when a warehouse manager marks an order as "packed"
- Show customers a real tracking number and live tracking link
- Automatically update the order status when the parcel is out for delivery or delivered

If you do not have a delivery partner yet, the platform can still work — warehouse managers will manually enter tracking numbers — but the experience will be less automated.

**Questions to answer:**
- Do you have an existing delivery partner in each country?
- Do you want real-time tracking shown to customers?
- Does your delivery partner offer an API (a way for software systems to talk to each other)? Your delivery partner's technical team can confirm this.

**Format:** Name of the company and contact person, per country  
**Priority:** 🟡 Needed before launch, not before development starts — manual tracking can be used in the prototype

---

## 5. Payment Methods per Country

**What we need**

Confirmation of which payment methods customers should be able to use in each country.

**Why we need it**

Payment preferences vary significantly by country. We plan to integrate Stripe as the primary payment processor — but Stripe may not be the preferred option in every country, and some countries have popular local payment methods that customers expect to see.

**Common payment methods by country:**

| Country | Common Methods |
|---------|----------------|
| Germany | Credit card, PayPal, SEPA bank transfer, Klarna |
| India | UPI (Google Pay, PhonePe), Credit/Debit card, Net Banking, PayTM |
| USA | Credit/Debit card, Apple Pay, Google Pay, PayPal |
| France | Credit card, PayPal, Carte Bancaire |

**Questions to answer:**
- Which payment methods must be available at launch?
- Do you already have a Stripe account, or do we need to create one?
- Are there any payment methods you specifically want to exclude?

**Format:** A simple list per country  
**Priority:** 🔴 Must have before development starts — payment determines which provider we integrate

---

## 6. Refund & Returns Policy

**What we need**

A written policy that explains:
- Under what circumstances a customer can request a refund
- Who can approve a refund — the warehouse manager, or only a central admin?
- How long after purchase a refund can be requested
- Whether the customer needs to return the physical item or not (since these are gifts, returning to sender may not always apply)

**Why we need it**

The platform has a refund button in the admin panel. We need to know who can use it and under what conditions. This also needs to appear as a policy page on the website — legally required in most countries.

**Format:** A short written policy (bullet points are fine to start)  
**Priority:** 🟡 Needed before launch — can be drafted during development

---

## 7. Initial Product Catalog

**What we need**

For each country, a list of the products that will be available when the platform launches, including:
- Product name
- Short description (2–3 sentences)
- Price (in local currency)
- Category
- Stock quantity to start with
- A unique product code or SKU (if you have one — we can generate these if not)
- Product photos (high quality, ideally on a white or neutral background)

**Why we need it**

The platform will be empty at launch without products. Warehouse managers can add products themselves once the portal is live, but having a seed catalog ensures the platform is ready for customers on Day 1.

**Format:** Excel spreadsheet (one sheet per country) + a shared folder of product photos (Google Drive or Dropbox)  
**Priority:** 🟡 Needed before launch — can be provided during development

---

## 8. Warehouse Manager Details

**What we need**

For each country, the name and email address of the person who will manage the warehouse — adding products, updating stock, and processing orders.

**Why we need it**

We will create a login account for each warehouse manager in the system. Their access is restricted to their assigned country only — they cannot see or modify data from other countries.

**Format:** A simple list: Country → Full Name → Email Address  
**Priority:** 🟡 Needed before launch — can be provided 2 weeks before go-live

---

## 9. Platform Commission Rate

**What we need**

Confirmation of the platform service fee — the percentage added on top of each order that the platform keeps as revenue.

**Why we need it**

The platform currently applies a 2% service fee on every order (on top of the product price, delivery, and tax). This is shown to the customer at checkout. You may want a different rate per country, a different rate per product category, or a flat fee instead of a percentage.

**Questions to answer:**
- Is 2% the right rate across all countries?
- Should it vary by country?
- Should there be a minimum fee per order (e.g., at least €1 even on small orders)?

**Format:** A decision in an email  
**Priority:** 🔴 Must confirm before development starts — it is built into the pricing engine

---

## 10. Branding & Domain

**What we need**

- Your company logo (in SVG or high-resolution PNG format)
- Brand colours (hex codes, or just tell us "we use the same colours as our existing website")
- The domain name you want to use for the platform (e.g., `gifts.yourcompany.com`)
- Any existing brand guidelines document

**Why we need it**

The platform needs to look and feel like your brand, not a generic template. The domain name needs to be purchased and pointed at our servers before launch.

**Format:** Shared folder (Google Drive or email)  
**Priority:** 🟡 Needed 4 weeks before launch — can be applied during the final design phase

---

## 11. Legal Pages

**What we need**

Drafted versions of the following pages:
- **Privacy Policy** — how customer data is collected and used
- **Terms & Conditions** — the rules of using the platform
- **Returns & Refunds Policy** (covered in Section 6)
- **Cookie Policy** (required for EU countries — Germany, France)

**Why we need it**

These pages are legally required in most countries before you can operate an e-commerce platform that collects personal data and processes payments. We will design and place these pages — we just need the content from your legal team.

**Format:** Word documents or PDFs  
**Priority:** 🟡 Needed before launch — not before development starts, but cannot go live without them

---

## 12. Order Notification Content

**What we need**

The text content for automated emails and SMS messages that are sent to customers and warehouse managers. These include:

| Notification | Sent to | When |
|---|---|---|
| Order Confirmation | Customer | Immediately after payment |
| Order Packed | Customer | When manager marks as packed |
| Order Shipped | Customer | When manager marks as shipped (includes tracking) |
| Order Delivered | Customer | When delivered |
| New Order Alert | Warehouse Manager | When a new order arrives |
| Low Stock Alert | Warehouse Manager | When stock falls below threshold |

**Why we need it**

These messages go out automatically — customers and managers rely on them. The content needs to reflect your brand voice and include any legal disclaimers required in your markets. We will design the email templates; we just need the wording.

**Format:** A document with draft text for each notification  
**Priority:** 🟡 Needed before launch — can be drafted during development

---

## 13. Customer Support & Order Tracking Contacts per Country

**What we need**

For each country you are launching in, the details of the support channel customers should use if they have a question about their order — such as a delayed delivery, a missing parcel, or a damaged item.

This includes:
- A support email address (one per country, or a shared one if you prefer)
- A customer support phone number (optional but strongly recommended for markets like India and Germany where phone support is expected)
- Support operating hours and timezone (e.g. Mon–Fri, 9am–6pm IST)
- A WhatsApp number (optional — widely preferred in India and parts of Europe)

**Why we need it**

Once an order is placed, customers receive an email confirmation that includes a "Need help?" contact. If a delivery is late or a tracking number is not updating, customers need somewhere to go — without a clear contact, they will raise disputes with their bank or payment provider, which creates chargebacks and additional cost for you.

Additionally, the Order Tracking page on the platform will display:
- The current status of the order
- The courier tracking link (once shipped)
- A **"Contact Support"** button that shows the country-specific support details

Each country needs its own contact because:
- Time zones differ — a customer in India should not be given a German phone number with German office hours
- Language may differ
- The logistics partner handling the parcel may be different per country, so the relevant team to escalate to is different

**Example of what this looks like:**

| Country | Support Email | Phone | WhatsApp | Hours | Timezone |
|---------|--------------|-------|----------|-------|----------|
| Germany | support-de@yourcompany.com | +49 800 000 0000 | — | Mon–Fri 9am–6pm | CET |
| India | support-in@yourcompany.com | +91 1800 000 0000 | +91 98000 00000 | Mon–Sat 9am–7pm | IST |
| USA | support-us@yourcompany.com | +1 800 000 0000 | — | Mon–Fri 8am–5pm | EST |
| France | support-fr@yourcompany.com | +33 800 000 000 | — | Mon–Fri 9am–6pm | CET |

**Questions to answer:**
- Does your team handle support in-house, or do you use an outsourced support provider?
- Should the customer email the support team directly, or go through a helpdesk tool like Zendesk or Freshdesk? (If you use one, let us know — we can link directly to it.)
- For countries where you do not yet have a local support number, is a shared international email address acceptable as a starting point?

**Format:** A table (as above) in an email or spreadsheet, one row per country  
**Priority:** 🟡 Needed before launch — customers must always have somewhere to go after placing an order

---

## 14. Guest Checkout Decision

**What we need**

A simple yes or no: should customers be able to place an order without creating an account?

**Why we need it**

Requiring an account before checkout reduces drop-off for some customers but gives you richer customer data and makes follow-up (re-marketing, loyalty programmes) easier. Allowing guest checkout typically increases conversion rates but means you know less about who is buying.

**Questions to answer:**
- Allow guest checkout?
- If yes, should we ask guests to create an account after the order is placed?

**Format:** A decision in an email  
**Priority:** 🔴 Must have before development starts — it affects the authentication architecture

---

## 14. Multi-Language Support

**What we need**

A decision on whether the platform should be available in multiple languages, and if so, which ones.

**Why we need it**

Offering the platform in local languages (German for Germany, French for France, Hindi for India) significantly improves conversion rates and trust. However, it also requires translated content for every page, product description, and notification — which is a meaningful amount of work and ongoing maintenance.

**Options:**
1. English only (simplest, fastest to build)
2. English + one language per country (recommended if your customers are local)
3. Full localisation with language switcher

**Format:** A decision in an email  
**Priority:** 🟡 Needs a decision before development starts, but translation content can come later

---

## Summary Checklist

| # | Item | Priority | Owner (Client) | Target Date |
|---|------|----------|----------------|-------------|
| 1 | Postal code zone mapping (delivery fees + days) per country | 🔴 Blocks dev | Logistics / Ops team | |
| 2 | Confirmed list of launch countries | 🔴 Blocks dev | Management | |
| 3 | Tax rates per country | 🔴 Blocks dev | Finance / Legal | |
| 4 | Logistics / delivery partner name per country | 🟡 Before launch | Logistics team | |
| 5 | Payment methods + Stripe account | 🔴 Blocks dev | Finance team | |
| 6 | Refund & returns policy | 🟡 Before launch | Management / Legal | |
| 7 | Initial product catalog + photos | 🟡 Before launch | Warehouse / Ops | |
| 8 | Warehouse manager names & emails | 🟡 Before launch | Management | |
| 9 | Platform service fee rate | 🔴 Blocks dev | Management | |
| 10 | Logo, brand colours, domain name | 🟡 4 weeks before launch | Marketing | |
| 11 | Legal pages (Privacy, T&C, Cookie Policy) | 🟡 Before launch | Legal | |
| 12 | Notification email / SMS content | 🟡 Before launch | Marketing | |
| 13 | Customer support contacts + hours per country | 🟡 Before launch | Operations / Customer Support | |
| 14 | Guest checkout — yes or no | 🔴 Blocks dev | Management | |
| 15 | Multi-language — yes or no | 🟡 Before dev starts | Management | |

**Legend:**  
🔴 Must be decided/provided before we write the first line of code  
🟡 Must be ready before the platform goes live — can be finalised during development

---

## Next Steps

1. **Review this document** with the relevant people in your team (ops, finance, legal, marketing).
2. **Fill in the "Target Date" column** for each item so both teams have clear expectations.
3. **Send us your answers** — even a quick email for the 🔴 items is enough to unblock us.
4. We will schedule a 1-hour **kickoff call** once the 🔴 items are confirmed.

For any questions about what is being asked, please reach out — we are happy to walk through any of these items on a call.

---

*Document version 1.1 — May 2026*  
*This document will be updated as new requirements are identified during the discovery phase.*

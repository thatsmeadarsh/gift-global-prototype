export interface Country {
  id: string
  code: string
  name: string
  flag: string
  currency: string
  currencySymbol: string
  taxRate: number
  manager: string
  managerEmail: string
  timezone: string
}

export interface Product {
  id: string
  countryId: string
  name: string
  category: string
  price: number
  stock: number
  lowStockThreshold: number
  isActive: boolean
  description: string
  sku: string
  imageColor: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  countryId: string
  customerName: string
  city: string
  pincode: string
  zone: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  serviceFee: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: 'paid' | 'pending' | 'refunded'
  createdAt: string
  updatedAt: string
}

export const COUNTRIES: Country[] = [
  {
    id: 'de',
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    taxRate: 19,
    manager: 'Klaus Weber',
    managerEmail: 'k.weber@giftplatform.de',
    timezone: 'CET',
  },
  {
    id: 'in',
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 18,
    manager: 'Priya Sharma',
    managerEmail: 'p.sharma@giftplatform.in',
    timezone: 'IST',
  },
  {
    id: 'us',
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 8.5,
    manager: 'John Smith',
    managerEmail: 'j.smith@giftplatform.us',
    timezone: 'EST',
  },
  {
    id: 'fr',
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    taxRate: 20,
    manager: 'Marie Dupont',
    managerEmail: 'm.dupont@giftplatform.fr',
    timezone: 'CET',
  },
]

export const PRODUCTS: Product[] = [
  // Germany
  { id: 'p-de-1', countryId: 'de', name: 'Premium Beer Stein Set', category: 'Drinkware', price: 49.99, stock: 142, lowStockThreshold: 20, isActive: true, description: 'Hand-crafted Bavarian beer stein, set of 2, with pewter lid.', sku: 'DE-DRK-001', imageColor: '#b45309' },
  { id: 'p-de-2', countryId: 'de', name: 'Black Forest Cuckoo Clock', category: 'Home Décor', price: 129.00, stock: 38, lowStockThreshold: 10, isActive: true, description: 'Authentic hand-painted wooden cuckoo clock from the Black Forest.', sku: 'DE-DEC-001', imageColor: '#78350f' },
  { id: 'p-de-3', countryId: 'de', name: 'Gourmet Lebkuchen Box', category: 'Food & Sweets', price: 22.50, stock: 8, lowStockThreshold: 15, isActive: true, description: 'Assorted Nuremberg gingerbread hearts and rounds, 500g box.', sku: 'DE-FD-001', imageColor: '#d97706' },
  { id: 'p-de-4', countryId: 'de', name: 'Meissen Porcelain Figurine', category: 'Collectibles', price: 245.00, stock: 12, lowStockThreshold: 5, isActive: true, description: 'Hand-painted Meissen blue onion porcelain figurine.', sku: 'DE-COL-001', imageColor: '#1d4ed8' },
  { id: 'p-de-5', countryId: 'de', name: 'Automotive Tool Kit', category: 'Automotive', price: 89.99, stock: 0, lowStockThreshold: 10, isActive: false, description: '72-piece professional metric tool kit in carry case.', sku: 'DE-AUTO-001', imageColor: '#374151' },
  { id: 'p-de-6', countryId: 'de', name: 'Advent Calendar Gift Set', category: 'Seasonal', price: 39.99, stock: 65, lowStockThreshold: 20, isActive: true, description: '24-day wooden advent calendar with premium chocolate fillings.', sku: 'DE-SEAS-001', imageColor: '#7c3aed' },

  // India
  { id: 'p-in-1', countryId: 'in', name: 'Banarasi Silk Saree', category: 'Apparel', price: 3499, stock: 28, lowStockThreshold: 10, isActive: true, description: 'Handwoven Banarasi silk saree with gold zari border.', sku: 'IN-APP-001', imageColor: '#be185d' },
  { id: 'p-in-2', countryId: 'in', name: 'Darjeeling Tea Collection', category: 'Food & Beverage', price: 899, stock: 210, lowStockThreshold: 30, isActive: true, description: 'Premium first-flush Darjeeling tea, 4 varieties, 50g each.', sku: 'IN-FD-001', imageColor: '#16a34a' },
  { id: 'p-in-3', countryId: 'in', name: 'Kashmiri Pashmina Shawl', category: 'Apparel', price: 4999, stock: 14, lowStockThreshold: 5, isActive: true, description: 'Pure hand-spun Kashmiri pashmina in natural ivory.', sku: 'IN-APP-002', imageColor: '#f9fafb' },
  { id: 'p-in-4', countryId: 'in', name: 'Ayurvedic Wellness Kit', category: 'Health & Wellness', price: 1299, stock: 76, lowStockThreshold: 20, isActive: true, description: 'Triphala, Ashwagandha, Turmeric blend — 3 month supply.', sku: 'IN-HW-001', imageColor: '#ca8a04' },
  { id: 'p-in-5', countryId: 'in', name: 'Blue Pottery Dinner Set', category: 'Home Décor', price: 2199, stock: 4, lowStockThreshold: 8, isActive: true, description: 'Hand-painted Jaipur blue pottery, 12-piece dinner set.', sku: 'IN-DEC-001', imageColor: '#0ea5e9' },
  { id: 'p-in-6', countryId: 'in', name: 'Sandalwood Incense Gift Box', category: 'Gifts', price: 549, stock: 180, lowStockThreshold: 40, isActive: true, description: 'Mysore sandalwood incense sticks, 100 pcs with brass holder.', sku: 'IN-GFT-001', imageColor: '#d97706' },

  // United States
  { id: 'p-us-1', countryId: 'us', name: 'NBA Team Merchandise Bundle', category: 'Sports', price: 79.99, stock: 95, lowStockThreshold: 25, isActive: true, description: 'Jersey, cap, and water bottle — choose your team.', sku: 'US-SPT-001', imageColor: '#dc2626' },
  { id: 'p-us-2', countryId: 'us', name: 'Artisan Coffee Sampler Box', category: 'Food & Beverage', price: 49.99, stock: 133, lowStockThreshold: 30, isActive: true, description: '8 single-origin roasts from across the Americas, 60g each.', sku: 'US-FD-001', imageColor: '#292524' },
  { id: 'p-us-3', countryId: 'us', name: 'Yeti Tumbler Combo Set', category: 'Drinkware', price: 119.99, stock: 51, lowStockThreshold: 15, isActive: true, description: '30oz Rambler + 20oz travel mug in matching colorway.', sku: 'US-DRK-001', imageColor: '#475569' },
  { id: 'p-us-4', countryId: 'us', name: 'Board Game Collection', category: 'Games', price: 64.99, stock: 3, lowStockThreshold: 10, isActive: true, description: 'Premium 3-game bundle: Catan, Ticket to Ride, Pandemic.', sku: 'US-GME-001', imageColor: '#059669' },
  { id: 'p-us-5', countryId: 'us', name: 'National Park Print Set', category: 'Art & Prints', price: 44.99, stock: 88, lowStockThreshold: 20, isActive: true, description: '6 archival prints of iconic US national parks, 8×10.', sku: 'US-ART-001', imageColor: '#065f46' },
  { id: 'p-us-6', countryId: 'us', name: 'Gourmet BBQ Spice Kit', category: 'Food & Beverage', price: 34.99, stock: 0, lowStockThreshold: 15, isActive: false, description: '10 artisan rubs and spice blends for pit masters.', sku: 'US-FD-002', imageColor: '#991b1b' },

  // France
  { id: 'p-fr-1', countryId: 'fr', name: 'Bordeaux Wine Tasting Set', category: 'Wine & Spirits', price: 89.00, stock: 42, lowStockThreshold: 12, isActive: true, description: 'Curated trio of Bordeaux AOC reds, 2019 vintage.', sku: 'FR-WN-001', imageColor: '#7f1d1d' },
  { id: 'p-fr-2', countryId: 'fr', name: 'L\'Occitane Lavender Gift Set', category: 'Beauty & Fragrance', price: 65.00, stock: 78, lowStockThreshold: 20, isActive: true, description: 'Hand cream, shower gel, soap — Provence lavender collection.', sku: 'FR-BTY-001', imageColor: '#7c3aed' },
  { id: 'p-fr-3', countryId: 'fr', name: 'Artisan Cheese Selection', category: 'Food & Gourmet', price: 54.00, stock: 9, lowStockThreshold: 10, isActive: true, description: 'Camembert, Comté, Roquefort, Brie — curated fromager selection.', sku: 'FR-FD-001', imageColor: '#fbbf24' },
  { id: 'p-fr-4', countryId: 'fr', name: 'Limoges Porcelain Box', category: 'Collectibles', price: 78.00, stock: 22, lowStockThreshold: 8, isActive: true, description: 'Hand-painted Limoges trinket box, floral motif.', sku: 'FR-COL-001', imageColor: '#db2777' },
  { id: 'p-fr-5', countryId: 'fr', name: 'Mariage Frères Tea Gift Box', category: 'Food & Beverage', price: 42.00, stock: 110, lowStockThreshold: 25, isActive: true, description: 'Marco Polo and Earl Grey Imperial, 50 sachets each.', sku: 'FR-FD-002', imageColor: '#92400e' },
  { id: 'p-fr-6', countryId: 'fr', name: 'Écharpe Hermès Style Scarf', category: 'Accessories', price: 145.00, stock: 0, lowStockThreshold: 5, isActive: false, description: 'Silk-blend printed square scarf, 90×90cm.', sku: 'FR-ACC-001', imageColor: '#b45309' },
]

function makeDate(daysAgo: number, hoursAgo = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(d.getHours() - hoursAgo)
  return d.toISOString()
}

export const ORDERS: Order[] = [
  // Germany orders
  {
    id: 'ORD-DE-0091', countryId: 'de', customerName: 'Tobias Müller', city: 'Berlin', pincode: '10115', zone: 'Metro',
    items: [{ productId: 'p-de-1', productName: 'Premium Beer Stein Set', quantity: 2, unitPrice: 49.99 }],
    subtotal: 99.98, deliveryFee: 5, tax: 18.99, serviceFee: 2.10, discount: 0, total: 126.07,
    status: 'pending', paymentStatus: 'paid', createdAt: makeDate(0, 2), updatedAt: makeDate(0, 2),
  },
  {
    id: 'ORD-DE-0090', countryId: 'de', customerName: 'Anneliese Braun', city: 'Munich', pincode: '80331', zone: 'Metro',
    items: [
      { productId: 'p-de-2', productName: 'Black Forest Cuckoo Clock', quantity: 1, unitPrice: 129.00 },
      { productId: 'p-de-3', productName: 'Gourmet Lebkuchen Box', quantity: 2, unitPrice: 22.50 },
    ],
    subtotal: 174.00, deliveryFee: 5, tax: 33.06, serviceFee: 3.58, discount: 0, total: 215.64,
    status: 'confirmed', paymentStatus: 'paid', createdAt: makeDate(1), updatedAt: makeDate(0, 8),
  },
  {
    id: 'ORD-DE-0089', countryId: 'de', customerName: 'Hans Fischer', city: 'Hamburg', pincode: '20095', zone: 'Metro',
    items: [{ productId: 'p-de-6', productName: 'Advent Calendar Gift Set', quantity: 3, unitPrice: 39.99 }],
    subtotal: 119.97, deliveryFee: 5, tax: 22.79, serviceFee: 2.50, discount: 10, total: 140.26,
    status: 'packed', paymentStatus: 'paid', createdAt: makeDate(2), updatedAt: makeDate(1, 3),
  },
  {
    id: 'ORD-DE-0088', countryId: 'de', customerName: 'Greta Hoffmann', city: 'Frankfurt', pincode: '60311', zone: 'Metro',
    items: [{ productId: 'p-de-4', productName: 'Meissen Porcelain Figurine', quantity: 1, unitPrice: 245.00 }],
    subtotal: 245.00, deliveryFee: 5, tax: 46.55, serviceFee: 5.00, discount: 0, total: 301.55,
    status: 'shipped', paymentStatus: 'paid', createdAt: makeDate(3), updatedAt: makeDate(1),
  },
  {
    id: 'ORD-DE-0087', countryId: 'de', customerName: 'Werner Schmidt', city: 'Cologne', pincode: '50667', zone: 'Metro',
    items: [{ productId: 'p-de-1', productName: 'Premium Beer Stein Set', quantity: 1, unitPrice: 49.99 }],
    subtotal: 49.99, deliveryFee: 5, tax: 9.50, serviceFee: 1.10, discount: 0, total: 65.59,
    status: 'delivered', paymentStatus: 'paid', createdAt: makeDate(7), updatedAt: makeDate(4),
  },

  // India orders
  {
    id: 'ORD-IN-0241', countryId: 'in', customerName: 'Rahul Gupta', city: 'Mumbai', pincode: '400001', zone: 'Metro',
    items: [{ productId: 'p-in-1', productName: 'Banarasi Silk Saree', quantity: 1, unitPrice: 3499 }],
    subtotal: 3499, deliveryFee: 120, tax: 629.82, serviceFee: 72.38, discount: 0, total: 4321.20,
    status: 'pending', paymentStatus: 'paid', createdAt: makeDate(0, 1), updatedAt: makeDate(0, 1),
  },
  {
    id: 'ORD-IN-0240', countryId: 'in', customerName: 'Kavitha Nair', city: 'Bangalore', pincode: '560001', zone: 'Metro',
    items: [
      { productId: 'p-in-2', productName: 'Darjeeling Tea Collection', quantity: 2, unitPrice: 899 },
      { productId: 'p-in-6', productName: 'Sandalwood Incense Gift Box', quantity: 1, unitPrice: 549 },
    ],
    subtotal: 2347, deliveryFee: 120, tax: 422.46, serviceFee: 49.34, discount: 200, total: 2738.80,
    status: 'confirmed', paymentStatus: 'paid', createdAt: makeDate(1), updatedAt: makeDate(0, 6),
  },
  {
    id: 'ORD-IN-0239', countryId: 'in', customerName: 'Arjun Mehta', city: 'Delhi', pincode: '110001', zone: 'Metro',
    items: [{ productId: 'p-in-4', productName: 'Ayurvedic Wellness Kit', quantity: 2, unitPrice: 1299 }],
    subtotal: 2598, deliveryFee: 120, tax: 467.64, serviceFee: 54.36, discount: 0, total: 3240.00,
    status: 'packed', paymentStatus: 'paid', createdAt: makeDate(2), updatedAt: makeDate(1, 5),
  },
  {
    id: 'ORD-IN-0238', countryId: 'in', customerName: 'Sunita Reddy', city: 'Hyderabad', pincode: '500001', zone: 'Metro',
    items: [{ productId: 'p-in-3', productName: 'Kashmiri Pashmina Shawl', quantity: 1, unitPrice: 4999 }],
    subtotal: 4999, deliveryFee: 120, tax: 899.82, serviceFee: 102.38, discount: 500, total: 5621.20,
    status: 'shipped', paymentStatus: 'paid', createdAt: makeDate(4), updatedAt: makeDate(2),
  },
  {
    id: 'ORD-IN-0237', countryId: 'in', customerName: 'Vikram Patel', city: 'Ahmedabad', pincode: '380001', zone: 'State',
    items: [{ productId: 'p-in-2', productName: 'Darjeeling Tea Collection', quantity: 3, unitPrice: 899 }],
    subtotal: 2697, deliveryFee: 200, tax: 485.46, serviceFee: 57.94, discount: 0, total: 3440.40,
    status: 'delivered', paymentStatus: 'paid', createdAt: makeDate(6), updatedAt: makeDate(3),
  },
  {
    id: 'ORD-IN-0236', countryId: 'in', customerName: 'Deepa Krishnan', city: 'Chennai', pincode: '600001', zone: 'Metro',
    items: [{ productId: 'p-in-5', productName: 'Blue Pottery Dinner Set', quantity: 1, unitPrice: 2199 }],
    subtotal: 2199, deliveryFee: 120, tax: 395.82, serviceFee: 46.38, discount: 0, total: 2761.20,
    status: 'cancelled', paymentStatus: 'refunded', createdAt: makeDate(5), updatedAt: makeDate(4),
  },

  // US orders
  {
    id: 'ORD-US-0178', countryId: 'us', customerName: 'Emily Johnson', city: 'New York', pincode: '10001', zone: 'Metro',
    items: [{ productId: 'p-us-1', productName: 'NBA Team Merchandise Bundle', quantity: 1, unitPrice: 79.99 }],
    subtotal: 79.99, deliveryFee: 5, tax: 6.80, serviceFee: 1.70, discount: 0, total: 93.49,
    status: 'pending', paymentStatus: 'paid', createdAt: makeDate(0, 3), updatedAt: makeDate(0, 3),
  },
  {
    id: 'ORD-US-0177', countryId: 'us', customerName: 'Michael Brown', city: 'Los Angeles', pincode: '90001', zone: 'Metro',
    items: [
      { productId: 'p-us-2', productName: 'Artisan Coffee Sampler Box', quantity: 2, unitPrice: 49.99 },
      { productId: 'p-us-3', productName: 'Yeti Tumbler Combo Set', quantity: 1, unitPrice: 119.99 },
    ],
    subtotal: 219.97, deliveryFee: 5, tax: 18.70, serviceFee: 4.50, discount: 20, total: 228.17,
    status: 'confirmed', paymentStatus: 'paid', createdAt: makeDate(1), updatedAt: makeDate(0, 10),
  },
  {
    id: 'ORD-US-0176', countryId: 'us', customerName: 'Sarah Davis', city: 'Chicago', pincode: '60601', zone: 'Metro',
    items: [{ productId: 'p-us-5', productName: 'National Park Print Set', quantity: 2, unitPrice: 44.99 }],
    subtotal: 89.98, deliveryFee: 5, tax: 7.65, serviceFee: 1.90, discount: 0, total: 104.53,
    status: 'packed', paymentStatus: 'paid', createdAt: makeDate(2), updatedAt: makeDate(1, 2),
  },
  {
    id: 'ORD-US-0175', countryId: 'us', customerName: 'James Wilson', city: 'Austin', pincode: '73301', zone: 'State',
    items: [{ productId: 'p-us-4', productName: 'Board Game Collection', quantity: 1, unitPrice: 64.99 }],
    subtotal: 64.99, deliveryFee: 10, tax: 5.52, serviceFee: 1.50, discount: 0, total: 82.01,
    status: 'shipped', paymentStatus: 'paid', createdAt: makeDate(3), updatedAt: makeDate(1, 8),
  },
  {
    id: 'ORD-US-0174', countryId: 'us', customerName: 'Lisa Martinez', city: 'Miami', pincode: '33101', zone: 'Metro',
    items: [{ productId: 'p-us-3', productName: 'Yeti Tumbler Combo Set', quantity: 1, unitPrice: 119.99 }],
    subtotal: 119.99, deliveryFee: 5, tax: 10.20, serviceFee: 2.50, discount: 0, total: 137.69,
    status: 'delivered', paymentStatus: 'paid', createdAt: makeDate(8), updatedAt: makeDate(5),
  },

  // France orders
  {
    id: 'ORD-FR-0063', countryId: 'fr', customerName: 'Pierre Martin', city: 'Paris', pincode: '75001', zone: 'Metro',
    items: [
      { productId: 'p-fr-1', productName: 'Bordeaux Wine Tasting Set', quantity: 2, unitPrice: 89.00 },
      { productId: 'p-fr-3', productName: 'Artisan Cheese Selection', quantity: 1, unitPrice: 54.00 },
    ],
    subtotal: 232.00, deliveryFee: 5, tax: 46.40, serviceFee: 4.74, discount: 0, total: 288.14,
    status: 'pending', paymentStatus: 'paid', createdAt: makeDate(0, 4), updatedAt: makeDate(0, 4),
  },
  {
    id: 'ORD-FR-0062', countryId: 'fr', customerName: 'Camille Bernard', city: 'Lyon', pincode: '69001', zone: 'Metro',
    items: [{ productId: 'p-fr-2', productName: "L'Occitane Lavender Gift Set", quantity: 3, unitPrice: 65.00 }],
    subtotal: 195.00, deliveryFee: 5, tax: 39.00, serviceFee: 4.00, discount: 15, total: 228.00,
    status: 'confirmed', paymentStatus: 'paid', createdAt: makeDate(1), updatedAt: makeDate(0, 7),
  },
  {
    id: 'ORD-FR-0061', countryId: 'fr', customerName: 'Julien Petit', city: 'Marseille', pincode: '13001', zone: 'Metro',
    items: [{ productId: 'p-fr-4', productName: 'Limoges Porcelain Box', quantity: 1, unitPrice: 78.00 }],
    subtotal: 78.00, deliveryFee: 5, tax: 15.60, serviceFee: 1.66, discount: 0, total: 100.26,
    status: 'packed', paymentStatus: 'paid', createdAt: makeDate(2), updatedAt: makeDate(1, 1),
  },
  {
    id: 'ORD-FR-0060', countryId: 'fr', customerName: 'Sophie Leroy', city: 'Bordeaux', pincode: '33000', zone: 'Metro',
    items: [{ productId: 'p-fr-5', productName: 'Mariage Frères Tea Gift Box', quantity: 2, unitPrice: 42.00 }],
    subtotal: 84.00, deliveryFee: 5, tax: 16.80, serviceFee: 1.78, discount: 0, total: 107.58,
    status: 'shipped', paymentStatus: 'paid', createdAt: makeDate(4), updatedAt: makeDate(2),
  },
  {
    id: 'ORD-FR-0059', countryId: 'fr', customerName: 'Antoine Moreau', city: 'Nice', pincode: '06000', zone: 'Metro',
    items: [{ productId: 'p-fr-1', productName: 'Bordeaux Wine Tasting Set', quantity: 1, unitPrice: 89.00 }],
    subtotal: 89.00, deliveryFee: 5, tax: 17.80, serviceFee: 1.88, discount: 0, total: 113.68,
    status: 'delivered', paymentStatus: 'paid', createdAt: makeDate(9), updatedAt: makeDate(6),
  },
]

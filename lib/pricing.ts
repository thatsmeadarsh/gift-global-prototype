import { COUNTRIES } from './mock-data'

export interface ZoneResult {
  zone: string
  zoneType: 'metro' | 'state' | 'remote'
  deliveryFee: number
  estimatedDays: string
}

const ZONE_FEES: Record<string, { metro: number; state: number; remote: number }> = {
  de:  { metro: 5,   state: 10,  remote: 20 },
  in:  { metro: 120, state: 200, remote: 400 },
  us:  { metro: 5,   state: 10,  remote: 25 },
  fr:  { metro: 5,   state: 10,  remote: 20 },
}

// Metro pincodes per country (prefix-based for prototype)
const METRO_PREFIXES: Record<string, string[]> = {
  de: ['10', '20', '22', '80', '81', '82', '60', '50', '40', '70'],
  in: ['10', '11', '40', '41', '56', '60', '50'],
  us: ['100', '101', '900', '901', '606', '331', '770'],
  fr: ['750', '751', '752', '753', '690', '691', '130'],
}

const STATE_PREFIXES: Record<string, string[]> = {
  de: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  in: ['2', '3', '4', '5', '6', '7', '8', '9'],
  us: ['3', '4', '5', '6', '7', '8', '9'],
  fr: ['3', '4', '5', '6', '7', '8', '9'],
}

const PIN_FORMATS: Record<string, RegExp> = {
  de: /^\d{5}$/,
  in: /^\d{6}$/,
  us: /^\d{5}(-\d{4})?$/,
  fr: /^\d{5}$/,
}

export function lookupZone(pincode: string, countryId: string): ZoneResult | null {
  const fmt = PIN_FORMATS[countryId]
  if (!fmt || !fmt.test(pincode)) return null

  const fees = ZONE_FEES[countryId]
  const metro = METRO_PREFIXES[countryId] ?? []
  const normalPin = pincode.replace('-', '')

  const isMetro = metro.some((p) => normalPin.startsWith(p))
  if (isMetro) {
    return { zone: 'Metro', zoneType: 'metro', deliveryFee: fees.metro, estimatedDays: '1–2' }
  }

  const stateZone = STATE_PREFIXES[countryId]?.some((p) => normalPin.startsWith(p))
  if (stateZone) {
    return { zone: 'Standard', zoneType: 'state', deliveryFee: fees.state, estimatedDays: '2–4' }
  }

  return { zone: 'Remote', zoneType: 'remote', deliveryFee: fees.remote, estimatedDays: '4–7' }
}

export interface PricingResult {
  subtotal: number
  deliveryFee: number
  tax: number
  serviceFee: number
  total: number
  zone: ZoneResult
}

export function calculatePricing(
  items: { price: number; quantity: number }[],
  pincode: string,
  countryId: string
): PricingResult | null {
  const zone = lookupZone(pincode, countryId)
  if (!zone) return null

  const country = COUNTRIES.find((c) => c.id === countryId)!
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = zone.deliveryFee
  const tax = subtotal * (country.taxRate / 100)
  const serviceFee = (subtotal + deliveryFee) * 0.02
  const total = subtotal + deliveryFee + tax + serviceFee

  return { subtotal, deliveryFee, tax, serviceFee, total, zone }
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { COUNTRIES } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-store"
import { calculatePricing, lookupZone } from "@/lib/pricing"
import { MapPin, CreditCard, AlertCircle, ChevronRight } from "lucide-react"

interface AddressForm {
  recipientName: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

const EMPTY: AddressForm = {
  recipientName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "",
}

const PLACEHOLDERS: Record<string, Partial<AddressForm>> = {
  de: { pincode: "10115", city: "Berlin", state: "Berlin", line1: "Unter den Linden 1", recipientName: "Hans Müller", phone: "+49 30 123456" },
  in: { pincode: "400001", city: "Mumbai", state: "Maharashtra", line1: "Marine Lines", recipientName: "Rahul Gupta", phone: "+91 98765 43210" },
  us: { pincode: "10001", city: "New York", state: "NY", line1: "123 Fifth Avenue", recipientName: "Emily Johnson", phone: "+1 212 555 0100" },
  fr: { pincode: "75001", city: "Paris", state: "Île-de-France", line1: "1 Rue de Rivoli", recipientName: "Pierre Martin", phone: "+33 1 23 45 67 89" },
}

const PIN_LABEL: Record<string, string> = {
  de: "Postleitzahl (5 digits)",
  in: "PIN Code (6 digits)",
  us: "ZIP Code (5 digits)",
  fr: "Code Postal (5 digits)",
}

const STATE_LABEL: Record<string, string> = {
  de: "State / Bundesland",
  in: "State",
  us: "State (abbreviation)",
  fr: "Region",
}

export default function CheckoutPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const router = useRouter()
  const country = COUNTRIES.find((c) => c.id === countryId)!
  const { items, clearCart } = useCart()

  const [form, setForm] = useState<AddressForm>(EMPTY)
  const [pincodeError, setPincodeError] = useState("")
  const [step, setStep] = useState<"address" | "payment">("address")
  const [placing, setPlacing] = useState(false)

  const ph = PLACEHOLDERS[countryId] ?? {}

  function f(key: keyof AddressForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      if (key === "pincode") setPincodeError("")
    }
  }

  const cartItems = items.map((i) => ({ price: i.product.price, quantity: i.quantity }))
  const pricing = form.pincode
    ? calculatePricing(cartItems, form.pincode, countryId)
    : null

  function validateAddress() {
    if (!form.recipientName || !form.line1 || !form.city || !form.pincode) return false
    const zone = lookupZone(form.pincode, countryId)
    if (!zone) {
      setPincodeError("Invalid or unserviceable postal code for " + country.name)
      return false
    }
    return true
  }

  async function placeOrder() {
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 1400))
    const orderId = `ORD-${countryId.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`
    clearCart()
    router.push(`/shop/${countryId}/confirmation?orderId=${orderId}&total=${pricing?.total.toFixed(2)}&name=${encodeURIComponent(form.recipientName)}&city=${encodeURIComponent(form.city)}`)
  }

  useEffect(() => {
    if (items.length === 0) {
      router.replace(`/shop/${countryId}`)
    }
  }, [items.length, countryId, router])

  if (items.length === 0) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Steps header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className={`flex items-center gap-1.5 font-medium ${step === "address" ? "text-blue-600" : "text-green-600"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${step === "address" ? "bg-blue-600" : "bg-green-500"}`}>
              {step === "address" ? "1" : "✓"}
            </span>
            Delivery Address
          </span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className={`flex items-center gap-1.5 font-medium ${step === "payment" ? "text-blue-600" : "text-gray-400"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${step === "payment" ? "bg-blue-600" : "bg-gray-300"}`}>
              2
            </span>
            Review & Pay
          </span>
        </div>
      </div>

      {step === "address" && (
        <div className="space-y-4">
          {/* Address form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              Recipient Details — {country.flag} {country.name}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Recipient Name *</label>
                <input value={form.recipientName} onChange={f("recipientName")} placeholder={ph.recipientName} className="input" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number *</label>
                <input value={form.phone} onChange={f("phone")} placeholder={ph.phone} className="input" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Address Line 1 *</label>
                <input value={form.line1} onChange={f("line1")} placeholder={ph.line1} className="input" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Address Line 2 (optional)</label>
                <input value={form.line2} onChange={f("line2")} placeholder="Apartment, floor, etc." className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">City *</label>
                <input value={form.city} onChange={f("city")} placeholder={ph.city} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{STATE_LABEL[countryId] ?? "State"}</label>
                <input value={form.state} onChange={f("state")} placeholder={ph.state} className="input" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {PIN_LABEL[countryId] ?? "Postal Code"} *
                </label>
                <input
                  value={form.pincode}
                  onChange={f("pincode")}
                  placeholder={ph.pincode}
                  className={`input ${pincodeError ? "border-red-400 focus:ring-red-300" : ""}`}
                />
                {pincodeError && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                    <AlertCircle size={12} /> {pincodeError}
                  </div>
                )}
                {pricing && !pincodeError && (
                  <div className="mt-1.5 text-xs text-green-600 font-medium">
                    ✓ {pricing.zone.zone} zone · delivery in {pricing.zone.estimatedDays} days
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order items mini-summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {items.length} gift{items.length > 1 ? "s" : ""} in your order
            </h3>
            <div className="space-y-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{product.name} × {quantity}</span>
                  <span className="font-medium">{country.currencySymbol}{(product.price * quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (validateAddress()) setStep("payment")
            }}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Continue to Payment <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === "payment" && pricing && (
        <div className="space-y-4">
          {/* Address recap */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <MapPin size={15} className="text-green-500" /> Delivering to
              </h3>
              <button onClick={() => setStep("address")} className="text-xs text-blue-600 hover:underline">
                Edit
              </button>
            </div>
            <div className="text-sm text-gray-700">
              <div className="font-medium">{form.recipientName}</div>
              <div className="text-gray-500 mt-0.5">
                {form.line1}{form.line2 ? `, ${form.line2}` : ""}, {form.city}, {form.state} {form.pincode}
              </div>
              <div className="text-gray-500">{country.name} · {form.phone}</div>
            </div>
          </div>

          {/* Full price breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-1">Order Summary</h3>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm text-gray-600">
                <span>{product.name} × {quantity}</span>
                <span>{country.currencySymbol}{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{country.currencySymbol}{pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery ({pricing.zone.zone} · {pricing.zone.estimatedDays} days)</span>
                <span>{country.currencySymbol}{pricing.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax ({country.taxRate}%)</span>
                <span>{country.currencySymbol}{pricing.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Service fee (2%)</span>
                <span>{country.currencySymbol}{pricing.serviceFee.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>{country.currencySymbol}{pricing.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment (prototype) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <CreditCard size={15} className="text-blue-500" /> Payment
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
              This is a prototype — no real payment is taken. Click &ldquo;Place Order&rdquo; to simulate a successful payment.
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {placing ? (
              <><span className="animate-spin">⟳</span> Processing…</>
            ) : (
              <>Place Order · {country.currencySymbol}{pricing.total.toFixed(2)}</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

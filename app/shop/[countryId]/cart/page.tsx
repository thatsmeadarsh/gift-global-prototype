"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { COUNTRIES } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-store"
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react"

export default function CartPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const country = COUNTRIES.find((c) => c.id === countryId)!
  const { items, updateQty, removeItem, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingCart size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mt-2 mb-6">Add some gifts to get started</p>
        <Link
          href={`/shop/${countryId}`}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Browse gifts for {country.name}
        </Link>
      </div>
    )
  }

  const sub = subtotal()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <p className="text-sm text-gray-500 mt-1">
          {items.length} gift{items.length > 1 ? "s" : ""} sending to {country.flag} {country.name}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="p-4 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: product.imageColor + "22" }}
            >
              🎁
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 leading-tight">{product.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{product.category}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateQty(product.id, quantity - 1)}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => updateQty(product.id, quantity + 1)}
                disabled={quantity >= product.stock}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <Plus size={12} />
              </button>
            </div>
            <div className="text-right shrink-0 w-24">
              <div className="font-semibold text-gray-900">
                {country.currencySymbol}{(product.price * quantity).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {country.currencySymbol}{product.price.toLocaleString()} each
              </div>
            </div>
            <button
              onClick={() => removeItem(product.id)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items subtotal</span>
          <span>{country.currencySymbol}{sub.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Delivery fee</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Tax ({country.taxRate}%)</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold text-gray-900">
          <span>Estimated total</span>
          <span className="text-gray-400 text-sm font-normal">See full breakdown at checkout</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/shop/${countryId}`}
          className="flex-1 py-3 text-center rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Add more gifts
        </Link>
        <Link
          href={`/shop/${countryId}/checkout`}
          className="flex-1 py-3 text-center rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Proceed to Checkout <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}

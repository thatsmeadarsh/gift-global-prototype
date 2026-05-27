"use client"

import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { COUNTRIES } from "@/lib/mock-data"
import { CheckCircle2, Package, Home } from "lucide-react"

function ConfirmationContent() {
  const { countryId } = useParams<{ countryId: string }>()
  const params = useSearchParams()
  const country = COUNTRIES.find((c) => c.id === countryId)!

  const orderId = params.get("orderId") ?? "ORD-XXXX"
  const total = params.get("total") ?? "—"
  const recipientName = params.get("name") ?? "recipient"
  const city = params.get("city") ?? country.name

  return (
    <div className="max-w-lg mx-auto py-12 text-center space-y-6">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
      </div>

      {/* Message */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
        <p className="text-gray-500 mt-2">
          Your gift is on its way to {decodeURIComponent(recipientName)} in {decodeURIComponent(city)}, {country.flag} {country.name}.
        </p>
      </div>

      {/* Order card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Order ID</span>
          <span className="font-mono font-semibold text-gray-900">{orderId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total charged</span>
          <span className="font-semibold text-gray-900">{country.currencySymbol}{total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Delivery to</span>
          <span className="text-sm text-gray-700">{decodeURIComponent(city)}, {country.name}</span>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-start gap-3 text-sm text-gray-500">
            <Package size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <span>
              The warehouse team in {country.name} has been notified. You&apos;ll receive a confirmation email once
              the order is packed and shipped.
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/shop/${countryId}`}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          Send another gift to {country.name}
        </Link>
        <Link
          href="/"
          className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <Home size={14} /> Send to another country
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}

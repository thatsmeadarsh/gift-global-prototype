"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { COUNTRIES } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-store"
import { ShoppingCart, ChevronLeft } from "lucide-react"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const { countryId } = useParams<{ countryId: string }>()
  const country = COUNTRIES.find((c) => c.id === countryId)
  const itemCount = useCart((s) => s.itemCount())

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm transition-colors">
              <ChevronLeft size={16} /> Back
            </Link>
            <div className="w-px h-4 bg-gray-200" />
            <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
              <span className="text-xl">🎁</span> GiftGlobal
            </Link>
          </div>

          {country && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <span>{country.flag}</span>
                <span>Sending to {country.name}</span>
              </div>
              <Link
                href={`/shop/${countryId}/cart`}
                className="relative flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                <ShoppingCart size={15} />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

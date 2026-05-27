"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { COUNTRIES, PRODUCTS } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-store"
import { useStore } from "@/lib/store"
import { Search, ShoppingCart, Check, AlertTriangle } from "lucide-react"

export default function CatalogPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const country = COUNTRIES.find((c) => c.id === countryId)
  const { countryProducts } = useStore()
  const { addItem, items, setCountry } = useCart()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  if (!country) return null

  const products = countryProducts(countryId).filter((p) => p.isActive && p.stock > 0)

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === "All" || p.category === activeCategory
    return matchSearch && matchCat
  })

  function handleAdd(product: typeof products[0]) {
    setCountry(countryId)
    addItem(product)
    setAddedIds((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 1500)
  }

  const cartProductIds = new Set(items.map((i) => i.product.id))

  return (
    <div className="space-y-6">
      {/* Country header */}
      <div className="flex items-center gap-4">
        <span className="text-5xl">{country.flag}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gifts for {country.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} gifts available · Prices in {country.currency} · Delivered anywhere in {country.name}
          </p>
        </div>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gifts…"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <div>No gifts match your search</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const inCart = cartProductIds.has(product.id)
            const justAdded = addedIds.has(product.id)
            const lowStock = product.stock <= product.lowStockThreshold

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Product image placeholder */}
                <div
                  className="h-44 flex items-center justify-center text-5xl relative"
                  style={{ backgroundColor: product.imageColor + "22" }}
                >
                  <span>🎁</span>
                  <div
                    className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: product.imageColor }}
                  >
                    {product.category}
                  </div>
                  {lowStock && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      <AlertTriangle size={11} /> Low stock
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {country.currencySymbol}{product.price.toLocaleString()}
                      </span>
                      <div className="text-xs text-gray-400 mt-0.5">
                        +{country.taxRate}% tax · delivery extra
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        justAdded
                          ? "bg-green-500 text-white"
                          : inCart
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-900 text-white hover:bg-gray-700"
                      }`}
                    >
                      {justAdded ? (
                        <><Check size={14} /> Added</>
                      ) : inCart ? (
                        <><ShoppingCart size={14} /> Add more</>
                      ) : (
                        <><ShoppingCart size={14} /> Add</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

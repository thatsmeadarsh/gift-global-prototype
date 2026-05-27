"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useStore } from "@/lib/store"
import { COUNTRIES, type Product } from "@/lib/mock-data"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Package,
  AlertTriangle,
} from "lucide-react"

type FilterStatus = "all" | "active" | "inactive" | "low" | "out"

const CATEGORIES_BY_COUNTRY: Record<string, string[]> = {
  de: ["Drinkware", "Home Décor", "Food & Sweets", "Collectibles", "Automotive", "Seasonal"],
  in: ["Apparel", "Food & Beverage", "Health & Wellness", "Home Décor", "Gifts"],
  us: ["Sports", "Food & Beverage", "Drinkware", "Games", "Art & Prints"],
  fr: ["Wine & Spirits", "Beauty & Fragrance", "Food & Gourmet", "Collectibles", "Food & Beverage", "Accessories"],
}

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0) return <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Out of stock</span>
  if (stock <= threshold) return <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{stock} — Low</span>
  return <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{stock}</span>
}

interface ProductFormState {
  name: string
  category: string
  price: string
  stock: string
  lowStockThreshold: string
  description: string
  sku: string
  isActive: boolean
}

const EMPTY_FORM: ProductFormState = {
  name: "", category: "", price: "", stock: "", lowStockThreshold: "10",
  description: "", sku: "", isActive: true,
}

function productToForm(p: Product): ProductFormState {
  return {
    name: p.name, category: p.category, price: String(p.price), stock: String(p.stock),
    lowStockThreshold: String(p.lowStockThreshold), description: p.description,
    sku: p.sku, isActive: p.isActive,
  }
}

const ICON_COLORS = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#ef4444","#6366f1","#14b8a6","#f97316","#84cc16"]

export default function InventoryPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const country = COUNTRIES.find((c) => c.id === countryId)!
  const { countryProducts, addProduct, updateProduct, deleteProduct } = useStore()
  const products = countryProducts(countryId)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  const [stockEdit, setStockEdit] = useState<{ id: string; value: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const categories = CATEGORIES_BY_COUNTRY[countryId] ?? []

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? p.isActive :
      filter === "inactive" ? !p.isActive :
      filter === "low" ? p.stock > 0 && p.stock <= p.lowStockThreshold :
      filter === "out" ? p.stock === 0 : true
    return matchSearch && matchFilter
  })

  function openEdit(product: Product) {
    setForm(productToForm(product))
    setEditingId(product.id)
    setShowAddModal(false)
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM, category: categories[0] ?? "" })
    setEditingId(null)
    setShowAddModal(true)
  }

  function closeModal() {
    setShowAddModal(false)
    setEditingId(null)
  }

  function saveProduct() {
    const price = parseFloat(form.price)
    const stock = parseInt(form.stock, 10)
    const lowStockThreshold = parseInt(form.lowStockThreshold, 10)
    if (!form.name || isNaN(price) || isNaN(stock)) return

    if (editingId) {
      updateProduct(editingId, {
        name: form.name, category: form.category, price, stock,
        lowStockThreshold, description: form.description, sku: form.sku,
        isActive: form.isActive,
      })
    } else {
      const newProduct: Product = {
        id: `p-${countryId}-${Date.now()}`,
        countryId,
        name: form.name, category: form.category, price, stock,
        lowStockThreshold, description: form.description, sku: form.sku,
        isActive: form.isActive,
        imageColor: ICON_COLORS[Math.floor(Math.random() * ICON_COLORS.length)],
      }
      addProduct(newProduct)
    }
    closeModal()
  }

  function commitStockEdit(id: string) {
    if (!stockEdit) return
    const val = parseInt(stockEdit.value, 10)
    if (!isNaN(val) && val >= 0) {
      updateProduct(id, { stock: val })
    }
    setStockEdit(null)
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package size={22} /> Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{country.name} · {products.length} products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all","active","inactive","low","out"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {f === "all" ? "All" : f === "active" ? "Active" : f === "inactive" ? "Inactive" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Package size={32} className="mx-auto mb-3 opacity-40" />
            <div className="text-sm">No products found</div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-base shrink-0"
                        style={{ backgroundColor: product.imageColor }}
                      >
                        🎁
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 leading-tight">{product.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {country.currencySymbol}{product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {stockEdit?.id === product.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          autoFocus
                          type="number"
                          min="0"
                          value={stockEdit.value}
                          onChange={(e) => setStockEdit({ id: product.id, value: e.target.value })}
                          onBlur={() => commitStockEdit(product.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitStockEdit(product.id)
                            if (e.key === "Escape") setStockEdit(null)
                          }}
                          className="w-16 text-center border border-blue-400 rounded px-1 py-0.5 text-sm focus:outline-none"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setStockEdit({ id: product.id, value: String(product.stock) })}
                        className="hover:bg-gray-100 rounded px-1 py-0.5 transition-colors"
                        title="Click to edit stock"
                      >
                        <StockBadge stock={product.stock} threshold={product.lowStockThreshold} />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit product"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingId) && (
        <Modal title={editingId ? "Edit Product" : "Add New Product"} onClose={closeModal}>
          <div className="space-y-4">
            <FormRow label="Product Name *">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="e.g. Premium Gift Basket"
              />
            </FormRow>
            <div className="grid grid-cols-2 gap-4">
              <FormRow label="Category *">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </FormRow>
              <FormRow label="SKU">
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="input"
                  placeholder={`${countryId.toUpperCase()}-XXX-001`}
                />
              </FormRow>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormRow label={`Price (${country.currencySymbol}) *`}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input"
                  placeholder="0.00"
                />
              </FormRow>
              <FormRow label="Stock *">
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="input"
                  placeholder="0"
                />
              </FormRow>
              <FormRow label="Low Stock Alert">
                <input
                  type="number"
                  min="1"
                  value={form.lowStockThreshold}
                  onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                  className="input"
                  placeholder="10"
                />
              </FormRow>
            </div>
            <FormRow label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input resize-none h-20"
                placeholder="Short product description…"
              />
            </FormRow>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Product is active (visible to customers)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={saveProduct}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={14} /> {editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Modal title="Delete Product?" onClose={() => setDeleteConfirm(null)} size="sm">
          <div className="space-y-4">
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                This will permanently remove the product from the catalog. Orders containing this product won&apos;t be affected.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => { deleteProduct(deleteConfirm); setDeleteConfirm(null) }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({
  title, children, onClose, size = "md",
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  size?: "sm" | "md"
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${size === "sm" ? "max-w-sm" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

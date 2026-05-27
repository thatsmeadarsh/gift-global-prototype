"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useStore } from "@/lib/store"
import { COUNTRIES, type Order, type OrderStatus } from "@/lib/mock-data"
import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
} from "lucide-react"

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "text-yellow-800", bgColor: "bg-yellow-100", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-800",   bgColor: "bg-blue-100",   icon: CheckCircle2 },
  packed:    { label: "Packed",    color: "text-purple-800", bgColor: "bg-purple-100", icon: Package },
  shipped:   { label: "Shipped",   color: "text-indigo-800", bgColor: "bg-indigo-100", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-800",  bgColor: "bg-green-100",  icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-800",    bgColor: "bg-red-100",    icon: XCircle },
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:   "confirmed",
  confirmed: "packed",
  packed:    "shipped",
  shipped:   "delivered",
}

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  })
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}

function OrderRow({ order, symbol, onStatusChange }: {
  order: Order
  symbol: string
  onStatusChange: (id: string, status: OrderStatus) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const nextStatus = NEXT_STATUS[order.status]

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 grid grid-cols-[auto_1fr_auto_auto] gap-x-4 items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-gray-600">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-sm text-gray-700 mt-0.5">{order.customerName}</div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500 min-w-0">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{order.city} · {order.pincode} · {order.zone}</span>
          </div>
          <div className="text-right hidden md:block text-xs text-gray-400" suppressHydrationWarning>{formatDate(order.createdAt)}</div>
          <div className="text-right font-semibold text-gray-800">
            {symbol}{order.total.toFixed(2)}
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
          {/* Order items */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</div>
            <div className="space-y-1.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.productName}
                    <span className="text-gray-400 ml-1">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">{symbol}{(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-sm space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{symbol}{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery ({order.zone})</span><span>{symbol}{order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span><span>{symbol}{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service fee</span><span>{symbol}{order.serviceFee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>−{symbol}{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-100">
              <span>Total</span><span>{symbol}{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Status pipeline */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Order Progress</div>
            <div className="flex items-center gap-1">
              {(["pending","confirmed","packed","shipped","delivered"] as OrderStatus[]).map((s, i) => {
                const reached = STATUS_ORDER.indexOf(order.status) >= STATUS_ORDER.indexOf(s)
                const cfg = STATUS_CONFIG[s]
                return (
                  <div key={s} className="flex items-center gap-1 flex-1">
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 rounded ${reached ? "bg-blue-400" : "bg-gray-200"}`} />
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shrink-0 ${
                        reached ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      title={cfg.label}
                    >
                      {i + 1}
                    </div>
                    {i === 4 && <div className={`h-0.5 w-4 rounded ${reached ? "bg-blue-400" : "bg-gray-200"}`} />}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-1">
              {(["pending","confirmed","packed","shipped","delivered"] as OrderStatus[]).map((s) => (
                <div key={s} className="text-[10px] text-gray-400 text-center">{STATUS_CONFIG[s].label}</div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="flex items-center gap-2 pt-1">
              {nextStatus && (
                <button
                  onClick={() => onStatusChange(order.id, nextStatus)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Mark as {STATUS_CONFIG[nextStatus].label}
                </button>
              )}
              {order.status === "pending" && (
                <button
                  onClick={() => onStatusChange(order.id, "cancelled")}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                >
                  <XCircle size={14} /> Cancel Order
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const country = COUNTRIES.find((c) => c.id === countryId)!
  const { countryOrders, updateOrderStatus } = useStore()
  const orders = countryOrders(countryId)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [sortNewest, setSortNewest] = useState(true)

  const filtered = orders
    .filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.city.toLowerCase().includes(search.toLowerCase()) ||
        o.pincode.includes(search)
      const matchStatus = statusFilter === "all" || o.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return sortNewest ? tb - ta : ta - tb
    })

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length
    return acc
  }, {} as Record<OrderStatus, number>)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={22} /> Orders
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{country.name} · {orders.length} total orders</p>
        </div>
        <button
          onClick={() => setSortNewest(!sortNewest)}
          className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter size={14} />
          {sortNewest ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {/* Status tab filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            statusFilter === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_ORDER.map((s) => {
          const cfg = STATUS_CONFIG[s]
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? `${cfg.bgColor} ${cfg.color} border-transparent`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cfg.label} ({counts[s]})
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order ID, customer, city…"
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
            <ShoppingCart size={32} className="mx-auto mb-3 opacity-40" />
            <div className="text-sm">No orders found</div>
          </div>
        ) : (
          filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              symbol={country.currencySymbol}
              onStatusChange={updateOrderStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}

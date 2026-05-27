"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { COUNTRIES } from "@/lib/mock-data"
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react"

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-800",  icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800",      icon: CheckCircle2 },
  packed:    { label: "Packed",    color: "bg-purple-100 text-purple-800",   icon: Package },
  shipped:   { label: "Shipped",   color: "bg-indigo-100 text-indigo-800",  icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800",    icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800",        icon: XCircle },
}

function fmt(value: number, symbol: string) {
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function DashboardPage() {
  const { countryId } = useParams<{ countryId: string }>()
  const country = COUNTRIES.find((c) => c.id === countryId)!
  const { countryProducts, countryOrders } = useStore()

  const products = countryProducts(countryId)
  const orders = countryOrders(countryId)

  const activeProducts = products.filter((p) => p.isActive)
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold)
  const outOfStock = products.filter((p) => p.stock === 0)

  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status))
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0)

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {country.flag} Dashboard — {country.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {country.manager.split(" ")[0]}. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active Products"
          value={activeProducts.length}
          icon={<Package size={20} className="text-blue-600" />}
          bg="bg-blue-50"
          sub={`${products.length} total`}
        />
        <StatCard
          label="Pending Orders"
          value={pendingOrders.length}
          icon={<Clock size={20} className="text-yellow-600" />}
          bg="bg-yellow-50"
          sub={`${activeOrders.length} active`}
          highlight={pendingOrders.length > 0}
        />
        <StatCard
          label="Low / Out of Stock"
          value={lowStock.length + outOfStock.length}
          icon={<AlertTriangle size={20} className="text-red-500" />}
          bg="bg-red-50"
          sub={`${outOfStock.length} out of stock`}
          highlight={outOfStock.length > 0}
        />
        <StatCard
          label="Total Revenue"
          value={fmt(totalRevenue, country.currencySymbol)}
          icon={<TrendingUp size={20} className="text-green-600" />}
          bg="bg-green-50"
          sub={`${orders.filter(o => o.paymentStatus === 'paid').length} paid orders`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <ShoppingCart size={16} /> Recent Orders
            </h2>
            <Link
              href={`/manager/${countryId}/orders`}
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status]
              return (
                <div key={order.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-500">{order.id}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-0.5 truncate">
                      {order.customerName} · {order.city}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-gray-800">
                      {country.currencySymbol}{order.total.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-gray-400" suppressHydrationWarning>{timeAgo(order.createdAt)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stock alerts */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> Stock Alerts
            </h2>
            <Link
              href={`/manager/${countryId}/inventory`}
              className="text-xs text-blue-600 hover:underline"
            >
              Manage inventory
            </Link>
          </div>
          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              All products are well-stocked
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {outOfStock.map((p) => (
                <StockAlertRow key={p.id} name={p.name} stock={p.stock} type="out" />
              ))}
              {lowStock.map((p) => (
                <StockAlertRow key={p.id} name={p.name} stock={p.stock} type="low" threshold={p.lowStockThreshold} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order pipeline */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Order Pipeline</h2>
        </div>
        <div className="p-5 grid grid-cols-3 md:grid-cols-6 gap-3">
          {(Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map((status) => {
            const count = orders.filter((o) => o.status === status).length
            const cfg = STATUS_CONFIG[status]
            return (
              <div key={status} className={`rounded-lg px-3 py-3 text-center ${cfg.color} bg-opacity-30`}>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs font-medium mt-0.5">{cfg.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label, value, icon, bg, sub, highlight = false,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  bg: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${highlight ? "border-red-300" : "border-gray-200"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  )
}

function StockAlertRow({
  name, stock, type, threshold,
}: {
  name: string
  stock: number
  type: "out" | "low"
  threshold?: number
}) {
  return (
    <div className="px-5 py-3 flex items-center gap-3">
      <div
        className={`w-2 h-2 rounded-full shrink-0 ${type === "out" ? "bg-red-500" : "bg-yellow-400"}`}
      />
      <div className="flex-1 min-w-0 text-sm text-gray-700 truncate">{name}</div>
      <div
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          type === "out"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {type === "out" ? "Out of stock" : `${stock} left (min ${threshold})`}
      </div>
    </div>
  )
}

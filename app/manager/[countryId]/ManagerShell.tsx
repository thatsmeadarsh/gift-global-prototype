"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { COUNTRIES } from "@/lib/mock-data"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "inventory", icon: Package },
  { label: "Orders", href: "orders", icon: ShoppingCart },
]

export default function ManagerShell({
  children,
  countryId,
}: {
  children: React.ReactNode
  countryId: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [countrySwitcherOpen, setCountrySwitcherOpen] = useState(false)

  const country = COUNTRIES.find((c) => c.id === countryId)
  if (!country) return null

  const currentSegment = pathname.split("/").pop()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="w-60 flex flex-col bg-slate-900 text-white shrink-0">
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <div>
              <div className="text-sm font-bold leading-tight">Gift Platform</div>
              <div className="text-[11px] text-slate-400 leading-tight">Manager Portal</div>
            </div>
          </div>
        </div>

        <div className="px-3 py-3 border-b border-slate-700 relative">
          <button
            onClick={() => setCountrySwitcherOpen(!countrySwitcherOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <span className="text-xl">{country.flag}</span>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium leading-tight">{country.name}</div>
              <div className="text-[11px] text-slate-400 leading-tight truncate">{country.manager}</div>
            </div>
            <ChevronDown size={14} className="text-slate-400 shrink-0" />
          </button>

          {countrySwitcherOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50 py-1">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCountrySwitcherOpen(false)
                    router.push(`/manager/${c.id}/dashboard`)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-left text-sm transition-colors ${c.id === countryId ? "bg-slate-700" : ""}`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = currentSegment === href
            return (
              <Link
                key={href}
                href={`/manager/${countryId}/${href}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Switch country
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="text-sm text-gray-500">
            {country.flag} {country.name} Warehouse
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {country.manager.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-800">{country.manager}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

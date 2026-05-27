"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { COUNTRIES } from "@/lib/mock-data"
import { ChevronLeft } from "lucide-react"

export default function ManagerLoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-4">
      <div className="mb-10 text-center">
        <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ChevronLeft size={14} /> Back to store
        </Link>
        <div className="text-4xl mb-3">🎁</div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Gift Platform</h1>
        <p className="text-slate-400 mt-2 text-sm">Warehouse Manager Portal</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Select your country</h2>
        <p className="text-sm text-gray-500 mb-6">
          Each manager is scoped to their assigned country. Select yours to continue.
        </p>

        <div className="space-y-3">
          {COUNTRIES.map((country) => (
            <button
              key={country.id}
              onClick={() => router.push(`/manager/${country.id}/dashboard`)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group text-left"
            >
              <span className="text-3xl">{country.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 group-hover:text-blue-700">
                  {country.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {country.manager} · {country.managerEmail}
                </div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-1 whitespace-nowrap">
                {country.currency}
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          This is a prototype — no credentials required
        </p>
      </div>
    </div>
  )
}

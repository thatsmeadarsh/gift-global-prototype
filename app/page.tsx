"use client"

import { useRouter } from "next/navigation"
import { COUNTRIES } from "@/lib/mock-data"
import { ArrowRight, Gift, Globe, Shield, Truck } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <span className="text-2xl">🎁</span> GiftGlobal
        </div>
        <a href="/manager" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Warehouse login
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Globe size={13} /> Delivering to 4 countries · More coming soon
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight">
          Send a gift to<br />
          <span className="text-blue-600">anyone, anywhere</span>
        </h1>
        <p className="text-lg text-gray-500 mt-5 max-w-xl mx-auto leading-relaxed">
          Choose the country you&apos;re sending to. We&apos;ll show you handpicked local gifts
          that can be delivered to any address there.
        </p>
      </section>

      {/* Country grid */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5 text-center">
          Where are you sending?
        </p>
        <div className="grid grid-cols-2 gap-4">
          {COUNTRIES.map((country) => (
            <button
              key={country.id}
              onClick={() => router.push(`/shop/${country.id}`)}
              className="group relative flex flex-col items-start p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left bg-white overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50 group-hover:to-indigo-50/30 transition-all duration-200" />

              <span className="text-5xl mb-4 relative z-10">{country.flag}</span>
              <div className="relative z-10">
                <div className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {country.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Prices in {country.currency} · {country.taxRate}% tax included
                </div>
              </div>
              <ArrowRight
                size={18}
                className="absolute right-5 bottom-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-gray-100 bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6">
          {[
            { icon: <Truck size={20} className="text-blue-500" />, title: "Fast Delivery", desc: "Metro deliveries in 1–2 days" },
            { icon: <Shield size={20} className="text-green-500" />, title: "Secure Payment", desc: "Stripe-powered checkout" },
            { icon: <Gift size={20} className="text-purple-500" />, title: "Local Gifts", desc: "Handpicked per country" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{f.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from './mock-data'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  countryId: string | null

  setCountry: (countryId: string) => void
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void

  itemCount: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      countryId: null,

      setCountry: (countryId) =>
        set((state) => state.countryId === countryId ? {} : { countryId, items: [] }),

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity: 1 }] }
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)),
        })),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    }),
    { name: 'gift-cart' }
  )
)

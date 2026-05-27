import { create } from 'zustand'
import { PRODUCTS, ORDERS, type Product, type Order, type OrderStatus } from './mock-data'

interface InventoryState {
  products: Product[]
  orders: Order[]
  activeCountryId: string | null

  setActiveCountry: (countryId: string) => void

  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateStock: (id: string, stock: number) => void

  updateOrderStatus: (id: string, status: OrderStatus) => void

  countryProducts: (countryId: string) => Product[]
  countryOrders: (countryId: string) => Order[]
}

export const useStore = create<InventoryState>((set, get) => ({
  products: PRODUCTS,
  orders: ORDERS,
  activeCountryId: null,

  setActiveCountry: (countryId) => set({ activeCountryId: countryId }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

  updateStock: (id, stock) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, stock } : p)),
    })),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    })),

  countryProducts: (countryId) => get().products.filter((p) => p.countryId === countryId),
  countryOrders: (countryId) => get().orders.filter((o) => o.countryId === countryId),
}))

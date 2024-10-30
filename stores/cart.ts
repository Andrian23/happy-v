import { create } from "zustand"

import type { ShopifyProduct } from "@/models/product"

type State = {
  products: Array<ShopifyProduct & { amount: number }>
  protected: boolean
  shippingMethod: "standard" | "express" | null
}

type Action = {
  addProduct: (product: ShopifyProduct & { amount?: number }, amount: number) => void
  removeProduct: (productId: string) => void
  updateCount: (id: string, amount: number) => void
  setProtected: () => void
  setShippingMethod: (method: "standard" | "express") => void
}

export const useCartStore = create<State & Action>((set) => ({
  products: [],
  protected: false,
  shippingMethod: null,
  addProduct: (product, amount) =>
    set((state) => {
      const existingProduct = state.products.find((p) => p.id === product.id)
      return {
        products: existingProduct
          ? state.products.map((p) => (p.id === product.id ? { ...p, amount: p.amount + amount } : p))
          : [...state.products, { ...product, amount }],
      }
    }),
  removeProduct: (productId) =>
    set((state) => ({ products: state.products.filter((product) => product.id !== productId) })),
  updateCount: (productId, amount) =>
    set((state) => ({
      products: state.products.map((product) => (product.id === productId ? { ...product, amount } : product)),
    })),
  setProtected: () => set((state) => ({ protected: !state.protected })),
  setShippingMethod: (method) => set({ shippingMethod: method }),
}))

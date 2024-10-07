import { create } from "zustand"

import type { Product } from "@/models/product"

type State = {
  products: Array<Product & { amount: number }>
}

type Action = {
  addProduct: (product: Product, amount: number) => void
  removeProduct: (productId: number) => void
  updateCount: (id: number, amount: number) => void
}

export const useCartStore = create<State & Action>((set) => ({
  products: [],
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
}))

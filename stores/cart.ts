import { create } from "zustand"

import { ShopifyProduct, VariantEdge } from "@/models/product"

type CartProduct = VariantEdge & {
  amount: number
  sellingPlanId?: string | null
}

type ProductVariant = ShopifyProduct["variants"]["edges"][0]

type State = {
  products: CartProduct[]
  protected: boolean
  shippingMethod: string | null
}

type Action = {
  addProduct: (product: ShopifyProduct | ProductVariant, amount: number, sellingPlanId?: string | null) => void
  removeProduct: (productId: string) => void
  updateCount: (id: string, amount: number) => void
  setProtected: () => void
  setShippingMethod: (method: string) => void
}

export const useCartStore = create<State & Action>((set) => ({
  products: [],
  protected: false,
  shippingMethod: null,
  addProduct: (product, amount = 1, sellingPlanId = null) =>
    set((state) => {
      const variantProduct = "variants" in product ? product.variants.edges[0] : (product as VariantEdge)

      const existingProduct = state.products.find(
        (p) => p.node.id === variantProduct.node.id && p.sellingPlanId === sellingPlanId
      )

      const newProduct = {
        ...variantProduct,
        amount: (existingProduct?.amount || 0) + amount,
        sellingPlanId,
      }

      return {
        products: existingProduct
          ? state.products.map((p) =>
              p.node.id === variantProduct.node.id && p.sellingPlanId === sellingPlanId ? newProduct : p
            )
          : [...state.products, newProduct],
      }
    }),
  removeProduct: (productId) =>
    set((state) => ({
      products: state.products.filter((product) => product.node.id !== productId),
    })),
  updateCount: (productId, amount) =>
    set((state) => ({
      products: state.products.map((product) => (product.node.id === productId ? { ...product, amount } : product)),
    })),
  setProtected: () =>
    set((state) => ({
      protected: !state.protected,
    })),
  setShippingMethod: (method) =>
    set({
      shippingMethod: method,
    }),
}))

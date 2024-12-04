import { create } from "zustand"
import { persist } from "zustand/middleware"

import { fetchShopifyStorefront } from "@/actions/shopifyCart"
import {
  CART_LINES_ADD,
  CREATE_CART,
  GET_CART_QUERY,
  UPDATE_CART,
  UPDATE_CART_QUANTITY,
} from "@/actions/shopifyCart/graphqlQueries"
import { getUserInfo } from "@/lib/userInfo"

type Edge<T> = {
  node: T
}

export type Connection<T> = {
  edges: Edge<T>[]
}

type Money = {
  amount: string
  currencyCode: string
}

type CartMetadata = {
  [variantId: string]: {
    bottleSizeFirst?: string
  }
}

export type CartLineItem = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    priceV2: Money
    compareAtPriceV2?: Money
    image: {
      url: string
      altText: string
    }
    product: {
      title: string
    }
  }
  cost: {
    amountPerQuantity: Money
    compareAtAmountPerQuantity?: Money
    subtotalAmount: Money
    totalAmount: Money
  }
}

type ShopifyCart = {
  id: string
  lines: Connection<CartLineItem>
  cost: {
    totalAmount: Money
    subtotalAmount: Money
    totalDutyAmount?: Money
    totalTaxAmount?: Money
  }
  discountCodes: Array<{
    applicable: boolean
    code: string
  }>
  servingInfo?: {
    bottleSize?: string
    servingSize?: string
  }
}

type CartCreateResponse = {
  cartCreate: {
    cart: ShopifyCart
  }
}

type CartUpdateResponse = {
  cartLinesUpdate: {
    cart: ShopifyCart
  }
}

type CartAddResponse = {
  cartLinesAdd: {
    cart: ShopifyCart
  }
}

type State = {
  cartId: string | null
  isLoading: boolean
  cart: ShopifyCart | null
  cartMetadata: CartMetadata
}

type Actions = {
  createCart: (products: Array<{ variantId: string; quantity: number }>) => Promise<void>
  updateCart: (lines: Array<{ id: string; quantity: number }>) => Promise<void>
  addToCart: (
    variantId: string,
    quantity: number,
    sellingPlanId: string | null,
    bottleSizeFirst?: string
  ) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  fetchCart: () => Promise<void>
}

type ShopifyError = {
  response?: {
    errors?: Array<{
      message: string
    }>
  }
}

const persistOptions = {
  name: "shopify-cart-storage",
}

export const useShopifyCartStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      cartId: null,
      isLoading: false,
      cart: null,
      cartMetadata: {},

      createCart: async (products) => {
        const { email, telephone } = await getUserInfo()

        set({ isLoading: true })
        try {
          const response = await fetchShopifyStorefront<CartCreateResponse>(CREATE_CART, {
            lines: products.map(({ variantId, quantity }) => ({
              merchandiseId: variantId,
              quantity,
            })),
            attributes: [{ key: "source", value: "DEAP" }],
            buyerIdentity: {
              email: email,
              phone: telephone,
            },
          })

          const { cart } = response.cartCreate
          set({ cart, cartId: cart.id, isLoading: false })
        } catch (error) {
          console.error("Error creating cart:", error)
          set({ isLoading: false })
        }
      },

      fetchCart: async () => {
        const { cartId } = get()
        if (!cartId) return

        set({ isLoading: true })
        try {
          const response = await fetchShopifyStorefront<{ cart: ShopifyCart | null }>(GET_CART_QUERY, {
            cartId,
          })

          if (response.cart) {
            set({ cart: response.cart })
          } else {
            set({ cart: null, cartId: null })
          }
        } catch (error) {
          console.error("Error fetching cart:", error)
          set({ cart: null, cartId: null })
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (lineId, quantity) => {
        const { cartId } = get()
        if (!cartId) return

        try {
          const response = await fetchShopifyStorefront<CartUpdateResponse>(UPDATE_CART_QUANTITY, {
            cartId,
            lines: [{ id: lineId, quantity }],
          })

          if (response?.cartLinesUpdate?.cart) {
            set({ cart: response.cartLinesUpdate.cart })
          }
        } catch (error) {
          console.error("Error updating quantity:", error)
        }
      },

      updateCart: async (lines) => {
        const { cartId } = get()
        if (!cartId) return

        set({ isLoading: true })
        try {
          const response = await fetchShopifyStorefront<CartUpdateResponse>(UPDATE_CART, {
            cartId,
            lines,
          })

          const { cart } = response.cartLinesUpdate
          set({ cart, isLoading: false })
        } catch (error) {
          console.error("Error updating cart:", error)
          set({ isLoading: false })
        }
      },

      addToCart: async (variantId, quantity, sellingPlanId, bottleSizeFirst) => {
        const { cartId, cartMetadata } = get()

        const updatedMetadata = {
          ...cartMetadata,
          [variantId]: { bottleSizeFirst },
        }

        const lineInput = {
          merchandiseId: variantId,
          quantity,
          ...(sellingPlanId ? { sellingPlanId } : {}),
        }

        if (cartId) {
          try {
            const cartResponse = await fetchShopifyStorefront<{ cart: ShopifyCart }>(GET_CART_QUERY, {
              cartId,
            })

            if (cartResponse.cart) {
              const existingLine = cartResponse.cart.lines.edges.find((line) => line.node.merchandise.id === variantId)

              if (existingLine) {
                const response = await fetchShopifyStorefront<CartUpdateResponse>(UPDATE_CART, {
                  cartId,
                  lines: [
                    {
                      id: existingLine.node.id,
                      quantity: existingLine.node.quantity + quantity,
                    },
                  ],
                })
                set({ cart: response.cartLinesUpdate.cart, cartMetadata: updatedMetadata })
              } else {
                const response = await fetchShopifyStorefront<CartAddResponse>(CART_LINES_ADD, {
                  cartId,
                  lines: [lineInput],
                })
                set({ cart: response.cartLinesAdd.cart, cartMetadata: updatedMetadata })
              }
              return
            }
          } catch (error) {
            const shopifyError = error as ShopifyError
            if (shopifyError.response?.errors?.[0]?.message?.includes("Cart not found")) {
              console.log("Cart not found, creating new one")
            } else {
              console.error("Error updating cart:", error)
              return
            }
          }
        }

        try {
          const { email, telephone } = await getUserInfo()

          const response = await fetchShopifyStorefront<CartCreateResponse>(CREATE_CART, {
            lines: [lineInput],
            attributes: [{ key: "source", value: "DEAP" }],
            buyerIdentity: {
              email: email,
              phone: telephone,
            },
          })

          const newCart = response.cartCreate.cart
          set({ cart: newCart, cartId: newCart.id, cartMetadata: updatedMetadata })
        } catch (error) {
          console.error("Error creating cart:", error)
        }
      },

      removeFromCart: async (lineId) => {
        const { updateCart, cart, cartMetadata } = get()

        const variantId = cart?.lines.edges.find((edge) => edge.node.id === lineId)?.node.merchandise.id

        if (variantId) {
          const updatedMetadata = { ...cartMetadata }
          delete updatedMetadata[variantId]
          set({ cartMetadata: updatedMetadata })
        }

        await updateCart([{ id: lineId, quantity: 0 }])
      },
    }),
    persistOptions
  )
)

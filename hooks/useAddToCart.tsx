import { useCallback, useState } from "react"

import { useToast } from "@/components/ui/useToast"
import type { CartItem } from "@/interfaces/cart"
import type { Product } from "@/models/product"

export const useAddToCart = () => {
  const [count, setCount] = useState(0)
  const { toast } = useToast()

  const addToCart = useCallback(
    (product: Product) => {
      const existingCartData = localStorage.getItem("cart")
      let cartItems: CartItem[] = existingCartData ? JSON.parse(existingCartData) : []

      if (!Array.isArray(cartItems)) {
        cartItems = []
      }

      // Remove any items with count 0
      cartItems = cartItems.filter((item) => item.count > 0)

      const existingItemIndex = cartItems.findIndex((item) => item.productId === product.id)
      const price = product.variants?.[0]?.price || "0"

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].count += count
      } else {
        cartItems.push({
          productId: product.id,
          count,
          price,
        })
      }

      localStorage.setItem("cart", JSON.stringify(cartItems))

      // Update cart count
      const cartCountElement = document.getElementById("cart-count")
      if (cartCountElement) {
        const totalCount = cartItems.reduce((sum: number, item: { count: number }) => sum + item.count, 0)
        cartCountElement.textContent = totalCount.toString()
      }

      toast({ title: "Product added to cart!" })
    },
    [count, toast]
  )

  return { count, setCount, addToCart }
}

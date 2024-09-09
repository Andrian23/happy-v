import { SetStateAction, useEffect, useState } from "react"

import type { CartItem } from "@/interfaces/cart"
import { calculateTotalPrice } from "@/lib"

const useCart = (
  setTotalPrice: (value: SetStateAction<number>) => void,
  setIsProtected?: (value: SetStateAction<boolean>) => void,
  setCartItems?: (value: SetStateAction<CartItem[]>) => void
) => {
  const [cartContent, setCartContent] = useState<string | null>(null)
  const [listProductsId, setListProductsId] = useState<number[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [emptyCart, setEmptyCart] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartData = localStorage.getItem("cart")
      if (cartData) {
        setCartContent(cartData)
        let cartItems: CartItem[] = JSON.parse(cartData)

        if (setCartItems) {
          cartItems = cartItems.filter((item) => item.count > 0)
          setCartItems(cartItems)
        }

        const productIds = cartItems.map((item) => item.productId)
        setListProductsId(productIds)

        const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0)
        setTotalCount(totalCount)
        if (totalCount === 0) {
          setEmptyCart(true)
        }

        setTotalPrice(calculateTotalPrice(cartItems))
      } else {
        setCartContent(null)
        setEmptyCart(true)
        setListProductsId([])
      }

      if (setIsProtected) {
        const saved = localStorage.getItem("protected")
        setIsProtected(saved === "true")
      }
    }
  }, [setTotalPrice, setIsProtected, setCartItems])

  return { cartContent, listProductsId, totalCount, emptyCart }
}

export default useCart

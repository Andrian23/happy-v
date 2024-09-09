import { SetStateAction } from "react"

import calculateTotalPrice from "./calculateTotalPrice"

const handleCartItemsChange = (setTotalPrice: (value: SetStateAction<number>) => void) => () => {
  if (typeof window !== "undefined") {
    const cartData = localStorage.getItem("cart")

    if (cartData) {
      const cartItems = JSON.parse(cartData)
      setTotalPrice(calculateTotalPrice(cartItems))
    }
  }
}

export default handleCartItemsChange

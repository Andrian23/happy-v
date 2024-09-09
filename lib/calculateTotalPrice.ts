import type { CartItem } from "@/interfaces/cart"

const calculateTotalPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price)
    return acc + item.count * price
  }, 0)
}

export default calculateTotalPrice

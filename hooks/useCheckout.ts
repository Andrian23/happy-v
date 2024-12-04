import { fetchShopifyStorefront } from "@/actions/shopifyCart"
import { GET_CHECKOUT_URL } from "@/actions/shopifyCart/graphqlQueries"

interface CheckoutResponse {
  cart: {
    checkoutUrl: string
  }
}

export const useCheckout = () => {
  const handleCheckout = async (cartId: string) => {
    try {
      const response = await fetchShopifyStorefront<CheckoutResponse>(GET_CHECKOUT_URL, {
        cartId,
      })
      window.location.href = response.cart.checkoutUrl
    } catch (error) {
      console.error("Error getting checkout URL:", error)
    }
  }

  return { handleCheckout }
}

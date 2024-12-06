import { useEffect, useState } from "react"

import { fetchShippingRates } from "@/actions/cart"
import { ShippingAddress, ShippingInfo, TotalTaxAmount } from "@/models/shipping"

export const useShippingMethods = (checkoutId: string | null, selectedShippingAddress: ShippingAddress | null) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingInfo[]>([])
  const [totalTaxAmount, setTotalTaxAmount] = useState<TotalTaxAmount>({
    amount: "$0.00",
    currencyCode: "USD",
  })

  useEffect(() => {
    if (!checkoutId || !selectedShippingAddress) return

    const fetchMethods = async () => {
      try {
        const shippingRates = await fetchShippingRates(checkoutId)
        setShippingMethods(shippingRates.deliveryOptions)
        setTotalTaxAmount(shippingRates.totalTaxAmount)
      } catch (error) {
        console.error("Error fetching shipping rates:", error)
      }
    }
    fetchMethods()
  }, [checkoutId, selectedShippingAddress])

  return { shippingMethods, totalTaxAmount }
}

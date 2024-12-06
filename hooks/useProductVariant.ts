import { useState } from "react"

import { ShopifyProduct, VariantEdge } from "@/models/product"

const MIN_PRICE_FOR_99_CENTS = 10
const DELIVERY_PLANS = {
  MONTHLY: "Delivery every 1 month",
  QUARTERLY: "Delivery every 3 months",
} as const

export const useProductVariant = (product: ShopifyProduct) => {
  const [selectedVariant, setSelectedVariant] = useState<VariantEdge>(product.variants.edges[0])
  const [isOneTimePurchase, setIsOneTimePurchase] = useState(true)

  const is30DaySupply = selectedVariant.node.title.includes("30-day")

  const getSelectedSellingPlanGroup = () => {
    if (!selectedVariant.node?.sellingPlanGroups?.edges.length) return null

    return selectedVariant.node.sellingPlanGroups.edges.find((edge) =>
      is30DaySupply ? edge.node.name === DELIVERY_PLANS.MONTHLY : edge.node.name === DELIVERY_PLANS.QUARTERLY
    )
  }

  const getDiscountPercentage = () => {
    if (isOneTimePurchase) return 0

    const sellingPlanGroup = getSelectedSellingPlanGroup()
    if (!sellingPlanGroup) return 0

    return sellingPlanGroup.node.sellingPlans.edges[0].node.pricingPolicies[0].adjustmentValue.percentage || 0
  }

  const calculatePrice = () => {
    const basePrice = isOneTimePurchase
      ? parseFloat(selectedVariant.node.price)
      : Math.ceil(
          (parseFloat(selectedVariant.node.price) -
            (parseFloat(selectedVariant.node.price) * getDiscountPercentage()) / 100) *
            100
        ) / 100

    if (basePrice >= MIN_PRICE_FOR_99_CENTS && basePrice.toFixed(2).endsWith(".00")) {
      return basePrice - 0.01
    }

    return basePrice
  }

  return {
    selectedVariant,
    setSelectedVariant,
    isOneTimePurchase,
    setIsOneTimePurchase,
    getSelectedSellingPlanGroup,
    calculatePrice,
  }
}

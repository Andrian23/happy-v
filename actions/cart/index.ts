"use server"

import { VariantEdge } from "@/models/product"

import {
  mutationCreateCart,
  mutationUpdateSelectedShippingOption,
  mutationUpdateShippingAddress,
  queryGetShippingMethods,
  queryGetShippingRates,
} from "./graphqlQueries"

interface CartCreateResponse {
  data: {
    cartCreate: {
      cart: { id: string }
      userErrors: { message: string }[]
    }
  }
  errors?: { message: string }[]
}

interface CartBuyerIdentityUpdateResponse {
  data: {
    cartBuyerIdentityUpdate: {
      cart: { buyerIdentity: object }
      userErrors: { message: string }[]
    }
  }
  errors?: { message: string }[]
}

interface ShippingMethodsResponse {
  data: {
    cart: {
      availableShippingMethods: string[]
    }
  }
  errors?: { message: string }[]
}

interface ShippingRatesResponse {
  data: {
    cart: {
      cost: {
        totalTaxAmount: {
          amount: string
          currencyCode: string
        }
      }
      deliveryGroups: {
        edges: {
          node: {
            id: string
            deliveryOptions: {
              code: string
              title: string
              handle: string
              estimatedCost: { amount: string; currency: string }
              groupId: string
            }[]
          }
        }[]
      }
    }
  }
  errors?: { message: string }[]
}

interface DeliveryGroupsUpdateResponse {
  data: {
    cartSelectedDeliveryOptionsUpdate: {
      cart: {
        deliveryGroups: object[]
      }
      userErrors: { message: string }[]
    }
  }
  errors?: { message: string }[]
}

async function fetchGraphQL<T>(query: string, variables: object): Promise<T> {
  const response = await fetch(`https://happy-v.myshopify.com/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  })

  return await response.json()
}

export async function createCheckoutSession(
  products: Array<
    VariantEdge & {
      amount?: number
      sellingPlanId?: string | null
    }
  >
): Promise<string> {
  const lines = products.map((product) => {
    const line = {
      merchandiseId: product.node.id,
      quantity: product.amount ?? 1,
    }

    if (product.sellingPlanId) {
      return {
        ...line,
        sellingPlanId: product.sellingPlanId,
      }
    }

    return line
  })

  const cartInput = { lines, attributes: [{ key: "source", value: "DEAP" }] }
  const result = await fetchGraphQL<CartCreateResponse>(mutationCreateCart, { input: cartInput })

  // if (result.errors) {
  //   throw new Error("Error creating cart: " + result.errors.map((e) => e.message).join(", "))
  // }
  //
  // if (result.data.cartCreate.userErrors.length > 0) {
  //   throw new Error(result.data.cartCreate.userErrors.map((e) => e.message).join(", "))
  // }

  return result.data.cartCreate.cart.id
}

export async function updateShippingAddress(
  cartId: string,
  buyerIdentity: {
    email: string
    deliveryAddressPreferences: {
      deliveryAddress: {
        address1: string
        address2: string
        city: string
        country: string
        firstName: string
        lastName: string
        province: string
        zip: string
        phone: string
      }
    }[]
  }
): Promise<object> {
  const result = await fetchGraphQL<CartBuyerIdentityUpdateResponse>(mutationUpdateShippingAddress, {
    cartId,
    buyerIdentity,
  })

  if (result.errors) {
    throw new Error("Error updating shipping address")
  }

  if (result.data.cartBuyerIdentityUpdate.userErrors.length > 0) {
    throw new Error(result.data.cartBuyerIdentityUpdate.userErrors.map((e) => e.message).join(", "))
  }

  return result.data.cartBuyerIdentityUpdate.cart.buyerIdentity
}

export async function getShippingMethods(cartId: string): Promise<string[]> {
  const result = await fetchGraphQL<ShippingMethodsResponse>(queryGetShippingMethods, { cartId })

  if (result.errors) {
    throw new Error("Error fetching shipping methods")
  }

  return result.data.cart.availableShippingMethods
}

export async function fetchShippingRates(cartId: string) {
  const result = await fetchGraphQL<ShippingRatesResponse>(queryGetShippingRates, { cartId })

  if (result.errors) {
    throw new Error("Error fetching shipping rates")
  }

  const totalTaxAmount = result.data.cart.cost.totalTaxAmount
  const deliveryOptions = result.data.cart.deliveryGroups.edges.flatMap((edge) =>
    edge.node.deliveryOptions.map((option) => ({
      ...option,
      groupId: edge.node.id,
    }))
  )

  return { totalTaxAmount, deliveryOptions }
}

export async function updateShippingMethod(
  cartId: string,
  selectedDeliveryOptions: { deliveryOptionHandle: string; deliveryGroupId: string }[]
): Promise<object[]> {
  if (!cartId || selectedDeliveryOptions.length === 0) {
    throw new Error("Cart ID and delivery options are required")
  }

  selectedDeliveryOptions.forEach((option, index) => {
    if (!option.deliveryGroupId || !option.deliveryOptionHandle) {
      throw new Error(
        `Invalid delivery option at index ${index}: both deliveryGroupId and deliveryOptionHandle are required`
      )
    }
  })

  const result = await fetchGraphQL<DeliveryGroupsUpdateResponse>(mutationUpdateSelectedShippingOption, {
    cartId,
    selectedDeliveryOptions,
  })

  if (result.errors) {
    throw new Error("Error updating shipping method")
  }

  if (result.data.cartSelectedDeliveryOptionsUpdate.userErrors.length > 0) {
    throw new Error(result.data.cartSelectedDeliveryOptionsUpdate.userErrors.map((e) => e.message).join(", "))
  }

  return result.data.cartSelectedDeliveryOptionsUpdate.cart.deliveryGroups
}

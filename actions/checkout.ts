"use server"

import { ShopifyProduct } from "@/models/product"

const query = /* GraphQL */ `
  mutation ($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`

export async function createCheckoutSession(products: Array<ShopifyProduct & { amount?: number }>) {
  const lines = products.map((product) => ({
    variantId: product.variants.edges[0].node.id,
    quantity: product.amount ?? 1,
  }))

  const response = await fetch(`https://happy-v.myshopify.com/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables: { lines } }),
  })

  const result = await response.json()

  return result.data.cartCreate.cart.checkoutUrl
}

"use server"

import { ShopifyProduct } from "@/models/product"

const queryProducts = /* GraphQL */ `
  {
    products(first: 100) {
      edges {
        node {
          id
          title
          status
          tags
          images(first: 1) {
            edges {
              node {
                src
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                sku
                price
                inventoryQuantity
              }
            }
          }
        }
      }
    }
  }
`

export async function getProducts(): Promise<ShopifyProduct[]> {
  const response = await fetch(`https://happy-v.myshopify.com/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query: queryProducts }),
  })

  const result = await response.json()

  return result.data.products.edges.map((edge: { node: ShopifyProduct }) => edge.node)
}

const queryProductById = /* GraphQL */ `
  query getProductById($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      status
      images(first: 1) {
        edges {
          node {
            src
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            sku
            price
            inventoryQuantity
          }
        }
      }
    }
  }
`

export async function getProductById(productId: number): Promise<ShopifyProduct> {
  const response = await fetch(`https://happy-v.myshopify.com/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query: queryProductById, variables: { id: `gid://shopify/Product/${productId}` } }),
  })

  const result = await response.json()

  return result.data.product
}

"use server"

import type { Product } from "@/models/product"

export const getAllProducts = async (): Promise<{ products: Product[] }> => {
  const apiKey = process.env.SHOPIFY_API
  const url = "https://happyv.com/admin/api/2024-04/products.json"

  if (!apiKey) {
    throw new Error("Shopify API key is not provided")
  }

  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("X-Shopify-Access-Token", apiKey)

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  })

  if (!res.ok) {
    console.log("error")
  }

  return res.json()
}

export const getProductById = async (productId: number): Promise<{ product: Product }> => {
  const apiKey = process.env.SHOPIFY_API
  const url = `https://happyv.com/admin/api/2024-04/products/${productId}.json`

  if (!apiKey) {
    throw new Error("Shopify API key is not provided")
  }

  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("X-Shopify-Access-Token", apiKey)

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  })

  if (!res.ok) {
    console.log("error")
  }

  return res.json()
}

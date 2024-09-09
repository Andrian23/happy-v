"use server"

export const getAllOrders = async () => {
  const apiKey = process.env.SHOPIFY_API
  const url = "https://happyv.com/admin/api/2024-04/orders.json"

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

export const getOrderById = async (orderId: number) => {
  const apiKey = process.env.SHOPIFY_API
  const url = `https://happyv.com/admin/api/2024-04/orders/${orderId}.json`

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

export const createNewOrder = async (orderData: Record<string, string>) => {
  const apiKey = process.env.SHOPIFY_API
  const url = `https://happyv.com/admin/api/2024-04/orders.json`

  if (!apiKey) {
    throw new Error("Shopify API key is not provided")
  }

  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("X-Shopify-Access-Token", apiKey)

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ order: orderData }),
  })

  if (!res.ok) {
    console.log("error")
    throw new Error("Failed to create new order")
  }

  return res.json()
}

export const getProductImageByOrderId = async (orderId: number) => {
  const apiKey = process.env.SHOPIFY_API
  const orderUrl = `https://happyv.com/admin/api/2024-04/orders/${orderId}.json`

  if (!apiKey) {
    throw new Error("Shopify API key is not provided")
  }

  const orderHeaders = new Headers()
  orderHeaders.append("Content-Type", "application/json")
  orderHeaders.append("X-Shopify-Access-Token", apiKey)

  try {
    // First request to get order details
    const orderRes = await fetch(orderUrl, {
      method: "GET",
      headers: orderHeaders,
    })

    if (!orderRes.ok) {
      throw new Error("Failed to fetch order details")
    }

    const orderData = await orderRes.json()

    // Check if line_items exist and are not empty
    if (!orderData.line_items || orderData.line_items.length === 0) {
      throw new Error("No products found in the order")
    }

    // Extracting product ID from the first line item
    const productId = orderData.line_items[0].product_id
    if (!productId) {
      throw new Error("Product ID not found in the order")
    }

    const productUrl = `https://happyv.com/admin/api/2024-04/products/${productId}.json`

    // Second request to get product details
    const productRes = await fetch(productUrl, {
      method: "GET",
      headers: orderHeaders,
    })

    if (!productRes.ok) {
      throw new Error("Failed to fetch product details")
    }

    const productData = await productRes.json()

    return productData
  } catch (error) {
    console.error("Error:", error)
    throw new Error("Failed to fetch data")
  }
}

export const getProductDetailsByOrderId = async (orderId: number) => {
  const apiKey = process.env.SHOPIFY_API
  const orderUrl = `https://happyv.com/admin/api/2024-04/orders/${orderId}.json`

  if (!apiKey) {
    throw new Error("Shopify API key is not provided")
  }

  const orderHeaders = new Headers()
  orderHeaders.append("Content-Type", "application/json")
  orderHeaders.append("X-Shopify-Access-Token", apiKey)

  try {
    const orderRes = await fetch(orderUrl, {
      method: "GET",
      headers: orderHeaders,
    })

    if (!orderRes.ok) {
      throw new Error("Failed to fetch order details")
    }

    const orderData = await orderRes.json()

    if (!orderData.order.line_items || orderData.order.line_items.length === 0) {
      throw new Error("No products found in the order")
    }

    const productDetails = []

    for (const item of orderData.order.line_items) {
      const productId = item.product_id
      const productUrl = `https://happyv.com/admin/api/2024-04/products/${productId}.json`

      const productRes = await fetch(productUrl, {
        method: "GET",
        headers: orderHeaders,
      })

      if (!productRes.ok) {
        console.error(`Failed to fetch product details for product ID: ${productId}`)
        continue // Skip this product if the fetch fails
      }

      const productData = await productRes.json()
      productDetails.push(productData)
    }

    return productDetails
  } catch (error) {
    console.error("Error:", error)
    throw new Error("Failed to fetch data")
  }
}

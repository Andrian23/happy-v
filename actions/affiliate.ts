"use server"

import { db } from "@/lib/db"

import { findUserById } from "./user"

export const createPriceRule = async () => {
  const apiKey = process.env.SHOPIFY_API
  const url = "https://happyv.com/admin/api/2024-04/price_rules.json"

  if (!apiKey) {
    throw new Error("Shopify API key is not provided")
  }

  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("X-Shopify-Access-Token", apiKey)

  const body = JSON.stringify({
    price_rule: {
      title: "10% off",
      target_type: "line_item",
      target_selection: "all",
      allocation_method: "across",
      value_type: "percentage",
      value: "-10.0",
      customer_selection: "all",
      starts_at: new Date().toISOString(),
    },
  })

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  })

  if (!res.ok) {
    console.log("error")
    throw new Error("Failed to create price rule")
  }

  const priceRuleData = await res.json()
  return priceRuleData.price_rule.id
}

export const createAffiliate = async () => {
  const user = await findUserById()
  const apiKey = process.env.SHOPIFY_API

  if (!user) {
    throw new Error("User not found")
  }

  // Get or create price rule
  let priceRuleId
  const priceRules = await Promise.resolve([{ id: 1 }])
  if (priceRules.length > 0) {
    priceRuleId = priceRules[0].id
  } else {
    priceRuleId = await createPriceRule()
  }

  const url = `https://happyv.com/admin/api/2024-04/price_rules/${priceRuleId}/discount_codes.json`

  if (!apiKey) {
    throw new Error("Shopify API key is not provided")
  }

  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("X-Shopify-Access-Token", apiKey)

  const discountCode = `${user.name}_${user.lastName}`
  const body = JSON.stringify({
    discount_code: {
      code: discountCode,
    },
  })

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  })

  if (!res.ok) {
    console.log("error")
    throw new Error("Failed to create discount code")
  }

  const discountData = await res.json()

  // Save to Affiliete table
  await db.affiliate.create({
    data: {
      userId: user.id,
      discountCode: discountData.discount_code.code,
    },
  })

  return discountData
}

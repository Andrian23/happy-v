"use server"

import { findUserById } from "@/actions/user"
import { db } from "@/lib/db"
import { VerificationUserStatus, VerificationUserStatusReverseMap } from "@/models/participants"

import { CREATE_DISCOUNT_CODE } from "./graphqlQueries"

export async function createReferralCode(): Promise<string> {
  const currentDate = new Date()
  const ninetyDaysInMilliseconds = 90 * 24 * 60 * 60 * 1000
  const futureDate = new Date(currentDate.getTime() + ninetyDaysInMilliseconds)

  try {
    const user = await findUserById()

    if (!user) {
      throw new Error("User not found")
    }

    if (user.verificationStatus !== VerificationUserStatusReverseMap[VerificationUserStatus.ACTIVE]) {
      throw new Error("User is not verified for the action")
    }

    if (user.referralCode) {
      return user.referralCode
    }

    const prefix = "HappyDr"
    const timestamp = Date.now().toString().slice(-4)
    const lastName = user.lastName ? user.lastName.replace(/[^a-zA-Z0-9]/g, "") : ""
    const namePart = user.name
      ? user.name
          .replace(/[^a-zA-Z0-9]/g, "")
          .substring(0, 1)
          .toUpperCase()
      : ""

    const uniqueCode = `${prefix}${namePart}${lastName}${timestamp}`
    const finalCode = uniqueCode.substring(0, 50)

    if (!process.env.SHOPIFY_STORE) {
      throw new Error("Shopify API key is not provided")
    }

    const shopifyAdminUrl = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/graphql.json`

    const variables = {
      basicCodeDiscount: {
        title: finalCode,
        code: finalCode,
        startsAt: currentDate.toISOString(),
        endsAt: futureDate.toISOString(),
        usageLimit: null,
        combinesWith: {
          orderDiscounts: true,
          productDiscounts: true,
          shippingDiscounts: true,
        },
        appliesOncePerCustomer: false,
        customerSelection: {
          all: true,
        },
        customerGets: {
          value: {
            percentage: 0.15,
          },
          items: {
            all: true,
          },
        },
      },
    }

    if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      throw new Error("Shopify API key is not provided")
    }

    const response = await fetch(shopifyAdminUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        query: CREATE_DISCOUNT_CODE,
        variables,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Shopify API request failed: ${errorText}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    if (data.data?.discountCodeBasicCreate?.userErrors?.length > 0) {
      throw new Error(`Discount creation errors: ${JSON.stringify(data.data.discountCodeBasicCreate.userErrors)}`)
    }

    const code = data.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount?.codes?.nodes[0]?.code

    if (!code) {
      throw new Error("Failed to retrieve the created discount code")
    }

    const referralLink = `http://happyv.com/discount/${code}`

    await db.user.update({
      where: { id: user.id },
      data: {
        referralCode: code,
        referralLink: referralLink,
      },
    })

    return code
  } catch (error) {
    console.error("Error creating referral code:", error)
    throw new Error(`Failed to create referral code: ${(error as { message: string }).message}`)
  }
}

export async function getUserReferralCode(): Promise<{ code: string | null; link: string | null }> {
  try {
    const user = await findUserById()

    if (!user) {
      throw new Error("User not found")
    }

    return {
      code: user.referralCode as string,
      link: user.referralLink as string,
    }
  } catch (error) {
    console.error("Error getting user referral code:", error)
    throw error
  }
}

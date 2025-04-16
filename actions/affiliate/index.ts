"use server"

import { findUserById } from "@/actions/user"
import { db } from "@/lib/db"
import { VerificationUserStatus, VerificationUserStatusReverseMap } from "@/models/participants"

import { CREATE_DISCOUNT_CODE, GET_DISCOUNT_CODE_STATUS } from "./graphqlQueries"

export async function createReferralCode(forceNewCode = false): Promise<string> {
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

    if (user.referralCode && !forceNewCode) {
      try {
        const { isValid } = await checkDiscountCodeStatus(user.referralCode)
        if (isValid) {
          return user.referralCode
        }
      } catch (e) {
        console.warn("Couldn't verify code validity:", e)
        return user.referralCode
      }
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
          orderDiscounts: false,
          productDiscounts: false,
          shippingDiscounts: false,
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

export async function getUserReferralCode(): Promise<{
  code: string | null
  link: string | null
  isValid?: boolean
}> {
  try {
    const user = await findUserById()

    if (!user) {
      throw new Error("User not found")
    }

    let isValid = undefined

    if (user.referralCode) {
      try {
        const validityCheck = await checkDiscountCodeStatus(user.referralCode)
        isValid = validityCheck.isValid
      } catch (e) {
        console.warn("Could not verify code validity:", e)
      }
    }

    return {
      code: user.referralCode as string,
      link: user.referralLink as string,
      isValid,
    }
  } catch (error) {
    console.error("Error getting user referral code:", error)
    throw error
  }
}

export async function checkDiscountCodeStatus(code: string): Promise<{
  isValid: boolean
}> {
  try {
    if (!process.env.SHOPIFY_STORE || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      throw new Error("Shopify credentials not found")
    }

    const shopifyAdminUrl = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/graphql.json`

    const response = await fetch(shopifyAdminUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: GET_DISCOUNT_CODE_STATUS,
        variables: { code },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Shopify API request failed: ${errorText}`)
    }

    const data = await response.json()

    if (!data.data?.codeDiscountNodeByCode?.codeDiscount) {
      return { isValid: false }
    }

    const discountData = data.data.codeDiscountNodeByCode.codeDiscount

    const isActive = discountData.status === "ACTIVE"
    const endsAt = discountData.endsAt
    const startsAt = discountData.startsAt

    const now = new Date()
    const hasStarted = !startsAt || new Date(startsAt) <= now
    const notEnded = !endsAt || new Date(endsAt) > now

    return {
      isValid: isActive && hasStarted && notEnded,
    }
  } catch (error) {
    console.error("Error checking discount code status:", error)
    throw error
  }
}

import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"

function verifyShopifyWebhook(req: NextRequest): boolean {
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256")
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET

  return !(!hmacHeader || !shopifySecret)
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyShopifyWebhook(req)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const order = await req.json()

    const shopifyOrderId = order.id.toString()
    const customerEmail = order.email
    const orderTotal = parseFloat(order.total_price)
    const orderDate = new Date(order.created_at)

    let referralCode = null

    if (order.discount_codes && order.discount_codes.length > 0) {
      for (const discount of order.discount_codes) {
        const doctor = await db.user.findFirst({
          where: { referralCode: discount.code },
        })

        if (doctor) {
          referralCode = discount.code
          break
        }
      }
    }

    if (!referralCode && order.landing_site) {
      const match = order.landing_site.match(/\/discount\/([^/?]+)/)
      if (match && match[1]) {
        const possibleCode = match[1]

        const doctor = await db.user.findFirst({
          where: { referralCode: possibleCode },
        })

        if (doctor) {
          referralCode = possibleCode
        }
      }
    }

    if (!referralCode) {
      return NextResponse.json({ status: "No referral found" }, { status: 200 })
    }

    const doctor = await db.user.findFirst({
      where: { referralCode },
    })

    if (!doctor) {
      return NextResponse.json({ status: "Doctor not found" }, { status: 200 })
    }

    const patientReferral = await db.patientReferral.upsert({
      where: {
        doctorId_patientEmail: {
          doctorId: doctor.id,
          patientEmail: customerEmail,
        },
      },
      update: {},
      create: {
        doctorId: doctor.id,
        patientEmail: customerEmail,
        referredAt: new Date(),
      },
    })

    const existingCommission = await db.commission.findUnique({
      where: {
        doctorId_shopifyOrderId: {
          doctorId: doctor.id,
          shopifyOrderId,
        },
      },
    })

    if (existingCommission) {
      return NextResponse.json({ status: "Order already processed" }, { status: 200 })
    }

    const commissionRate = doctor.commissionRate || 0.15
    const commissionAmount = orderTotal * commissionRate

    await db.commission.create({
      data: {
        doctorId: doctor.id,
        patientReferralId: patientReferral.id,
        shopifyOrderId,
        amount: commissionAmount,
        orderTotal,
        orderDate,
        status: "PENDING",
      },
    })

    await db.user.update({
      where: { id: doctor.id },
      data: {
        totalCommissionEarned: { increment: commissionAmount },
        lastActiveAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        status: "success",
        message: "Commission recorded successfully",
        commission: commissionAmount,
        doctor: doctor.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing order webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

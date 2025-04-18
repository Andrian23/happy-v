import { NextRequest, NextResponse } from "next/server"

import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"
import { verifyShopifyWebhook } from "@/lib/verifyShopifyWebhook"

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyShopifyWebhook(req))) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const order = await req.json()
    const shopifyOrderId = order.id.toString()
    const customerEmail = order.email
    const orderTotal = parseFloat(order.subtotal_price)
    const orderDate = new Date(order.created_at)

    const existingCommissions = await db.commission.findMany({
      where: {
        shopifyOrderId,
      },
    })

    if (existingCommissions.length > 0) {
      const processedCommissions = []

      for (const commission of existingCommissions) {
        if (commission.status === "PENDING") {
          await db.commission.update({
            where: { id: commission.id },
            data: {
              status: "PAID",
            },
          })
          processedCommissions.push(commission.id)
        }
      }

      return NextResponse.json(
        {
          status: "success",
          message: `Updated ${processedCommissions.length} commissions to PAID status`,
          processedCommissions,
        },
        { status: 200 }
      )
    }

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
      return NextResponse.json({ status: "No referral found for this order" }, { status: 200 })
    }

    const doctor = await db.user.findFirst({
      where: { referralCode },
    })

    if (!doctor) {
      return NextResponse.json({ status: "Doctor not found" }, { status: 200 })
    }

    let patientReferral
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        patientReferral = await db.patientReferral.upsert({
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
        break
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" &&
          retryCount < maxRetries - 1
        ) {
          retryCount++
          await new Promise((resolve) => setTimeout(resolve, 500 * retryCount))
        } else {
          throw error
        }
      }
    }

    if (!patientReferral) {
      patientReferral = await db.patientReferral.findUnique({
        where: {
          doctorId_patientEmail: {
            doctorId: doctor.id,
            patientEmail: customerEmail,
          },
        },
      })

      if (!patientReferral) {
        throw new Error("Could not create or find patient referral after multiple retries")
      }
    }

    const commissionRate = doctor.commissionRate || 0.15
    const commissionAmount = orderTotal * commissionRate

    let newCommission
    retryCount = 0

    while (retryCount < maxRetries) {
      try {
        newCommission = await db.commission.create({
          data: {
            doctorId: doctor.id,
            patientReferralId: patientReferral.id,
            shopifyOrderId,
            amount: commissionAmount,
            orderTotal,
            orderDate,
            status: "PAID",
          },
        })

        break
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" &&
          retryCount < maxRetries - 1
        ) {
          retryCount++
          await new Promise((resolve) => setTimeout(resolve, 500 * retryCount))
        } else {
          throw error
        }
      }
    }

    if (!newCommission) {
      const existingCommission = await db.commission.findUnique({
        where: {
          doctorId_shopifyOrderId: {
            doctorId: doctor.id,
            shopifyOrderId,
          },
        },
      })

      if (existingCommission) {
        return NextResponse.json(
          {
            status: "success",
            message: "Commission already exists",
            commission: existingCommission.id,
          },
          { status: 200 }
        )
      } else {
        throw new Error("Could not create or find commission after multiple retries")
      }
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Commission record created with PAID status",
        commission: newCommission.id,
        doctor: doctor.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing order paid webhook:", error)

    let message = "Unknown error"
    if (error instanceof Error) {
      message = error.message
    }

    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 })
  }
}

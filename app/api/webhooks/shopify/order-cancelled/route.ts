import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"
import { verifyShopifyWebhook } from "@/lib/verifyShopifyWebhook"

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyShopifyWebhook(req))) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const order = await req.json()
    const shopifyOrderId = order.id.toString()

    const commissions = await db.commission.findMany({
      where: { shopifyOrderId },
    })

    if (commissions.length === 0) {
      return NextResponse.json(
        {
          status: "No commissions found for this order",
        },
        { status: 200 }
      )
    }

    const processedCommissions = []

    for (const commission of commissions) {
      if (commission.status === "CREDITED") {
        await db.user.update({
          where: { id: commission.doctorId },
          data: {
            totalCommissionEarned: { decrement: commission.amount },
          },
        })
      }

      await db.commission.update({
        where: { id: commission.id },
        data: {
          status: "CANCELLED",
        },
      })

      processedCommissions.push(commission.id)
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Commissions cancelled",
        processedCommissions,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing order cancellation webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

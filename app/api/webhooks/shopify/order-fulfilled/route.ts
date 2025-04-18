import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"
import { verifyShopifyWebhook } from "@/lib/verifyShopifyWebhook"

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyShopifyWebhook(req))) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const payload = await req.json()
    let shopifyOrderId

    if (payload.id) {
      shopifyOrderId = payload.id.toString()
    } else if (payload.order_id) {
      shopifyOrderId = payload.order_id.toString()
    } else if (payload.fulfillments && payload.fulfillments.length > 0 && payload.fulfillments[0].order_id) {
      shopifyOrderId = payload.fulfillments[0].order_id.toString()
    } else {
      return NextResponse.json(
        {
          error: "Could not find order ID in fulfillment payload",
          payload: payload,
        },
        { status: 400 }
      )
    }

    const commissions = await db.commission.findMany({
      where: {
        shopifyOrderId,
        status: "PAID",
      },
    })

    if (commissions.length === 0) {
      return NextResponse.json(
        {
          status: "No eligible commissions found for this order",
        },
        { status: 200 }
      )
    }

    const processedCommissions = []

    for (const commission of commissions) {
      await db.commission.update({
        where: { id: commission.id },
        data: {
          status: "CREDITED",
          paidAt: new Date(),
        },
      })

      await db.user.update({
        where: { id: commission.doctorId },
        data: {
          totalCommissionEarned: { increment: commission.amount },
          lastActiveAt: new Date(),
        },
      })

      processedCommissions.push(commission.id)
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Commissions processed and credited",
        processedCommissions,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing order fulfillment webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"
import { verifyShopifyWebhook } from "@/lib/verifyShopifyWebhook"

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyShopifyWebhook(req))) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const refund = await req.json()
    const shopifyOrderId = refund.order_id.toString()

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

    let isFullRefund = false

    if (refund.refund_line_items && refund.refund_line_items.length > 0) {
      isFullRefund = refund.refund_line_items.some((item: { restock_type: string }) => item.restock_type === "cancel")
    }

    if (!isFullRefund && refund.transactions && refund.transactions.length > 0) {
      const refundAmount = parseFloat(refund.transactions[0].amount || "0")
      if (commissions[0] && commissions[0].orderTotal) {
        const orderTotal = parseFloat(commissions[0].orderTotal.toString())
        const diffPercentage = Math.abs(refundAmount - orderTotal) / orderTotal
        if (diffPercentage < 0.01) {
          isFullRefund = true
        }
      }
    }

    if (!isFullRefund && refund.order && refund.order.line_items && refund.refund_line_items) {
      const totalOrderItems = refund.order.line_items.reduce(
        (
          sum: number,
          item: {
            quantity: number
          }
        ) => sum + (item.quantity || 0),
        0
      )
      const totalRefundedItems = refund.refund_line_items.reduce(
        (
          sum: number,
          item: {
            quantity: number
          }
        ) => sum + (item.quantity || 0),
        0
      )
      if (totalRefundedItems >= totalOrderItems) {
        isFullRefund = true
      }
    }

    if (isFullRefund) {
      const updatedCommissions = []
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
            status: "REFUNDED",
          },
        })
        updatedCommissions.push(commission.id)
      }

      return NextResponse.json(
        {
          status: "success",
          message: "Full refund processed, commissions marked as refunded",
          updatedCommissions,
        },
        { status: 200 }
      )
    } else {
      const refundAmount = parseFloat(refund.transactions[0]?.amount || "0")
      const updatedCommissions = []

      for (const commission of commissions) {
        if (commission.status === "CREDITED") {
          const refundPercentage = refundAmount / commission.orderTotal
          const commissionToReverse = commission.amount * refundPercentage

          await db.user.update({
            where: { id: commission.doctorId },
            data: {
              totalCommissionEarned: { decrement: commissionToReverse },
            },
          })

          await db.commission.update({
            where: { id: commission.id },
            data: {
              amount: commission.amount - commissionToReverse,
            },
          })

          updatedCommissions.push(commission.id)
        }
      }

      return NextResponse.json(
        {
          status: "success",
          message: "Partial refund processed, commissions adjusted",
          updatedCommissions,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

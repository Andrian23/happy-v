import { NextRequest, NextResponse } from "next/server"

import { getOrderByOrderId } from "@/actions/order"
import { db } from "@/lib/db"
import { verifyShopifyWebhook } from "@/lib/verifyShopifyWebhook"

type CommissionStatus = "PAID" | "CREDITED" | "REFUNDED" | "PENDING" | "CANCELLED"

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
      return NextResponse.json({ status: "No commissions found for this order" }, { status: 200 })
    }

    const completeOrder = await getOrderByOrderId(shopifyOrderId)

    const refunds = completeOrder?.refunds || []

    let totalRefundedAmount = 0
    refunds.forEach((refundItem) => {
      if (refundItem.totalRefunded && refundItem.totalRefunded.amount) {
        totalRefundedAmount += parseFloat(refundItem.totalRefunded.amount)
      }
    })

    const orderTotal = parseFloat(commissions[0].orderTotal.toString())

    const isFullRefund = totalRefundedAmount / orderTotal > 0.99

    if (isFullRefund) {
      const updatedCommissions = []

      for (const comm of commissions) {
        if ((comm.status === "CREDITED" || comm.status === "PAID") && comm.amount > 0) {
          await db.user.update({
            where: { id: comm.doctorId },
            data: {
              totalCommissionEarned: { decrement: comm.amount },
            },
          })
        }

        await db.commission.update({
          where: { id: comm.id },
          data: {
            status: "REFUNDED",
            amount: 0,
          },
        })

        updatedCommissions.push(comm.id)
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
      const currentRefundAmount =
        refund.transactions && refund.transactions[0]?.amount ? parseFloat(refund.transactions[0].amount) : 0

      const refundPercentage = currentRefundAmount / orderTotal

      const updatedCommissions = []

      for (const comm of commissions) {
        if (comm.status === "CREDITED" || comm.status === "PAID") {
          const commissionToReverse = comm.amount * refundPercentage

          await db.user.update({
            where: { id: comm.doctorId },
            data: {
              totalCommissionEarned: { decrement: commissionToReverse },
            },
          })

          const newAmount = Math.max(0, comm.amount - commissionToReverse)

          let newStatus = comm.status as CommissionStatus
          if (newAmount < 0.01) {
            newStatus = "REFUNDED"
          } else if (comm.status === "PAID") {
            newStatus = "CREDITED"
          }

          await db.commission.update({
            where: { id: comm.id },
            data: {
              amount: newAmount,
              status: newStatus,
            },
          })

          updatedCommissions.push(comm.id)
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
    console.error("Error processing refund webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

"use server"

import { z } from "zod"

import { db } from "@/lib/db"

const getDoctorCommissionsSchema = z.object({
  doctorId: z.string({
    required_error: "Doctor ID is required",
  }),
  period: z.enum(["all", "week", "month", "year"]).optional().default("all"),
})

export async function getDoctorCommissions(input: z.infer<typeof getDoctorCommissionsSchema>) {
  try {
    const { doctorId, period } = getDoctorCommissionsSchema.parse(input)

    let dateFilter = {}
    const now = new Date()

    if (period === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate() - 7)
      dateFilter = { gte: weekAgo }
    } else if (period === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      dateFilter = { gte: monthAgo }
    } else if (period === "year") {
      const yearAgo = new Date()
      yearAgo.setFullYear(now.getFullYear() - 1)
      dateFilter = { gte: yearAgo }
    }

    const commissions = await db.commission.findMany({
      where: {
        doctorId,
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
      },
      include: {
        patientReferral: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const stats = await db.commission.aggregate({
      where: {
        doctorId,
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
      },
      _sum: {
        amount: true,
        orderTotal: true,
      },
      _count: true,
    })

    const doctor = await db.user.findUnique({
      where: { id: doctorId },
      select: {
        name: true,
        lastName: true,
        email: true,
        referralCode: true,
        referralLink: true,
        totalCommissionEarned: true,
      },
    })

    const patientCount = await db.patientReferral.count({
      where: { doctorId },
    })

    return {
      success: true,
      commissions,
      stats: {
        totalCommission: stats._sum.amount || 0,
        totalSales: stats._sum.orderTotal || 0,
        orderCount: stats._count,
        patientCount,
      },
      doctor,
    }
  } catch (error) {
    console.error("Error fetching doctor commissions:", error)
    return {
      success: false,
      error: "Failed to fetch commission data",
    }
  }
}

export async function updateCommissionStatus(commissionId: string, status: "PENDING" | "PAID" | "CANCELLED") {
  try {
    const commission = await db.commission.update({
      where: { id: commissionId },
      data: {
        status,
        ...(status === "PAID" ? { paidAt: new Date() } : {}),
      },
    })

    return { success: true, commission }
  } catch (error) {
    console.error("Error updating commission status:", error)
    return { success: false, error: "Failed to update commission status" }
  }
}

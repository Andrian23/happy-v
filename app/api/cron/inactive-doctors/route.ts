import { NextResponse } from "next/server"

import { PrismaClient } from "@prisma/client"

import { sendInactivityNotification } from "@/actions/emailEvents"

const prisma = new PrismaClient()

const INACTIVITY_THRESHOLD_DAYS = 30

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inactivityThreshold = new Date()
    inactivityThreshold.setDate(inactivityThreshold.getDate() - INACTIVITY_THRESHOLD_DAYS)

    const inactiveDoctors = await prisma.user.findMany({
      where: {
        OR: [{ lastActiveAt: { lt: inactivityThreshold } }, { lastActiveAt: null }],
        lastInactivityEmailSentAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        lastActiveAt: true,
      },
    })

    if (inactiveDoctors.length > 0) {
      const emailResults = []

      for (const doctor of inactiveDoctors) {
        try {
          const lastActiveDate = doctor.lastActiveAt ? doctor.lastActiveAt.toISOString().split("T")[0] : "never"

          await sendInactivityNotification({
            email: doctor.email || "",
            name: doctor.name || "",
            lastName: doctor.lastName || "",
            lastActiveDate: lastActiveDate,
            daysInactive: INACTIVITY_THRESHOLD_DAYS,
          })

          emailResults.push({
            doctorId: doctor.id,
            email: doctor.email,
            success: true,
          })

          await prisma.user.update({
            where: { id: doctor.id },
            data: {
              lastInactivityEmailSentAt: new Date(),
            },
          })
        } catch (error) {
          emailResults.push({
            doctorId: doctor.id,
            email: doctor.email,
            success: false,
            error: error,
          })
        }
      }

      return NextResponse.json({
        success: true,
        emailsSent: emailResults.filter((r) => r.success).length,
        failed: emailResults.filter((r) => !r.success).length,
        results: emailResults,
      })
    }

    return NextResponse.json({
      success: true,
      emailsSent: 0,
      message: "No inactive doctors found",
    })
  } catch (error) {
    console.error("Error processing inactive doctors cron job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

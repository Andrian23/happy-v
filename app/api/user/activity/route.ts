import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"

const UPDATE_INTERVAL = 60 * 60 * 1000

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userEmail = searchParams.get("userEmail")

  if (!userEmail) {
    return NextResponse.json({ error: "User Email is required" }, { status: 400 })
  }

  try {
    const user = await db.user.findUnique({
      where: { email: userEmail },
      select: { lastActiveAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const lastActiveAt = user.lastActiveAt ? new Date(user.lastActiveAt).getTime() : 0
    const now = new Date().getTime()

    if (now - lastActiveAt < UPDATE_INTERVAL) {
      return NextResponse.json({ status: "skipped" })
    }

    await db.user.update({
      where: { email: userEmail },
      data: { lastActiveAt: new Date() },
    })

    return NextResponse.json({ status: "success" })
  } catch (err) {
    console.error("Failed to update user activity:", err)
    return NextResponse.json({ error: "Failed to update user activity" }, { status: 500 })
  }
}

// pages/api/topic.ts
"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()

  try {
    const user = await db.user.findUnique({
      where: {
        id: session?.user.id,
      },
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Failed to create topic:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

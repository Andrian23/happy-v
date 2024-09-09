"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  const id = session?.user.id

  const { lastName, type_proffesion, place_work, telephone } = await req.json()

  if (!lastName || !type_proffesion || !place_work || !telephone) {
    return NextResponse.json({ message: "All fields are required!" }, { status: 400 })
  }

  try {
    const user = await db.user.updateMany({
      where: { id },
      data: {
        lastName,
        type_proffesion,
        place_work,
        telephone,
      },
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

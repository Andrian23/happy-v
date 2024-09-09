"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  const { selectedTitles, ambassadorLinks } = await req.json()

  if (!selectedTitles || !ambassadorLinks) {
    return NextResponse.json({ message: "selectedTitles and ambassadorLinks are required!" }, { status: 400 })
  }

  try {
    const newAmbassador = await db.ambassador.create({
      data: {
        selectedTitles,
        ambassadorLinks,
        userId: session?.user.id as string,
      },
    })

    return NextResponse.json({ newAmbassador }, { status: 200 })
  } catch (error) {
    console.error("Failed to create ambassador:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

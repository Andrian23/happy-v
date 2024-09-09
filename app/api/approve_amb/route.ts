"use server"

import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { id } = await req.json()

  try {
    const newAmbassador = await db.ambassador.update({
      data: {
        status: "active",
      },
      where: {
        id,
      },
    })

    return NextResponse.json({ newAmbassador }, { status: 200 })
  } catch (error) {
    console.error("Failed to create ambassador:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

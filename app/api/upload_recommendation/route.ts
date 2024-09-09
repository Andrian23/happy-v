"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  const { basicInfo, clients, discount, selectedProducts, status } = await req.json()

  if (!basicInfo) {
    return NextResponse.json({ message: "Basic info is required!" }, { status: 400 })
  }
  if (!clients) {
    return NextResponse.json({ message: "Clients are required!" }, { status: 400 })
  }
  if (discount === undefined) {
    return NextResponse.json({ message: "Discount is required!" }, { status: 400 })
  }
  if (!selectedProducts) {
    return NextResponse.json({ message: "Selected products are required!" }, { status: 400 })
  }
  if (!status) {
    return NextResponse.json({ message: "Status is required!" }, { status: 400 })
  }

  try {
    const newRecomendation = await db.recommendation.create({
      data: {
        userId: session?.user.id as string,
        basicInfo,
        clients,
        discount,
        selectedProducts,
        status,
      },
    })

    return NextResponse.json({ newRecomendation }, { status: 200 })
  } catch (error) {
    console.error("Failed to create recomendation:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

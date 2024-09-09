"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  const { basicInfo, discount, selectedProducts, status } = await req.json()

  if (!basicInfo) {
    return NextResponse.json({ message: "Basic info is required!" }, { status: 400 })
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
    const newTemplate = await db.template.create({
      data: {
        userId: session?.user.id as string,
        basicInfo,
        discount,
        selectedProducts,
        status,
      },
    })

    return NextResponse.json({ newTemplate }, { status: 200 })
  } catch (error) {
    console.error("Failed to create template:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

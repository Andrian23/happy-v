// pages/api/topic.ts
"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()

  const { title, description, selected } = await req.json()

  if (!session) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  if (!title || !description || !selected) {
    return NextResponse.json({ message: "Title and description are required!" }, { status: 400 })
  }

  try {
    const topic = await db.topic.create({
      data: {
        title,
        description,
        selected,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ topic }, { status: 200 })
  } catch (error) {
    console.error("Failed to create topic:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

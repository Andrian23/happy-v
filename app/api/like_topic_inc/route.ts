"use server"

import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  const { topicId } = await req.json()

  if (!topicId) {
    return NextResponse.json({ message: "Topic ID is required!" }, { status: 400 })
  }

  try {
    const topic = await db.topic.update({
      where: {
        id: topicId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ topic }, { status: 200 })
  } catch (error) {
    console.error("Failed to increment likes:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

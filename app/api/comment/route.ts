"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  const { comment, topicId } = await req.json()

  if (!comment || !topicId) {
    return NextResponse.json({ message: "Comment is required!" }, { status: 400 })
  }

  try {
    const newComment = await db.comment.create({
      data: {
        comment,
        topicId,
        parentId: topicId,
        userId: session?.user.id as string,
      },
    })

    return NextResponse.json({ newComment }, { status: 200 })
  } catch (error) {
    console.error("Failed to create topic:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

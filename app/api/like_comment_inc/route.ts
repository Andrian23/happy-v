"use server"

import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  const { commentId } = await req.json()

  if (!commentId) {
    return NextResponse.json({ message: "Topic ID is required!" }, { status: 400 })
  }

  try {
    const comment = await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ comment }, { status: 200 })
  } catch (error) {
    console.error("Failed to increment likes:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

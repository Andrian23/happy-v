"use server"

import { db } from "@/lib/db"

export async function toggleLike(userId: string, { topicId, replyId }: { topicId?: string; replyId?: string }) {
  if (!topicId && !replyId) {
    throw new Error("Topic or reply ID is required")
  }

  const existingLike = await db.like.findFirst({ where: { userId, topicId, replyId } })

  if (existingLike) {
    await db.like.deleteMany({ where: { userId, topicId, replyId } })

    return false
  }

  await db.like.create({ data: { userId, topicId, replyId } })

  return true
}

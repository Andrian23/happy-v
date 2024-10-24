"use server"

import { Prisma } from "@prisma/client"

import { auth } from "@/auth"
import { ReplyData, replySchema } from "@/schemas/reply"

import { db } from "../lib/db"

const replyWithAuthor = {
  include: {
    author: {
      select: { name: true, lastName: true, type_proffesion: true, image: true },
    },
    likes: { select: { userId: true } },
    _count: { select: { likes: true } },
  },
} satisfies Prisma.ReplyDefaultArgs

export type ReplyWithAuthor = Prisma.ReplyGetPayload<typeof replyWithAuthor>

export async function createReply(topicId: string, replyData: ReplyData): Promise<ReplyWithAuthor> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const validation = replySchema.safeParse(replyData)

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  try {
    return db.reply.create({
      data: { ...replyData, authorId: userId, topicId },
      ...replyWithAuthor,
    })
  } catch (error) {
    throw new Error((error as unknown as Error).message)
  }
}

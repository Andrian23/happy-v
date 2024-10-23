"use server"

import { Prisma, Topic } from "@prisma/client"

import { auth } from "@/auth"
import { TopicData, topicSchema } from "@/schemas/topic"

import { db } from "../lib/db"

export async function createTopic(topicData: TopicData): Promise<Topic> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const validation = topicSchema.safeParse(topicData)

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  try {
    return db.topic.create({ data: { ...topicData, authorId: userId } })
  } catch (error) {
    throw new Error((error as unknown as Error).message)
  }
}

const topicWithAuthorAndRepliesCountQuery = {
  include: {
    author: {
      select: { name: true, lastName: true, type_proffesion: true, image: true },
    },
    _count: { select: { replies: true } },
  },
}

export type TopicWithAuthor = Prisma.TopicGetPayload<typeof topicWithAuthorAndRepliesCountQuery>

export async function getTopics(params?: Partial<Topic>): Promise<{ topics: TopicWithAuthor[]; count: number }> {
  try {
    const [topics, count] = await db.$transaction([
      db.topic.findMany({
        where: params ? params : {},
        ...topicWithAuthorAndRepliesCountQuery,
        orderBy: { createdAt: "desc" },
      }),
      db.topic.count({ where: params ? params : {} }),
    ])

    return { topics, count }
  } catch (error) {
    throw new Error((error as unknown as Error).message)
  }
}

const topicWithAuthorAndReplies = {
  include: {
    author: {
      select: { name: true, lastName: true, type_proffesion: true, image: true },
    },
    _count: { select: { replies: true } },
    replies: true,
  },
}
export type TopicWithAuthorAndReplies = Prisma.TopicGetPayload<typeof topicWithAuthorAndReplies>

export async function getTopicById(id: string): Promise<TopicWithAuthorAndReplies | null> {
  try {
    return db.topic.findUnique({ where: { id }, ...topicWithAuthorAndReplies })
  } catch (error) {
    throw new Error((error as unknown as Error).message)
  }
}

export async function countTopics(): Promise<number> {
  try {
    const count = await db.topic.count()
    return count
  } catch (error) {
    console.error("Failed to count topics:", error)
    throw error
  }
}

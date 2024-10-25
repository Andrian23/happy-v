"use server"

import { Prisma, Topic } from "@prisma/client"

import { auth } from "@/auth"
import { TopicData, topicSchema } from "@/schemas/topic"

import { db } from "../lib/db"

const topicWithAuthorAndRepliesCountQuery = {
  include: {
    author: {
      select: { name: true, lastName: true, type_proffesion: true, image: true },
    },
    _count: { select: { replies: true } },
  },
} satisfies Prisma.TopicDefaultArgs

export type TopicWithAuthor = Prisma.TopicGetPayload<typeof topicWithAuthorAndRepliesCountQuery>

export async function createTopic(topicData: TopicData): Promise<TopicWithAuthor> {
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
    return db.topic.create({ data: { ...topicData, authorId: userId }, ...topicWithAuthorAndRepliesCountQuery })
  } catch (error) {
    throw new Error((error as unknown as Error).message)
  }
}

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
    replies: {
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { name: true, lastName: true, type_proffesion: true, image: true },
        },
        likes: { select: { userId: true } },
        _count: { select: { likes: true } },
      },
    },
    likes: { select: { userId: true } },
    _count: { select: { replies: true, likes: true } },
  },
} satisfies Prisma.TopicDefaultArgs

export type TopicWithAuthorAndReplies = Prisma.TopicGetPayload<typeof topicWithAuthorAndReplies>

export async function getTopicById(id: string): Promise<TopicWithAuthorAndReplies | null> {
  try {
    return db.topic.findUnique({ where: { id }, ...topicWithAuthorAndReplies })
  } catch (error) {
    throw new Error((error as unknown as Error).message)
  }
}

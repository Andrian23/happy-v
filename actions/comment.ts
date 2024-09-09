"use server"

import { Comment } from "@prisma/client"

import { db } from "../lib/db" // Імпортуємо db з db.ts

export async function getCommentsByTopicId(topicId: string): Promise<Comment[]> {
  try {
    const comments = await db.comment.findMany({
      where: {
        topicId: topicId,
      },
    })
    return comments
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw error
  }
}

export async function getChildCommentsByParentId(parentId: string): Promise<Comment[]> {
  try {
    const childComments = await db.comment.findMany({
      where: {
        parentId: parentId,
      },
    })
    return childComments
  } catch (error) {
    console.error("Error fetching child comments:", error)
    throw error
  }
}

export async function countChildCommentsByParentId(parentId: string): Promise<number> {
  try {
    const count = await db.comment.count({
      where: {
        parentId: parentId,
      },
    })
    return count
  } catch (error) {
    console.error("Error counting child comments:", error)
    throw error
  }
}

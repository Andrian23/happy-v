"use server"

import { Comment, Topic } from "@prisma/client"

import { db } from "../lib/db" // Імпортуємо db з db.ts

/**
 * Створює нову тему в базі даних.
 *
 * @param {TopicInput} topicData - дані для створення теми.
 * @returns {Promise<Topic>} - повертає об'єкт створеної теми.
 */
export async function createTopic(topicData: Topic): Promise<Topic> {
  try {
    const topic = await db.topic.create({
      data: {
        ...topicData,
      },
    })
    return topic
  } catch (error) {
    console.error("Failed to create topic:", error)
    throw error
  }
}

/**
 * Отримує всі теми з бази даних.
 *
 * @returns {Promise<Topic[]>} - повертає масив об'єктів тем.
 */
export async function getAllTopics(): Promise<Topic[]> {
  try {
    const topics = await db.topic.findMany()
    return topics
  } catch (error) {
    console.error("Failed to retrieve topics:", error)
    throw error
  }
}

/**
 * Отримує тему за ID з бази даних.
 *
 * @param {string} id - ID теми, яку потрібно отримати.
 * @returns {Promise<Topic | null>} - повертає об'єкт теми або null, якщо тему не знайдено.
 */
export async function getTopicById(id: string): Promise<Topic | null> {
  try {
    const topic = await db.topic.findUnique({
      where: {
        id: id,
      },
    })
    return topic
  } catch (error) {
    console.error("Failed to retrieve topic:", error)
    throw error
  }
}

/**
 * Отримує всі теми з selected == 'ask'.
 *
 * @returns {Promise<Topic[]>} - повертає масив тем.
 */
export async function getTopicsByAsk(): Promise<Topic[]> {
  try {
    const topics = await db.topic.findMany({
      where: {
        selected: "ask",
      },
    })
    return topics
  } catch (error) {
    console.error("Failed to retrieve ask topics:", error)
    throw error
  }
}

/**
 * Отримує всі теми з selected == 'suggestion'.
 *
 * @returns {Promise<Topic[]>} - повертає масив тем.
 */
export async function getTopicsBySuggestion(): Promise<Topic[]> {
  try {
    const topics = await db.topic.findMany({
      where: {
        selected: "suggestion",
      },
    })
    return topics
  } catch (error) {
    console.error("Failed to retrieve suggestion topics:", error)
    throw error
  }
}

/**
 * Повертає загальну кількість тем у базі даних.
 *
 * @returns {Promise<number>} - повертає кількість тем.
 */
export async function countTopics(): Promise<number> {
  try {
    const count = await db.topic.count()
    return count
  } catch (error) {
    console.error("Failed to count topics:", error)
    throw error
  }
}

/**
 * Повертає кількість тем з selected == 'ask' у базі даних.
 *
 * @returns {Promise<number>} - повертає кількість тем.
 */
export async function countAskTopics(): Promise<number> {
  try {
    const count = await db.topic.count({
      where: {
        selected: "ask",
      },
    })
    return count
  } catch (error) {
    console.error("Failed to count ask topics:", error)
    throw error
  }
}

/**
 * Повертає кількість тем з selected == 'suggestion' у базі даних.
 *
 * @returns {Promise<number>} - повертає кількість тем.
 */
export async function countSuggestionTopics(): Promise<number> {
  try {
    const count = await db.topic.count({
      where: {
        selected: "suggestion",
      },
    })
    return count
  } catch (error) {
    console.error("Failed to count suggestion topics:", error)
    throw error
  }
}

export async function getCommentsWithSubCommentsCount(
  topicId: string
): Promise<Array<Comment & { totalReplies?: number }>> {
  try {
    const comments = (await db.comment.findMany({
      where: { topicId: topicId },
      include: {
        _count: {
          select: { replies: true }, // Assuming 'replies' is a relation to sub-comments
        },
      },
    })) as Array<Comment & { _count: { replies: number } }> // Add type assertion here

    return comments.map(({ _count, ...comment }) => ({
      ...comment,
      totalReplies: _count?.replies ?? 0, // Ensure _count is optional and provide a default value
    }))
  } catch (error) {
    console.error("Error fetching comments with sub-comments count:", error)
    throw error
  }
}

/**
 * Повертає кількість тем, які мають вказаний parentId.
 *
 * @param {string} parentId - ID батьківської теми для пошуку схожих тем.
 * @returns {Promise<number>} - повертає кількість схожих тем.
 */
export async function countSimilarTopicsByParentId(parentId: string): Promise<number> {
  try {
    const count = await db.comment.count({
      where: {
        parentId: parentId,
      },
    })
    return count
  } catch (error) {
    console.error("Failed to count similar topics:", error)
    throw error
  }
}

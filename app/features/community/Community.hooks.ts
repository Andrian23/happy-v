"use client"

import React from "react"
import { useCallback, useMemo, useState } from "react"
import { useSession } from "next-auth/react"

import type { TopicType } from "@prisma/client"

import { toggleLike } from "@/actions/like"
import { createReply } from "@/actions/reply"
import { createTopic, type TopicWithAuthor, type TopicWithAuthorAndReplies } from "@/actions/topic"
import type { TopicData } from "@/schemas/topic"

import { getLikesUpdate } from "./Community.utils"

export const useTopicList = ({
  initialTopics,
  initialCount,
  topicType,
}: {
  initialTopics: TopicWithAuthor[]
  initialCount: number
  topicType?: TopicType
}) => {
  const [topics, setTopics] = useState<TopicWithAuthor[]>(initialTopics)
  const [count, setCount] = useState(initialCount)
  const [activeTab, setActiveTab] = useState("latest")
  const [searchTerm, setSearchTerm] = useState("")
  const { data: session } = useSession()

  const filteredTopics = useMemo(() => {
    const searchableTopics = topics.filter((topic) => topic.title.toLowerCase().includes(searchTerm.toLowerCase()))

    switch (activeTab) {
      case "top":
        return [...searchableTopics].sort((a, b) => b._count.replies - a._count.replies)
      case "my":
        return searchableTopics.filter((topic) => topic.authorId === session?.user?.id)
      default:
        return searchableTopics
    }
  }, [topics, activeTab, session, searchTerm])

  const tabs = useMemo(
    () => [
      { value: "latest", label: `Latest (${count})` },
      { value: "top", label: "Top" },
      { value: "my", label: "My posts" },
    ],
    [count]
  )

  const handleTopicCreate = useCallback(
    async (data: TopicData) => {
      const topic = await createTopic(data)

      if (topicType && topic.type !== topicType) return

      setTopics((prevTopics) => [topic, ...prevTopics])
      setCount((prevCount) => prevCount + 1)
    },
    [topicType]
  )

  return { handleTopicCreate, filteredTopics, tabs, activeTab, setActiveTab, setSearchTerm, searchTerm }
}

export const useLikes = (setTopic: React.Dispatch<React.SetStateAction<TopicWithAuthorAndReplies | null>>) => {
  const { data: session } = useSession()

  const handleLikeToggle = useCallback(
    async ({ topicId, replyId }: { topicId?: string; replyId?: string }) => {
      const userId = session?.user?.id

      if (!userId) return

      const value = await toggleLike(userId, { topicId, replyId })

      setTopic((prevTopic) => {
        if (!prevTopic) return null

        if (replyId) {
          return {
            ...prevTopic,
            replies: prevTopic.replies.map((reply) =>
              reply.id === replyId ? getLikesUpdate(reply, userId, value) : reply
            ),
          }
        }

        if (topicId) {
          return getLikesUpdate(prevTopic, userId, value)
        }

        return prevTopic
      })
    },
    [session, setTopic]
  )

  return { handleLikeToggle }
}

export const useReply = (
  topicId: string | undefined,
  setTopic: React.Dispatch<React.SetStateAction<TopicWithAuthorAndReplies | null>>
) => {
  const handleReply = useCallback(
    async (data: { content: string }) => {
      if (!topicId) return

      const reply = await createReply(topicId, data)

      setTopic((prevTopic) => {
        if (!prevTopic) return null

        return {
          ...prevTopic,
          replies: [...prevTopic.replies, reply],
          _count: { ...prevTopic._count, replies: prevTopic._count.replies + 1 },
        }
      })
    },
    [topicId, setTopic]
  )

  return { handleReply }
}

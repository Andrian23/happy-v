import { useCallback, useMemo, useState } from "react"
import { useSession } from "next-auth/react"

import type { TopicType } from "@prisma/client"

import { createTopic, TopicWithAuthor } from "@/actions/topic"
import { TopicData } from "@/schemas/topic"

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

import { useCallback } from "react"

import { createTopic } from "@/actions/topic"
import { TopicData } from "@/schemas/topic"

export const useTopicCreate = () => {
  const handleTopicCreate = useCallback(async (data: TopicData) => {
    await createTopic({ type: data.type, title: data.title, content: data.content })
  }, [])

  return handleTopicCreate
}

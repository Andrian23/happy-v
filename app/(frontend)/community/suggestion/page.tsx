import { TopicType } from "@prisma/client"

import { getTopics } from "@/actions/topic"
import { CommunitySuggestion } from "@/app/features/community/CommunitySuggestion"

export default async function CommunitySuggestionPage() {
  const { topics, count } = await getTopics({ type: TopicType.SUGGESTION })

  return <CommunitySuggestion topics={topics} count={count} />
}

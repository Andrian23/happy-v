import { TopicType } from "@prisma/client"

import { getTopics } from "@/actions/topic"
import { CommunityAsk } from "@/app/features/community/CommunityAsk"

export default async function CommunityAskPage() {
  const { topics, count } = await getTopics({ type: TopicType.ASK })

  return <CommunityAsk topics={topics} count={count} />
}

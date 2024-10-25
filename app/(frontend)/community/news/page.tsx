import { TopicType } from "@prisma/client"

import { getTopics } from "@/actions/topic"
import { CommunityNews } from "@/app/features/community/CommunityNews"

export default async function CommunityNewsPage() {
  const { topics, count } = await getTopics({ type: TopicType.NEWS })

  return <CommunityNews topics={topics} count={count} />
}

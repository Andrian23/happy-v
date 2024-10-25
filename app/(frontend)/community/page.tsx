import { getTopics } from "@/actions/topic"
import { Community } from "@/app/features/community/Community"

export default async function CommunityForumPage() {
  const { topics, count } = await getTopics()

  return <Community topics={topics} count={count} />
}

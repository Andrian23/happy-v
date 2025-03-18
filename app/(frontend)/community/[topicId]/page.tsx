import { getTopicById } from "@/actions/topic"
import { TopicDetails } from "@/app/features/community/TopicDetails"

export default async function TopicDetailsPage({ params }: { params: Promise<{ topicId: string }> }) {
  const topicId = (await params).topicId
  const topic = await getTopicById(topicId)

  return <TopicDetails topic={topic} />
}

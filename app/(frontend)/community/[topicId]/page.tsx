import { getTopicById } from "@/actions/topic"
import { TopicDetails } from "@/app/features/community/TopicDetails"

type Props = {
  params: { topicId: string }
}

export default async function TopicDetailsPage({ params }: Props) {
  const topic = await getTopicById(params.topicId)

  return <TopicDetails topic={topic} />
}

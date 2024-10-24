import { ReplyWithAuthor } from "@/actions/reply"
import type { TopicWithAuthorAndReplies } from "@/actions/topic"

export function getLikesUpdate<T extends TopicWithAuthorAndReplies | ReplyWithAuthor>(
  topic: T,
  userId: string,
  value: boolean
) {
  return {
    ...topic,
    likes: value ? [...topic.likes, { userId }] : topic.likes.filter((like) => like.userId !== userId),
    _count: { ...topic._count, likes: value ? topic._count.likes + 1 : topic._count.likes - 1 },
  }
}

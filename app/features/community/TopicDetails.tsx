"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft } from "lucide-react"

import { TopicWithAuthorAndReplies } from "@/actions/topic"
import { AuthorHeading } from "@/components/community/AuthorHeading"
import { TopicContent } from "@/components/community/TopicContent"
import { ReplyForm } from "@/components/forms/ReplyForm"
import PageTopic from "@/components/PageTopic"
import { Chat } from "@/icons/Chat"

import { useLikes, useReply } from "./Community.hooks"

type TopicDetailsProps = {
  topic: TopicWithAuthorAndReplies | null
}

export const TopicDetails: React.FC<TopicDetailsProps> = ({ topic: initialTopic }) => {
  const [topic, setTopic] = useState<TopicWithAuthorAndReplies | null>(initialTopic)
  const { data: session } = useSession()
  const { handleLikeToggle } = useLikes(setTopic)
  const { handleReply } = useReply(topic?.id, setTopic)

  return (
    <div className="my-2.5 w-full lg:px-4">
      <PageTopic>
        <Link href="/community" className="flex items-center gap-2 text-sm text-grey-800">
          <ArrowLeft className="h-5 w-5" />
          Back to community forum
        </Link>
      </PageTopic>

      <div className="max-w-2xl">
        {topic && (
          <>
            <div className="mt-3">
              <h2 className="text-2xl font-bold text-primary-900">{topic.title}</h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-grey-800">
                <Chat />
                {topic._count.replies} replies • {formatDistanceToNow(topic.createdAt, { addSuffix: true })}
              </div>
            </div>

            <AuthorHeading author={topic.author} className="mt-8" />
            <TopicContent
              content={topic.content}
              onLike={() => handleLikeToggle({ topicId: topic.id })}
              likes={topic._count.likes}
              isLiked={topic.likes.some((like) => like.userId === session?.user?.id)}
            />
          </>
        )}

        {topic?.replies && topic.replies.length > 0 && (
          <div className="mt-3">
            <h3 className="text-xl font-bold text-primary-900">{topic.replies.length} Replies</h3>

            <ul>
              {topic?.replies.map((reply) => (
                <li key={reply.id}>
                  <AuthorHeading author={reply.author} createdAt={reply.createdAt} className="mt-3" />
                  <TopicContent
                    content={reply.content}
                    onLike={() => handleLikeToggle({ replyId: reply.id })}
                    likes={reply._count.likes}
                    isLiked={reply.likes.some((like) => like.userId === session?.user?.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <ReplyForm onSubmit={handleReply} />
      </div>
    </div>
  )
}

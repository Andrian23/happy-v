import React, { useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"

import { countSimilarTopicsByParentId } from "@/actions/topic"
import { findUserById } from "@/actions/user"
import { highlightText } from "@/lib/highlightText"
import { Topic } from "@/models/topic"
import { User } from "@/models/user"
import askMiniIcon from "@/public/AskMini.svg"
import replyIcon from "@/public/CommunityReply.svg"
import suggestionMiniIcon from "@/public/SuggestionMini.svg"

interface TopicCardProps {
  topic: Topic
  searchTerm?: string
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, searchTerm = "" }) => {
  const [userDetails, setUserDetails] = useState<User | null>()
  const [replyCount, setReplyCount] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchReplyCount = async () => {
      setIsLoading(true)
      try {
        const count = await countSimilarTopicsByParentId(topic.id)
        setReplyCount(count)
      } catch (error) {
        console.error("Error fetching reply count:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReplyCount()
  }, [topic])

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await findUserById()
        setUserDetails(userData)
      } catch (error) {
        console.error("Failed to fetch user details", error)
      }
    }

    if (topic.userId) {
      fetchUserDetails()
    }
  }, [topic])

  const isSuggestion = topic.selected === "suggestion"

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-grey-200 p-4 lg:flex-row lg:justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-start gap-2.5">
          <div className="h-10 w-10 rounded-full bg-slate-500"></div>
          <div className="flex flex-col gap-0.5">
            <div className="text-sm font-semibold text-primary-900">
              {userDetails
                ? `${userDetails.name} ${userDetails.lastName} · ${userDetails.type_proffesion}`
                : "Loading..."}
            </div>
            <div className="flex items-center justify-start gap-1">
              <Image
                src={isSuggestion ? suggestionMiniIcon : askMiniIcon}
                alt={isSuggestion ? "suggestion icon" : "ask icon"}
                className="h-4 w-4"
              />
              <div className="text-xs font-medium text-grey-800">
                {isSuggestion ? "Suggestion Box" : "Ask the Community"}
              </div>
            </div>
          </div>
        </div>
        <div className="text-base font-bold text-primary-900">{highlightText(topic.title, searchTerm)}</div>
      </div>
      <div className="flex items-center justify-start gap-1 text-sm text-grey-800">
        <Image src={replyIcon} alt="reply icon" className="h-5 w-5" />
        {isLoading ? "Loading..." : `${replyCount} replies • ${format(new Date(topic.createdAt), "PPP")}`}
      </div>
    </div>
  )
}

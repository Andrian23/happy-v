import React from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

import { TopicType } from "@prisma/client"

import type { TopicWithAuthor } from "@/actions/topic"
import { Ask } from "@/icons/Ask"
import { Chat } from "@/icons/Chat"
import { News } from "@/icons/News"
import { Telegram } from "@/icons/Telegram"
import { highlightText } from "@/lib/highlightText"

interface TopicCardProps {
  topic: TopicWithAuthor
  searchTerm?: string
}

const topicTypeGroup = {
  [TopicType.ASK]: { icon: <Ask className="h-4 w-4" />, label: "Ask the Community" },
  [TopicType.NEWS]: { icon: <News className="h-4 w-4" />, label: "News from Happy V" },
  [TopicType.SUGGESTION]: { icon: <Telegram className="h-4 w-4" />, label: "Suggestion Box" },
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, searchTerm = "" }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-grey-200 p-4 lg:flex-row lg:justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-start gap-2.5">
          <div className="relative h-10 w-10 rounded-full bg-grey-400">
            {topic.author.image && (
              <Image src={topic.author.image} alt="Profile image" fill className="object-contain" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-sm font-semibold text-primary-900">
              {`${topic.author.name} ${topic.author.lastName} · ${topic.author.type_proffesion}`}
            </div>
            <div className="flex items-center justify-start gap-1 text-grey-800">
              {topicTypeGroup[topic.type].icon}
              <div className="text-xs font-medium">{topicTypeGroup[topic.type].label}</div>
            </div>
          </div>
        </div>
        <div className="text-base font-bold text-primary-900">{highlightText(topic.title, searchTerm)}</div>
      </div>
      <div className="flex items-center justify-start gap-1 text-sm text-grey-800">
        <Chat className="h-5 w-5" />
        {topic._count.replies} replies • {formatDistanceToNow(topic.createdAt, { addSuffix: true })}
      </div>
    </div>
  )
}

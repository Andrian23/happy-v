import React from "react"
import Link from "next/link"

import type { TopicWithAuthor } from "@/actions/topic"

import { TopicCard } from "./TopicCard"

type TopicListProps = {
  topics: TopicWithAuthor[]
}

export const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  return (
    <ul className="mt-5 grid gap-4">
      {topics.map((topic) => (
        <li key={topic.id}>
          <Link href={`/community/${topic.id}`}>
            <TopicCard topic={topic} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

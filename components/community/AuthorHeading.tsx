import React from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

import { TopicWithAuthorAndReplies } from "@/actions/topic"
import { cn } from "@/lib/utils"

type AuthorHeadingProps = {
  author: TopicWithAuthorAndReplies["author"]
  createdAt?: Date
  className?: string
}

export const AuthorHeading: React.FC<AuthorHeadingProps> = ({ author, createdAt, className }) => {
  if (!author) return null

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-grey-400">
        {author.image && <Image src={author.image} alt="Profile image" className="object-contain" />}
      </div>
      <p className="text-sm font-semibold text-primary-900">
        {author.name} {author.lastName} • {author.type_proffesion}
      </p>
      {createdAt && (
        <span className="ml-auto text-xs font-medium text-primary-800">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </span>
      )}
    </div>
  )
}

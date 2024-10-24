import React from "react"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"

type ContentProps = {
  content: string
  onLike: () => void
  likes: number
  isLiked: boolean
}

export const TopicContent: React.FC<ContentProps> = ({ content, onLike, likes, isLiked }) => {
  return (
    <div className="mt-2 border-grey-400 text-primary-900 max-lg:border-b max-lg:pb-5 lg:ml-5 lg:mt-2.5 lg:border-l-2 lg:pl-7">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <div className="mt-3 flex items-center justify-end gap-1">
        <Heart
          onClick={onLike}
          className={cn("h-5 w-5 cursor-pointer text-primary-800", isLiked && "fill-primary-500 text-primary-500")}
        />
        <span className="text-sm font-semibold text-primary-800">{likes}</span>
      </div>
    </div>
  )
}

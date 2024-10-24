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
    <div className="ml-5 mt-2.5 border-l-2 border-grey-400 pl-7 text-primary-900">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <div className="mt-3 flex items-center justify-end gap-1">
        <Heart
          onClick={onLike}
          className={cn("h-5 w-5 cursor-pointer text-primary-500", isLiked && "fill-primary-500")}
        />
        <span className="text-sm font-semibold text-primary-800">{likes}</span>
      </div>
    </div>
  )
}

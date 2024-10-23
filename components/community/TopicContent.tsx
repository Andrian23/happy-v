import React from "react"
import { Heart } from "lucide-react"

type ContentProps = {
  content: string
}

export const TopicContent: React.FC<ContentProps> = ({ content }) => (
  <div className="ml-5 mt-2.5 border-l-2 border-grey-400 pl-7 text-primary-900">
    <div dangerouslySetInnerHTML={{ __html: content }} />
    <div className="mt-3 flex justify-end gap-1">
      {/* TODO: add like handler and counter */}
      <Heart onClick={() => {}} className="cursor-pointer text-primary-500" />
      <span className="text-primary-800">0</span>
    </div>
  </div>
)

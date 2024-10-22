"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Heart } from "lucide-react"

import { TopicWithAuthorAndReplies } from "@/actions/topic"
import { TextEditor } from "@/components/TextEditor"
import { Chat } from "@/icons/Chat"
import cartIcon from "@/public/Cart.svg"

type TopicDetailsProps = {
  topic: TopicWithAuthorAndReplies | null
}

export const TopicDetails: React.FC<TopicDetailsProps> = ({ topic }) => {
  return (
    <div className="my-2.5 w-full lg:px-4">
      <div className="flex h-auto w-full items-center justify-between">
        <Link href="/community">
          <div className="flex items-center justify-start">
            <ArrowLeft width={20} height={20} color="#7F85A4" />
            <div className="ml-2 text-sm text-[#7F85A4]">Back to community forum</div>
          </div>
        </Link>

        <div className="relative block h-12 w-8 max-md:hidden">
          <Link href="/cart">
            <Image src={cartIcon} alt="Cart" className="absolute right-[5px] top-[5px] h-[25px] w-[25px]" />
            <div className="absolute right-0 top-0 z-[2] h-[14px] w-[14px] rounded-full bg-primary-500"></div>
            <div className="absolute right-px top-px z-[3] rounded-full px-[3px] text-[10px] text-white">{3}</div>
          </Link>
        </div>
      </div>

      {topic && (
        <div className="mt-4">
          <div className="mt-1">
            <div className="text-2xl font-semibold text-primary-900">{topic.title}</div>
            <div className="mt-1 flex items-center justify-start">
              <Chat className="text-grey-800" />
              <div className="ml-2 text-sm text-grey-800">
                {topic._count.replies} replies • {format(new Date(topic.createdAt), "PPP")}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-start">
                <div className="relative h-10 w-10 rounded-full bg-grey-400">
                  {topic.author.image && (
                    <Image src={topic.author.image} alt="Profile image" className="object-contain" />
                  )}
                </div>
                <div className="ml-2 text-sm font-medium text-primary-900">
                  <div className="text-sm text-primary-900">
                    {`${topic.author.name} ${topic.author.lastName} · ${topic.author.type_proffesion}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-start">
                <div className="p-auto my-2 mr-2 h-[15rem] w-[40px]">
                  <div className="m-auto h-[100%] w-[3px] border-l border-gray-400"></div>
                </div>
                <div className="w-[65%] text-sm text-primary-900 max-lg:w-full">
                  <div dangerouslySetInnerHTML={{ __html: topic.content }} />
                  <div className="mt-3 flex items-center justify-end">
                    <Heart onClick={() => {}} className="cursor-pointer text-primary-500" />
                    <div className="ml-2 text-primary-500">{0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 w-[70%] rounded-2xl bg-grey-200 p-4 max-lg:w-full">
        <div className="mb-[20px] text-2xl font-semibold text-primary-900">Reply</div>
        <TextEditor onChange={() => {}} />
        <div className="mt-4 flex items-center justify-end">
          <div className="cursor-pointer rounded-full bg-primary-500 px-4 py-2 text-sm text-white" onClick={() => {}}>
            Send
          </div>
        </div>
      </div>
    </div>
  )
}

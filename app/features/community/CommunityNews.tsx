"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import type { TopicWithAuthor } from "@/actions/topic"
import { TopicList } from "@/components/community/TopicList"
import { Tabs } from "@/components/Tabs"
import cartIcon from "@/public/Cart.svg"

type CommunityNewsProps = {
  topics: TopicWithAuthor[]
  count?: number
}

export const CommunityNews: React.FC<CommunityNewsProps> = ({ topics, count }) => {
  const [activeItem, setActiveItem] = useState(0)
  const tabs = useMemo(() => [`Latest (${count})`, "Top"], [count])

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
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
            <div className="absolute right-0 top-0 rounded-full bg-primary-500 px-[3px] py-[1px] text-xs text-white">
              {count}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-8 flex h-auto w-full items-center justify-center rounded-2xl bg-grey-200 px-8 py-12">
        <div className="">
          <div className="text-center text-3xl font-semibold text-primary-900">News from Happy V</div>
          <div className="mt-2 text-center text-sm text-grey-800">See latest news from Happy V</div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between max-lg:block">
        <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />
      </div>

      <TopicList topics={topics} />
    </div>
  )
}

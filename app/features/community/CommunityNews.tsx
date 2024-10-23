"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import type { TopicWithAuthor } from "@/actions/topic"
import { TopicList } from "@/components/community/TopicList"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/ui/Tabs"

import { useTopicList } from "./Community.hooks"

type CommunityNewsProps = {
  topics: TopicWithAuthor[]
  count?: number
}

export const CommunityNews: React.FC<CommunityNewsProps> = ({ topics: initialTopics, count: initialCount = 0 }) => {
  const { tabs: initTabs, activeTab, setActiveTab, filteredTopics } = useTopicList({ initialTopics, initialCount })
  const tabs = useMemo(() => initTabs.filter((tab) => tab.value !== "my"), [initTabs])

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
      <PageTopic>
        <Link href="/community" className="flex items-center gap-2 text-sm text-grey-800">
          <ArrowLeft className="h-5 w-5" />
          Back to community forum
        </Link>
      </PageTopic>
      <div className="mt-8 flex h-auto w-full items-center justify-center rounded-2xl bg-grey-200 px-8 py-12">
        <div className="">
          <div className="text-center text-3xl font-semibold text-primary-900">News from Happy V</div>
          <div className="mt-2 text-center text-sm text-grey-800">See latest news from Happy V</div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between max-lg:block">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <TopicList topics={filteredTopics} />
    </div>
  )
}

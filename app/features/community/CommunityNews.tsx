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

      <section className="mt-3 grid w-full gap-1.5 rounded-2xl bg-grey-200 px-4 py-6 lg:p-11">
        <h2 className="text-center text-2xl font-bold text-primary-900 lg:text-3xl">News from Happy V</h2>
        <p className="text-center text-sm font-medium text-primary-800">See latest news from Happy V</p>
      </section>

      <div className="mt-8 flex w-full flex-wrap items-center justify-between gap-3">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <TopicList topics={filteredTopics} />
    </div>
  )
}

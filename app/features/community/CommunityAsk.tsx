"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

import { TopicType } from "@prisma/client"

import type { TopicWithAuthor } from "@/actions/topic"
import { TopicList } from "@/components/community/TopicList"
import { TopicDialog } from "@/components/dialogs/TopicDialog"
import PageTopic from "@/components/PageTopic"
import { Button } from "@/components/ui/Button"
import { Tabs } from "@/components/ui/Tabs"

import { useTopicList } from "./Community.hooks"

type CommunityAskProps = {
  topics: TopicWithAuthor[]
  count?: number
}

export const CommunityAsk: React.FC<CommunityAskProps> = ({ topics: initialTopics, count: initialCount = 0 }) => {
  const { tabs, activeTab, setActiveTab, filteredTopics, handleTopicCreate } = useTopicList({
    initialTopics,
    initialCount,
    topicType: TopicType.ASK,
  })

  return (
    <div className="m-2.5 w-[98%] max-md:m-0">
      <PageTopic>
        <Link href="/community" className="text-grey-800 flex items-center gap-2 text-sm">
          <ArrowLeft className="h-5 w-5" />
          Back to community forum
        </Link>
      </PageTopic>

      <section className="bg-grey-200 mt-3 grid w-full gap-1.5 rounded-2xl px-4 py-6 lg:p-11">
        <h2 className="text-primary-900 text-center text-2xl font-bold lg:text-3xl">Ask the Community</h2>
        <p className="text-primary-800 text-center text-sm font-medium">Find answers and ask questions to colleagues</p>
      </section>

      <div className="mt-8 flex w-full flex-wrap items-center justify-between gap-3">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <TopicDialog onSubmit={handleTopicCreate}>
          <Button variant="primary" className="gap-2">
            <Plus className="h-5 w-5" />
            New topic
          </Button>
        </TopicDialog>
      </div>

      <TopicList topics={filteredTopics} />
    </div>
  )
}

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

type CommunitySuggestionProps = {
  topics: TopicWithAuthor[]
  count?: number
}

export const CommunitySuggestion: React.FC<CommunitySuggestionProps> = ({
  topics: initialTopics,
  count: initialCount = 0,
}) => {
  const { tabs, activeTab, setActiveTab, filteredTopics, handleTopicCreate } = useTopicList({
    initialTopics,
    initialCount,
    topicType: TopicType.SUGGESTION,
  })

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
      <PageTopic>
        <Link href="/community" className="flex items-center gap-2 text-sm text-grey-800">
          <ArrowLeft className="h-5 w-5" />
          Back to community forum
        </Link>
      </PageTopic>

      <section className="mt-3 grid w-full gap-1.5 rounded-2xl bg-grey-200 px-4 py-6 lg:p-11">
        <h2 className="text-center text-2xl font-bold text-primary-900 lg:text-3xl">Suggestion Box</h2>
        <p className="text-center text-sm font-medium text-primary-800">Suggest ideas on how to improve Happy V</p>
      </section>

      <div className="mt-8 flex w-full flex-wrap items-center justify-between gap-3">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <TopicDialog
          onSubmit={handleTopicCreate}
          defaultValues={{ type: TopicType.SUGGESTION, title: "", content: "" }}
        >
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

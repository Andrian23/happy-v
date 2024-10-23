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

      <div className="mt-8 flex h-auto w-full items-center justify-center rounded-2xl bg-grey-200 px-8 py-12">
        <div className="">
          <div className="text-center text-3xl font-semibold text-primary-900">Suggestion Box</div>
          <div className="mt-2 text-center text-sm text-grey-800">Suggest ideas on how to improve Happy V </div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between max-lg:block">
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

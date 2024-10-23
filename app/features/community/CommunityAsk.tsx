"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

import type { TopicWithAuthor } from "@/actions/topic"
import { TopicList } from "@/components/community/TopicList"
import { TopicDialog } from "@/components/dialogs/TopicDialog"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { Button } from "@/components/ui/Button"

import { useTopicCreate } from "./Community.hooks"

type CommunityAskProps = {
  topics: TopicWithAuthor[]
  count?: number
}

export const CommunityAsk: React.FC<CommunityAskProps> = ({ topics, count }) => {
  const [activeItem, setActiveItem] = useState(0)
  const createTopic = useTopicCreate()

  const tabs = useMemo(() => [`Latest (${count})`, "Top", "My posts"], [count])

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
      <PageTopic>
        <Link href="/community" className="flex items-center gap-2 text-sm text-grey-800">
          <ArrowLeft className="h-5 w-5" />
          Back to community forum
        </Link>
      </PageTopic>
      <div className="mt-8 flex h-auto w-full items-center justify-center rounded-2xl bg-grey-200 px-8 py-12">
        <div>
          <div className="text-center text-3xl font-semibold text-primary-900">Ask the Community</div>
          <div className="mt-2 text-center text-sm text-grey-800">Find answers and ask questions to colleagues</div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between max-lg:block">
        <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

        <TopicDialog onSubmit={createTopic}>
          <Button variant="primary" className="gap-2">
            <Plus className="h-5 w-5" />
            New topic
          </Button>
        </TopicDialog>
      </div>

      <TopicList topics={topics} />
    </div>
  )
}

"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

import { TopicWithAuthor } from "@/actions/topic"
import { TopicList } from "@/components/community/TopicList"
import { TopicDialog } from "@/components/dialogs/TopicDialog"
import PageTopic from "@/components/PageTopic"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs } from "@/components/ui/Tabs"
import com1Image from "@/public/Comment1.svg"
import com2Image from "@/public/Comment2.svg"
import communityFlyIcon from "@/public/CommunityFly.svg"
import communityNewsIcon from "@/public/CommunityNews.svg"
import communityQuestionIcon from "@/public/CommunityQuestion.svg"

import { useTopicList } from "./Community.hooks"

const links = [
  {
    href: "/community/ask",
    title: "Ask the Community",
    icon: communityQuestionIcon,
    alt: "Question",
    description: "Find answers and ask questions to colleagues",
  },
  {
    href: "/community/news",
    title: "News from Happy V",
    icon: communityNewsIcon,
    alt: "News",
    description: "See latest news from Happy V",
  },
  {
    href: "/community/suggestion",
    title: "Suggestion Box",
    icon: communityFlyIcon,
    alt: "Suggestion",
    description: "Suggest ideas on how to improve Happy V",
  },
]

type CommunityProps = {
  topics: TopicWithAuthor[]
  count?: number
}

export const Community: React.FC<CommunityProps> = ({ topics: initialTopics, count: initialCount = 0 }) => {
  const { searchTerm, setActiveTab, setSearchTerm, handleTopicCreate, filteredTopics, tabs, activeTab } = useTopicList({
    initialTopics,
    initialCount,
  })

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="Community forum" description="Connect with other Happy V Professionals" />

      <div className="relative mt-5 flex h-auto w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#A7CDED] to-[#DFF1FF] px-8 py-12">
        <div className="">
          <div className="text-primary-900 text-center text-3xl font-semibold">Welcome to Community</div>
          <div className="text-grey-800 mx-[35px] mt-2 mb-[20px] text-center text-sm">
            We&apos;re happy to have you here. If you need help, please search before you post
          </div>
          <Input
            icon={<Search className="text-grey-800 h-5 w-5" />}
            iconPosition="left"
            placeholder="Search for topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Image src={com1Image} alt="Comment1" className="absolute bottom-0 left-0 h-[190px] w-[135px]" />
        <Image src={com2Image} alt="Comment2" className="absolute right-0 bottom-0 h-[190px] w-[151px]" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-6">
        {links.map(({ href, icon, title, description, alt }) => (
          <Link
            key={href}
            href={href}
            className="bg-grey-200 flex w-full items-center gap-4 rounded-2xl px-4 py-5 lg:flex-col lg:p-8"
          >
            <Image src={icon} alt={alt} className="h-[50px] w-[50px]" />
            <div className="flex flex-col lg:text-center">
              <div className="text-primary-900 text-base font-semibold">{title}</div>
              <div className="text-grey-800 text-sm">{description}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex w-full flex-wrap items-center justify-between gap-3">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <TopicDialog onSubmit={handleTopicCreate}>
          <Button variant="primary" className="gap-2">
            <Plus className="h-5 w-5" />
            New topic
          </Button>
        </TopicDialog>
      </div>

      <TopicList topics={filteredTopics} searchTerm={searchTerm} />
    </div>
  )
}

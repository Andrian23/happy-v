"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"

import { TopicWithAuthor } from "@/actions/topic"
import { TopicList } from "@/components/community/TopicList"
import CustomSearchInput from "@/components/CustomSearchInput"
import { TopicDialog } from "@/components/dialogs/TopicDialog"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { Button } from "@/components/ui/Button"
import com1Image from "@/public/Comment1.svg"
import com2Image from "@/public/Comment2.svg"
import communityFlyIcon from "@/public/CommunityFly.svg"
import communityNewsIcon from "@/public/CommunityNews.svg"
import communityQuestionIcon from "@/public/CommunityQuestion.svg"

import { useTopicCreate } from "./Community.hooks"

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

export const Community: React.FC<CommunityProps> = ({ topics, count = 0 }) => {
  const [activeItem, setActiveItem] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const createTopic = useTopicCreate()

  const tabs = useMemo(() => [`Latest (${count})`, "Top", "My posts"], [count])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="Community forum" description="Connect with other Happy V Professionals" />

      <div className="relative mt-5 flex h-auto w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#A7CDED] to-[#DFF1FF] px-8 py-12">
        <div className="">
          <div className="text-center text-3xl font-semibold text-primary-900">Welcome to Community</div>
          <div className="mx-[35px] mb-[20px] mt-2 text-center text-sm text-grey-800">
            We&apos;re happy to have you here. If you need help, please search before you post
          </div>
          <CustomSearchInput value={searchTerm} placeholder="Search for topic..." onChange={handleSearchChange} />
        </div>
        <Image src={com1Image} alt="Comment1" className="absolute bottom-0 left-0 h-[190px] w-[135px]" />
        <Image src={com2Image} alt="Comment2" className="absolute bottom-0 right-0 h-[190px] w-[151px]" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-6">
        {links.map(({ href, icon, title, description, alt }) => (
          <Link
            key={href}
            href={href}
            className="flex w-full items-center gap-4 rounded-2xl bg-grey-200 px-4 py-5 lg:flex-col lg:p-8"
          >
            <Image src={icon} alt={alt} className="h-[50px] w-[50px]" />
            <div className="flex flex-col lg:text-center">
              <div className="text-base font-semibold text-primary-900">{title}</div>
              <div className="text-sm text-grey-800">{description}</div>
            </div>
          </Link>
        ))}
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

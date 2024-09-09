"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

import { countSuggestionTopics, getTopicsBySuggestion } from "@/actions/topic"
import { Tabs } from "@/components/Tabs"
import { TopicCard } from "@/components/TopicCard"
import TopicEditorModal from "@/components/TopicEditorModal"
import { Button } from "@/components/ui/Button"
import type { CartItem } from "@/interfaces/cart"
import type { Topic } from "@/models/topic"
import cartIcon from "@/public/Cart.svg"

const CommunitySuggestionPage = () => {
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [topicSuggestionCount, setTopicSuggestionCount] = useState(0)
  const [activeItem, setActiveItem] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const tabs = useMemo(() => [`Latest (${topicSuggestionCount})`, "Top", "My posts"], [topicSuggestionCount])

  useEffect(() => {
    const cartData = localStorage.getItem("cart")
    if (cartData) {
      const cartItems: CartItem[] = JSON.parse(cartData)

      const totalCount = cartItems.reduce((total, item) => total + item.count, 0)
      setTotalItemCount(totalCount)
    } else {
      setTotalItemCount(0)
    }
  }, [])

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopicsBySuggestion()
        setTopics(data)
      } catch (error) {
        console.error("Error fetching topics:", error)
      }
    }

    const fetchTopicSuggestionCount = async () => {
      try {
        const count = await countSuggestionTopics()
        setTopicSuggestionCount(count)
      } catch (error) {
        console.error("Error fetching topic count:", error)
      }
    }

    fetchTopics()
    fetchTopicSuggestionCount()
  }, [])

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
      {isModalOpen && <TopicEditorModal onClose={() => setIsModalOpen(false)} />}
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
              {totalItemCount}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-8 flex h-auto w-full items-center justify-center rounded-2xl bg-grey-200 px-8 py-12">
        <div className="">
          <div className="text-center text-3xl font-semibold text-primary-900">Suggestion Box</div>
          <div className="mt-2 text-center text-sm text-grey-800">Suggest ideas on how to improve Happy V </div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between max-lg:block">
        <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

        <Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-5 w-5" />
          New topic
        </Button>
      </div>
      {topics &&
        topics.map((topic) => (
          <div key={topic.id} className="mt-4 flex flex-col gap-4">
            <Link href={`/community/${topic.id}`}>
              <TopicCard topic={topic} />
            </Link>
          </div>
        ))}
    </div>
  )
}

export default CommunitySuggestionPage

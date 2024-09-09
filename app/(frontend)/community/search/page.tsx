"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BeatLoader } from "react-spinners"

import { countTopics, getAllTopics } from "@/actions/topic"
import CustomSearchInput from "@/components/CustomSearchInput"
import PageTopicSecond from "@/components/PageTopicSecond"
import { TopicCard } from "@/components/TopicCard"
import TopicEditorModal from "@/components/TopicEditorModal"
import type { Topic } from "@/models/topic"

const CommunitySearchPage = () => {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topicCount, setTopicCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState(initialQuery) // Initialize with query value

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true) // Встановлення стану завантаження перед запитом
      try {
        const data = await getAllTopics()
        setTopics(data)
      } catch (error) {
        console.error("Error fetching topics:", error)
      } finally {
        setIsLoading(false) // Скидання стану завантаження після завершення запиту
      }
    }

    const fetchTopicCount = async () => {
      try {
        const count = await countTopics()
        setTopicCount(count)
      } catch (error) {
        console.error("Error fetching topic count:", error)
      }
    }

    fetchTopics()
    fetchTopicCount()
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredTopics = topics.filter((topic) => topic.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
      {isModalOpen && <TopicEditorModal onClose={() => setIsModalOpen(false)} />}
      <PageTopicSecond name="Back to community forum" link="/community" enable={false} />

      <div className="mb-[32px] mt-[20px]">
        <div className="mb-[20px] text-[32px] font-semibold text-primary-900">Search results</div>
        <CustomSearchInput value={searchTerm} placeholder="Search for topic..." onChange={handleSearchChange} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex h-[25rem] w-full items-center justify-center">
            <BeatLoader />
          </div>
        ) : (
          filteredTopics.map((topic, index) => (
            <Link key={index} href={`/community/${topic.id}`}>
              <TopicCard topic={topic} searchTerm={searchTerm} />
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default CommunitySearchPage

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Heart } from "lucide-react"
import { BeatLoader } from "react-spinners"

import { HeartFilledIcon } from "@radix-ui/react-icons"

import { getCommentsByTopicId } from "@/actions/comment"
import { getTopicById } from "@/actions/topic"
import CommentTopicEditor from "@/components/CommentTopicEditor"
import CommunityPageUserDetails from "@/components/CommunityPageUserDetails"
import Tiptap from "@/components/TipTap"
import type { CartItem } from "@/interfaces/cart"
import type { Comment } from "@/models/comment"
import type { Topic } from "@/models/topic"
import cartIcon from "@/public/Cart.svg"
import communityReplyIcon from "@/public/CommunityReply.svg"

import "react-quill/dist/quill.snow.css"

const TopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [isLoadingTopic, setIsLoadingTopic] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [description, setDescription] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (topicId) {
      setIsLoadingTopic(true)
      getTopicById(topicId)
        .then((data) => {
          setTopic(data)
        })
        .catch((error) => console.error("Failed to fetch topic:", error))
        .finally(() => setIsLoadingTopic(false))
    }
  }, [topicId])

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

  const handleSendClick = async () => {
    const payload = {
      comment: description,
      topicId: topicId,
    }

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      // Optionally handle the response data
      const data = await response.json()
      console.log("Comment posted successfully:", data)
      window.location.reload()
    } catch (error) {
      console.error("Failed to post comment:", error)
    }
  }

  useEffect(() => {
    if (topicId) {
      setIsLoadingComments(true)
      getCommentsByTopicId(topicId)
        .then((data) => {
          setComments(data)
        })
        .catch((error) => {
          console.error("Failed to fetch comments:", error)
        })
        .finally(() => setIsLoadingComments(false))
    }
  }, [topicId])

  useEffect(() => {
    const likedTopics = JSON.parse(localStorage.getItem("likedTopics") || "[]")
    setIsLiked(likedTopics.includes(topicId))
  }, [topicId])

  const handleLikeClick = async () => {
    const likedTopics: string[] = JSON.parse(localStorage.getItem("likedTopics") || "[]")
    if (likedTopics.includes(topicId)) {
      const newLikedTopics = likedTopics.filter((id) => id !== topicId)
      localStorage.setItem("likedTopics", JSON.stringify(newLikedTopics))
      setIsLiked(false)

      const payload = {
        topicId: topicId,
      }

      try {
        const response = await fetch("/api/like_topic_dec", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        // Optionally handle the response data
        const data = await response.json()
        console.log("Comment liked successfully:", data)
      } catch (error) {
        console.error("Failed to like comment:", error)
      }
    } else {
      likedTopics.push(topicId)
      localStorage.setItem("likedTopics", JSON.stringify(likedTopics))
      setIsLiked(true)

      const payload = {
        topicId: topicId,
      }

      try {
        const response = await fetch("/api/like_topic_inc", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        // Optionally handle the response data
        const data = await response.json()
        console.log("Comment liked successfully:", data)
      } catch (error) {
        console.error("Failed to like comment:", error)
      }
    }
  }

  return (
    <div className="my-2.5 w-full lg:px-4">
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
            <div className="absolute right-0 top-0 z-[2] h-[14px] w-[14px] rounded-full bg-primary-500"></div>
            <div className="absolute right-px top-px z-[3] rounded-full px-[3px] text-[10px] text-white">
              {totalItemCount}
            </div>
          </Link>
        </div>
      </div>

      {isLoadingTopic ? (
        <div className="flex h-auto w-[70%] items-center justify-center">
          <BeatLoader />
        </div>
      ) : (
        topic && (
          <div className="mt-4">
            <div className="mt-1">
              <div className="text-2xl font-semibold text-primary-900">{topic.title}</div>
              <div className="mt-1 flex items-center justify-start">
                <Image src={communityReplyIcon} alt="Reply" className="h-[18px] w-[18px]" />
                <div className="ml-2 text-sm text-grey-800">
                  {comments.length} replies • {format(new Date(topic.createdAt), "PPP")}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-start">
                  <div className="h-[40px] w-[40px] rounded-full bg-yellow-400"></div>
                  <div className="ml-2 text-sm font-medium text-primary-900">
                    <CommunityPageUserDetails userId={topic.userId} />
                  </div>
                </div>
                <div className="flex items-center justify-start">
                  <div className="p-auto my-2 mr-2 h-[15rem] w-[40px]">
                    <div className="m-auto h-[100%] w-[3px] border-l border-gray-400"></div>
                  </div>
                  <div className="w-[65%] text-sm text-primary-900 max-lg:w-full">
                    <iframe
                      className="h-auto w-full" // Встановіть необхідні розміри
                      srcDoc={`<style>@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap'); body { font-family: 'Inter', sans-serif; }</style>${topic.description}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                    <div className="mt-3 flex items-center justify-end">
                      {isLiked ? (
                        <HeartFilledIcon
                          width={25}
                          height={25}
                          color="#6CB4DA"
                          onClick={handleLikeClick}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <Heart color="#6CB4DA" onClick={handleLikeClick} style={{ cursor: "pointer" }} />
                      )}
                      <div className="ml-2 text-primary-500">{isLiked ? topic.likes + 1 : topic.likes}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <div className="my-4 w-[70%] max-lg:w-full">
        <div className="text-xl font-semibold text-primary-900">{comments.length} Replies</div>

        {isLoadingComments ? (
          <div className="flex h-auto w-full items-center justify-center">
            <BeatLoader />
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="my-4">
              <div className="flex items-center justify-start">
                <div className="h-[40px] w-[40px] rounded-full bg-yellow-400"></div>
                <div className="flex w-full items-center justify-between">
                  <div className="ml-2 text-sm font-medium text-primary-900">
                    <CommunityPageUserDetails userId={comment.userId} />
                  </div>
                  <div className="text-xs text-grey-800">{format(new Date(comment.createdAt), "PPP")}</div>
                </div>
              </div>
              <div className="flex items-center justify-start">
                <div className="p-auto relative my-2 mr-2 h-[100px] w-[40px]">
                  <div className="w-0.75 absolute left-1/2 h-full -translate-x-1/2 bg-gray-400"></div>
                </div>
                <div className="w-[95%] text-sm text-primary-900">
                  <iframe
                    className="h-auto w-full"
                    srcDoc={`<style>@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap'); body { font-family: 'Inter', sans-serif; }</style>${comment.comment}`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <CommentTopicEditor likes={comment.likes} commentId={comment.id} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 w-[70%] rounded-2xl bg-grey-200 p-4 max-lg:w-full">
        <div className="mb-[20px] text-2xl font-semibold text-primary-900">Reply</div>
        <Tiptap onChange={setDescription} content={description} />
        <div className="mt-4 flex items-center justify-end">
          <div
            className="cursor-pointer rounded-full bg-primary-500 px-4 py-2 text-sm text-white"
            onClick={handleSendClick}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopicPage

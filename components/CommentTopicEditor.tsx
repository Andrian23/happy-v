"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronDown, ChevronUp, Heart } from "lucide-react"

import { HeartFilledIcon } from "@radix-ui/react-icons"

import { countChildCommentsByParentId, getChildCommentsByParentId } from "@/actions/comment"
import CommunityPageUserDetails from "@/components/CommunityPageUserDetails"
import Tiptap from "@/components/TipTap"
import type { Comment } from "@/models/comment"
import replyIcon from "@/public/Reply_community.svg"

interface CommentTopicEditorProps {
  likes: number
  commentId: string
}

const CommentTopicEditor: React.FC<CommentTopicEditorProps> = ({ likes, commentId }) => {
  const [description, setDescription] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [childCommentsCount, setChildCommentsCount] = useState(0)

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded)
  }

  // Define a placeholder function for handleSendClick if it's not implemented yet
  const handleSendClick = async () => {
    const payload = {
      comment: description,
      topicId: commentId, // Assuming `commentId` is the `topicId` for this context
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

      const data = await response.json()
      console.log("Comment posted successfully:", data)
    } catch (error) {
      console.error("Failed to post comment:", error)
    }

    window.location.reload()
  }

  useEffect(() => {
    const likedComments = JSON.parse(localStorage.getItem("likedComments") || "[]")
    setIsLiked(likedComments.includes(commentId))
  }, [commentId])

  const handleLikeClick = async () => {
    const likedComments = JSON.parse(localStorage.getItem("likedComments") || "[]")
    if (likedComments.includes(commentId)) {
      const newLikedComments = likedComments.filter((id: string) => id !== commentId)
      localStorage.setItem("likedComments", JSON.stringify(newLikedComments))
      setIsLiked(false)

      const payload = {
        commentId: commentId,
      }

      try {
        const response = await fetch("/api/like_comment_dec", {
          method: "PATCH",
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
        console.log("Comment liked successfully:", data)
      } catch (error) {
        console.error("Failed to like comment:", error)
      }
    } else {
      likedComments.push(commentId)
      localStorage.setItem("likedComments", JSON.stringify(likedComments))
      setIsLiked(true)

      const payload = {
        commentId: commentId,
      }

      try {
        const response = await fetch("/api/like_comment_inc", {
          method: "PATCH",
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
        console.log("Comment liked successfully:", data)
      } catch (error) {
        console.error("Failed to like comment:", error)
      }
    }

    setIsEditing(false)
  }

  const [childComments, setChildComments] = useState<Comment[]>([])

  useEffect(() => {
    const fetchChildComments = async () => {
      try {
        const comments = (await getChildCommentsByParentId(commentId)) as Comment[] // Cast to Comment[]
        setChildComments(comments)
        const count = await countChildCommentsByParentId(commentId)
        setChildCommentsCount(count)
      } catch (error) {
        console.error("Error fetching child comments:", error)
      }
    }

    fetchChildComments()
  }, [commentId])

  const [isEditing, setIsEditing] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true) // Встановлюємо isEditing в true, щоб показати редактор
  }

  return (
    <>
      <div className="mt-3 flex items-center justify-between">
        <div
          className="flex cursor-pointer justify-center rounded-full border border-grey-800 px-3 py-2"
          onClick={handleToggleClick}
        >
          <div className="text-sm text-grey-800">{childCommentsCount} Replies</div>
          {isExpanded ? (
            <ChevronDown color="#7C8E9E" width={20} height={20} />
          ) : (
            <ChevronUp color="#7C8E9E" width={20} height={20} />
          )}
        </div>
        <div className="flex items-center justify-end">
          {isLiked ? (
            <HeartFilledIcon
              width={20}
              height={20}
              color="#7C8E9E"
              onClick={handleLikeClick}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <Heart color="#7C8E9E" width={20} height={20} onClick={handleLikeClick} style={{ cursor: "pointer" }} />
          )}
          <div className="ml-2 text-grey-800">{isLiked ? likes + 1 : likes}</div>
          <div className="ml-2 flex cursor-pointer items-center justify-end" onClick={handleEditClick}>
            <Image src={replyIcon} alt="Reply" className="h-5 w-5" />
            <div className="ml-[4px] text-sm text-grey-800">Reply</div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 w-[100%] rounded-2xl bg-grey-200 p-4 max-lg:w-full">
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
      )}

      {isExpanded && (
        <>
          {childComments.map((comment) => (
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
                <div className="p-auto my-2 mr-2 h-auto w-[40px]">
                  <div className="m-auto h-full w-[3px] border-l border-gray-400"></div>
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
          ))}
        </>
      )}
    </>
  )
}

export default CommentTopicEditor

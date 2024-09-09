import React, { useState } from "react"
import Image from "next/image"
import axios, { type AxiosError } from "axios"
import { X } from "lucide-react"

import { Input } from "@/components/ui/Input"
import askIcon from "@/public/AskMini.svg"
import radioIcon from "@/public/Radio_button.svg"
import suggestionIcon from "@/public/SuggestionMini.svg"

import { Button } from "./ui/Button"
import Tiptap from "./TipTap"

import "react-quill/dist/quill.snow.css"

interface ModalProps {
  onClose: () => void
}

const TopicEditorModal: React.FC<ModalProps> = ({ onClose }) => {
  const [selected, setSelected] = useState<string>("")

  const handleSelect = (choice: string) => {
    setSelected(choice)
  }

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleCreateTopic = async () => {
    try {
      const payload = {
        title,
        description,
        selected,
      }
      console.log("Sending data:", payload)

      const response = await axios.post("/api/topic", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Topic created:", response.data)
      onClose()
    } catch (error) {
      console.error(
        "Error creating topic:",
        (error as AxiosError).response ? (error as AxiosError).response?.data : (error as AxiosError).message
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-1/2 rounded-2xl bg-white shadow-lg">
        <div className="">
          <div className="m-6 flex items-center justify-between">
            <div className="text-2xl font-semibold text-[#2D396D]">Create a New Topic</div>
            <X onClick={onClose} color="#25425D" />
          </div>
          <div className="border-b border-grey-400"></div>
          <div className="m-6">
            <div className="text-sm text-primary-900">Select the category</div>
            <div className="mt-2 flex items-center justify-between">
              <div
                className={`h-auto w-[49%] border p-4 ${selected === "ask" ? "border-primary-500" : "border-grey-400"} flex cursor-pointer items-center justify-between rounded-xl`}
                onClick={() => handleSelect("ask")}
              >
                <div className="flex items-center justify-start">
                  <Image src={askIcon} alt="ask" className="h-[18px] w-[18px]" />
                  <div className="ml-2 text-sm">Ask the Community</div>
                </div>
                <div className="">
                  {selected === "ask" ? (
                    <Image src={radioIcon} alt="Radio" className="h-[23px] w-[23px]" />
                  ) : (
                    <div className="h-[23px] w-[23px] rounded-full border border-[#ABB0C5]"></div>
                  )}
                </div>
              </div>
              <div
                className={`h-auto w-[49%] border p-4 ${selected === "suggestion" ? "border-primary-500" : "border-grey-400"} flex cursor-pointer items-center justify-between rounded-xl`}
                onClick={() => handleSelect("suggestion")}
              >
                <div className="flex items-center justify-start">
                  <Image src={suggestionIcon} alt="ask" className="h-[18px] w-[18px]" />
                  <div className="ml-2 text-sm">Suggestion Box</div>
                </div>
                <div className="">
                  {selected === "suggestion" ? (
                    <Image src={radioIcon} alt="Radio" className="h-[23px] w-[23px]" />
                  ) : (
                    <div className="h-[23px] w-[23px] rounded-full border border-[#ABB0C5]"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-primary-900">Title</div>
              <Input
                type="text"
                placeholder="Briefly describe the topic"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 rounded-[12px]"
              />
            </div>
            <div className="mt-4">
              <div className="text-sm text-primary-900">Description</div>
              <Tiptap onChange={setDescription} content={description} />
            </div>
            <Button variant="primary" className="ml-auto mt-5 flex" onClick={handleCreateTopic}>
              Create topic
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopicEditorModal

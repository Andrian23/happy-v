import React, { useRef, useState } from "react"
import { X } from "lucide-react"

import useOnClickOutside from "@/hooks/useOnClickOutside"

import { Button } from "../ui/Button"
import { Textarea } from "../ui/Textarea"

interface DeclineProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (declineReason: string) => Promise<void> | void
}

const DeclineProfileModal: React.FC<DeclineProfileModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(modalRef, onClose, isOpen)

  const [formData, setFormData] = useState<Omit<{ basicInfo: string }, "id" | "userId">>({
    basicInfo: "",
  })

  if (!isOpen) return null

  const handleConfirmDecline = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    await onConfirm(formData.basicInfo)
    onClose()
  }

  const handleBasicInfoChange = (value: string) => {
    setFormData(() => ({
      basicInfo: value,
    }))
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 h-screen overflow-auto bg-black/70">
      <div
        ref={modalRef}
        className="fixed inset-x-0 inset-y-0 z-20 m-auto h-fit w-160 rounded-2xl bg-white max-md:w-[calc(100vw-32px)]"
      >
        <div className="border-grey-400 flex w-full items-center justify-between border-b p-4 md:p-6">
          <div className="text-primary-900 text-2xl font-semibold">Decline reason</div>
          <Button onClick={handleClose} variant="ghost" size="smallIcon">
            <X className="text-primary-900" />
          </Button>
        </div>
        <div className="flex flex-col gap-3.5 px-4 py-5 md:p-6">
          <div className="grid w-full items-center">
            <label className="text-primary-900 mb-2.5 text-sm font-semibold" htmlFor="recommendation-details">
              Decline reason
            </label>
            <Textarea
              className="h-44"
              placeholder="Explanation text placed here"
              value={formData.basicInfo}
              id="decline-user-details"
              onChange={(e) => handleBasicInfoChange(e.target.value)}
            />
          </div>
          <div className="flex max-w-72 items-start gap-2 self-end">
            <button
              className="border-grey-400 text-primary-900 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[98px] border px-4 py-2 text-sm font-semibold"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex h-9 shrink-0 grow basis-0 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[45px] bg-[#ff3c3c] px-4 py-2 text-sm font-semibold text-white"
              onClick={handleConfirmDecline}
            >
              Decline Request & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeclineProfileModal

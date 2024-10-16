import React, { useRef } from "react"

import useOnClickOutside from "@/hooks/useOnClickOutside"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  message: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(modalRef, onClose, isOpen)

  if (!isOpen) return null

  const handleConfirmDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    await onConfirm()
    onClose()
  }

  return (
    <div className="fixed left-0 top-0 z-[55] h-screen w-screen bg-black/50">
      <div
        ref={modalRef}
        className="relative left-1/2 top-1/2 z-[1] inline-flex h-[15%] w-full max-w-[383px] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-5 rounded-xl border-b border-grey-400 bg-white p-6"
      >
        <p className="text-sm font-medium text-primary-900">{message}</p>
        <div className="flex items-start gap-2 self-stretch">
          <button
            className="flex h-9 shrink-0 grow basis-0 items-center justify-center gap-2 rounded-[98px] border border-grey-400 px-4 py-2 text-sm font-semibold text-primary-900"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex h-9 shrink-0 grow basis-0 flex-col items-center justify-center gap-2.5 rounded-[45px] bg-[#ff3c3c] px-4 py-2 text-sm font-semibold text-white"
            onClick={handleConfirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

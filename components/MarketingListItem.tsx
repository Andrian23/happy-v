import React, { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Checkbox } from "@/components/ui/Checkbox"
import imageIcon from "@/public/Image_Format.svg"
import pdfIcon from "@/public/PDF_Format.svg"

interface MarketingListItemProps {
  type: string
  setGlobalCount: React.Dispatch<React.SetStateAction<number>>
  onAssetSelect: (asset: string, isSelected: boolean) => void
}

const MarketingListItem: React.FC<MarketingListItemProps> = ({ type, setGlobalCount, onAssetSelect }) => {
  const [isChecked, setIsChecked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCheckedChange = () => {
    if (typeof window !== "undefined") {
      setIsChecked(!isChecked)
      setGlobalCount((prevCount) => {
        const newCount = isChecked ? prevCount - 1 : prevCount + 1
        localStorage.setItem("globalCount", newCount.toString())
        return newCount
      })
      onAssetSelect(imageSrc, !isChecked)
    }
  }

  const handleImageClick = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleDownloadClick = () => {
    const link = document.createElement("a")
    link.href = type === "pdf" ? ".././PDF_Format.svg" : ".././Image_Format.svg" // Path to the image
    link.download = type === "pdf" ? "PDF_Format.svg" : "Image_Format.svg" // Name of the downloaded file
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const imageSrc = type === "pdf" ? pdfIcon : imageIcon

  return (
    <>
      <div
        className={`my-4 h-auto w-full p-4 ${isChecked ? "border border-primary-500" : ""} flex items-center justify-between rounded-2xl bg-grey-200`}
      >
        <div className="flex items-center justify-start">
          <Checkbox id="MarketingList" onCheckedChange={handleCheckedChange} />
          <div className="ml-2" onClick={handleImageClick}>
            <Image src={imageSrc} alt="Marketing List" className="h-[55px] w-[82px]" />
          </div>
          <div className="ml-2 flex items-center">
            <Image src={imageSrc} alt="pdf" className="h-5 w-5" />
            <div className="ml-2">General one-pager</div>
          </div>
        </div>
        <div
          className="mt-2 flex h-auto w-auto cursor-pointer items-center justify-center rounded-full border border-grey-400 px-4 py-2 hover:opacity-60"
          onClick={handleDownloadClick}
        >
          <div className="text-sm">Download</div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70">
          <div className="mb-2 flex h-auto w-full items-center justify-between p-4">
            <div className="flex items-center">
              <Image src={imageSrc} alt="pdf" className="h-5 w-5" />
              <div className="ml-2 text-white">General one-pager</div>
            </div>
            <div className="flex items-center">
              <div
                className="mt-2 flex h-auto w-full cursor-pointer items-center justify-center rounded-full border border-grey-400 bg-grey-400 px-4 py-2"
                onClick={handleDownloadClick}
              >
                <div className="text-sm">Download</div>
              </div>
              <div className="ml-4">
                <X color="#fff" onClick={closeModal} className="cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="flex h-full w-full items-center justify-between rounded-lg p-4">
            <ChevronLeft color="#fff" width={50} height={50} className="cursor-pointer" />
            <Image src={imageSrc} alt="PDF Format" className="h-[200px] w-[300px]" />
            <ChevronRight color="#fff" width={50} height={50} className="cursor-pointer" />
          </div>
        </div>
      )}
    </>
  )
}

export default MarketingListItem

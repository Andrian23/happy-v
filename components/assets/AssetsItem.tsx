import React from "react"
import Image from "next/image"

import { Asset } from "@/app/features/assets/Assets"
import { Checkbox } from "@/components/ui/Checkbox"
import { downloadFile } from "@/lib/downloadFile"
import gifIcon from "@/public/GIF_Format.svg"
import imageIcon from "@/public/Image_Format.svg"
import pdfIcon from "@/public/PDF_Format.svg"
import videoIcon from "@/public/Video_Format.svg"

interface MarketingGridItemProps {
  type: "pdf" | "image" | "video" | "gif"
  asset: Asset
  setGlobalCount: React.Dispatch<React.SetStateAction<number>>
  onAssetSelect: (asset: Asset, isSelected: boolean) => void
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentAssetIndex: React.Dispatch<React.SetStateAction<number>>
  assetIndex: number
  isChecked: boolean
  view: "grid" | "list"
}

const AssetsItem: React.FC<MarketingGridItemProps> = ({
  type,
  asset,
  setGlobalCount,
  onAssetSelect,
  setIsModalOpen,
  setCurrentAssetIndex,
  assetIndex,
  isChecked,
  view,
}) => {
  const handleCheckedChange = () => {
    onAssetSelect(asset, !isChecked)
    setGlobalCount((prevCount) => (!isChecked ? prevCount + 1 : prevCount - 1))
  }

  const handleImageClick = () => {
    setCurrentAssetIndex(assetIndex)
    setIsModalOpen(true)
  }

  const iconMap = {
    gif: gifIcon,
    video: videoIcon,
    image: imageIcon,
    pdf: pdfIcon,
  }

  const imageSrc = iconMap[type] || null

  return view === "grid" ? (
    <div
      className={`flex h-full w-full flex-col justify-between gap-3.5 rounded-xl bg-grey-200 p-4 ${isChecked && "border border-primary-500"}`}
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-center" onClick={handleImageClick}>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src={asset.preview} alt="Assets Item" fill objectFit="cover" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <div className="relative h-5 w-5 min-w-5">
            <Image src={imageSrc} alt="Asset" fill />
          </div>
          <p className="truncate">{asset.file.split("/").pop()}</p>
          <Checkbox id="marketing" onCheckedChange={handleCheckedChange} checked={isChecked} />
        </div>
      </div>
      <div
        className="flex w-full cursor-pointer items-center justify-center rounded-full border border-grey-400 p-2 hover:opacity-60"
        onClick={() => downloadFile(asset.file)}
      >
        <div className="text-sm">Download</div>
      </div>
    </div>
  ) : (
    <div
      className={`my-4 h-auto w-full p-4 ${isChecked && "border border-primary-500"} flex items-center justify-between rounded-2xl bg-grey-200`}
    >
      <div className="flex items-center justify-start">
        <Checkbox id="MarketingList" onCheckedChange={handleCheckedChange} checked={isChecked} />
        <div className="ml-2" onClick={handleImageClick}>
          <div className="relative aspect-video w-20 overflow-hidden rounded-md">
            <Image src={asset.preview} alt="Assets Item" fill objectFit="cover" />
          </div>
        </div>
        <div className="ml-2 flex items-center">
          <div className="relative h-5 w-5">
            <Image src={imageSrc} alt="pdf" fill />
          </div>
          <div className="ml-2">{asset.file.split("/").pop()}</div>
        </div>
      </div>
      <div
        className="mt-2 flex h-auto w-auto cursor-pointer items-center justify-center rounded-full border border-grey-400 px-4 py-2 hover:opacity-60"
        onClick={() => downloadFile(asset.file)}
      >
        <div className="text-sm">Download</div>
      </div>
    </div>
  )
}

export default AssetsItem

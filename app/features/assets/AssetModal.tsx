import React, { FC, ReactElement } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Asset } from "./Assets"

interface AssetModalProps {
  isModalOpen: boolean
  currentAsset: Asset
  onClose: () => void
  onDownload: () => void
  onPrev: () => void
  onNext: () => void
}

type AssetType = "pdf" | "video" | "image" | "gif"

const renderImageContent = (file: string) => (
  <div className="relative aspect-6/12 max-h-[80vh] w-full md:aspect-video">
    <Image src={file} alt="Asset" fill objectFit="contain" />
  </div>
)

const assetRenderers: Record<AssetType, (file: string) => ReactElement> = {
  pdf: (file: string) => (
    <div className="h-full w-full">
      <iframe src={file} width="100%" height="100%" />
    </div>
  ),
  video: (file: string) => (
    <div className="relative aspect-video max-h-[80vh] w-full">
      <video controls className="h-full w-full">
        <source src={file} type="video/mp4" />
      </video>
    </div>
  ),
  image: renderImageContent,
  gif: renderImageContent,
}

const AssetModal: FC<AssetModalProps> = ({ isModalOpen, currentAsset, onClose, onDownload, onPrev, onNext }) => {
  if (!isModalOpen) return null

  const renderAssetContent = assetRenderers[currentAsset.type as AssetType] || assetRenderers.image

  return (
    <div className="fixed inset-0 z-50 flex max-h-screen flex-col bg-black/70">
      <div className="mb-2 flex w-full items-center justify-between gap-2 p-4">
        <div className="flex items-center">
          <div className="ml-2 text-white">{currentAsset.file.split("/").pop()}</div>
        </div>
        <div className="flex items-center">
          <div
            className="border-grey-400 bg-grey-400 flex w-full cursor-pointer items-center justify-center rounded-full border px-4 py-2"
            onClick={onDownload}
          >
            <div className="text-sm">Download</div>
          </div>
          <div className="ml-4">
            <X color="#fff" onClick={onClose} className="cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between rounded-lg p-4">
        <ChevronLeft color="#fff" width={50} height={50} className="cursor-pointer" onClick={onPrev} />
        {renderAssetContent(currentAsset.file)}
        <ChevronRight color="#fff" width={50} height={50} className="cursor-pointer" onClick={onNext} />
      </div>
    </div>
  )
}

export default AssetModal

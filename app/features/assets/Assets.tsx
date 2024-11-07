"use client"

import React, { FC, useMemo, useState } from "react"
import { X } from "lucide-react"

import AssetsItem from "@/components/assets/AssetsItem"
import SocialCalendar from "@/components/assets/SocialCalendar"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { type View, ViewSwitch } from "@/components/ViewSwitch"
import useDraggableScroll from "@/hooks/useDraggableScroll"
import { downloadFile } from "@/lib/downloadFile"
import { cn } from "@/lib/utils"

import AssetModal from "./AssetModal"
import FormatMenu from "./FormatMenu"

export interface Asset {
  preview: string
  file: string
  type: "pdf" | "image" | "video" | "gif"
}

interface MarketingProps {
  title: string
  description: string
  tabs: string[]
  assetsByTab: Record<string, Asset[]>
  isFormatMenuPresent?: boolean
}

const Assets: FC<MarketingProps> = ({ title, description, tabs, assetsByTab, isFormatMenuPresent = true }) => {
  const [view, setView] = useState<View>("grid")
  const [activeTab, setActiveTab] = useState(0)
  const [format, setFormat] = useState("Format")
  const [globalCount, setGlobalCount] = useState(0)
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0)
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { scrollRef, handleMouseDown } = useDraggableScroll()

  const filteredAssets = assetsByTab[tabs[activeTab]] || []

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleCountZero = () => {
    setGlobalCount(0)
    setSelectedAssets([])
  }

  const handleAssetSelection = (asset: Asset, isSelected: boolean) => {
    setSelectedAssets((prevSelectedAssets) => {
      if (isSelected) {
        return [...prevSelectedAssets, asset]
      } else {
        return prevSelectedAssets.filter((item) => item !== asset)
      }
    })
  }

  const handleDownloadAll = () => {
    selectedAssets.forEach((asset) => downloadFile(asset.file))
  }

  const handlePrevAsset = () => {
    if (currentAssetIndex > 0) {
      setCurrentAssetIndex(currentAssetIndex - 1)
    }
  }

  const handleNextAsset = () => {
    if (currentAssetIndex < filteredAssets.length - 1) {
      setCurrentAssetIndex(currentAssetIndex + 1)
    }
  }

  const showFiltrationMenu = useMemo(() => globalCount !== 0, [globalCount])
  const currentAsset = filteredAssets[currentAssetIndex]

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name={title} description={description} />
      <div className="mt-5 h-full w-full">
        {showFiltrationMenu && (
          <div className="my-2 flex h-auto w-full items-center justify-between rounded-full bg-grey-200 px-4 py-2 text-primary-900">
            <div className="flex items-center">
              <X className="mr-4 h-5 w-5 cursor-pointer" onClick={handleCountZero} />
              <div className="text-sm">Selected: {globalCount}</div>
            </div>
            <div
              className="h-auto w-auto cursor-pointer rounded-full border border-grey-400 px-4 py-2 text-sm"
              onClick={handleDownloadAll}
            >
              Download
            </div>
          </div>
        )}

        <div className="flex items-center justify-between max-lg:block">
          <div
            ref={scrollRef}
            style={{ scrollbarWidth: "none" }}
            className="hide-scrollbar cursor-grab overflow-x-auto whitespace-nowrap"
            onMouseDown={handleMouseDown}
          >
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="flex items-center max-lg:mt-2">
            {isFormatMenuPresent && <FormatMenu format={format} setFormat={setFormat} />}
            {tabs[activeTab] !== "Social media calendar" && (
              <div className="flex max-md:block">
                <ViewSwitch onChange={setView} state={view} />
              </div>
            )}
          </div>
        </div>

        {tabs[activeTab] === "Social media calendar" ? (
          <SocialCalendar />
        ) : (
          <div
            className={cn("mt-4", {
              "grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4": view === "grid",
            })}
          >
            {filteredAssets
              .filter(
                (asset) =>
                  format === "Format" ||
                  (format === "PDF" && asset.type === "pdf") ||
                  (format === "Image" && asset.type === "image")
              )
              .map((asset, index) => (
                <AssetsItem
                  key={asset.file}
                  type={asset.type}
                  asset={asset}
                  setGlobalCount={setGlobalCount}
                  setIsModalOpen={setIsModalOpen}
                  onAssetSelect={handleAssetSelection}
                  setCurrentAssetIndex={setCurrentAssetIndex}
                  assetIndex={index}
                  isChecked={selectedAssets.includes(asset)}
                  view={view}
                />
              ))}
          </div>
        )}

        <AssetModal
          isModalOpen={isModalOpen}
          currentAsset={currentAsset}
          onClose={closeModal}
          onDownload={() => downloadFile(currentAsset.file)}
          onPrev={handlePrevAsset}
          onNext={handleNextAsset}
        />
      </div>
    </div>
  )
}

export default Assets

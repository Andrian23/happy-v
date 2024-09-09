"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { BeatLoader } from "react-spinners"

import PageTopic from "@/components/PageTopic"
import SocialCalendar from "@/components/SocialCalendar"
import SocialGridItem from "@/components/SocialGridItem"
import SocialListItem from "@/components/SocialListItem"
import { Tabs } from "@/components/Tabs"
import { type View, ViewSwitch } from "@/components/ViewSwitch"
import { cn } from "@/lib/utils"

const tabs = ["Gifs", "Images", "Videos", "Social media calendar"]

const mediaTypes = ["gif", "image", "video"]

const SocialPage = () => {
  const [view, setView] = useState<View>("grid")
  const [activeItem, setActiveItem] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [globalCount, setGlobalCount] = useState(0)
  const [showFiltrationMenu, setShowFiltrationMenu] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCount = localStorage.getItem("globalCount")
      if (savedCount !== null) {
        setGlobalCount(parseInt(savedCount, 10))
      }
    }
  }, [])

  useEffect(() => {
    setShowFiltrationMenu(globalCount !== 0)
  }, [globalCount])

  const handleCountZero = () => {
    setGlobalCount(0)
    if (typeof window !== "undefined") {
      localStorage.setItem("globalCount", "0")
    }
  }

  const handleAssetSelection = (asset: string, isSelected: boolean) => {
    setSelectedAssets((prevSelectedAssets) => {
      if (isSelected) {
        return [...prevSelectedAssets, asset]
      } else {
        return prevSelectedAssets.filter((item) => item !== asset)
      }
    })
  }

  const handleDownloadAll = () => {
    selectedAssets.forEach((asset) => {
      const link = document.createElement("a")
      link.href = asset
      link.download = asset.split("/").pop() || "download"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="Social Media Assets" description="Get access to social media assets for share" />
      <div className="mt-5 h-full w-full">
        {showFiltrationMenu ? (
          <div className="my-2 flex h-auto w-full items-center justify-between rounded-full bg-grey-200 px-4 py-2 text-primary-900">
            <div className="flex items-center">
              <X width={20} height={20} className="mr-4" color="#25425D" onClick={handleCountZero} />
              <div className="text-sm">Selected: {globalCount}</div>
            </div>
            <div
              className="h-auto w-auto cursor-pointer rounded-full border border-grey-400 px-4 py-2 text-sm"
              onClick={handleDownloadAll}
            >
              Download
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

            {activeItem !== 3 && (
              <div className="flex items-center">
                <div className="flex max-md:block">
                  <ViewSwitch onChange={setView} state={view} />
                </div>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="mt-4 flex h-screen w-full items-center justify-center">
            <BeatLoader />
          </div>
        )}

        {!isLoading && (
          <div
            className={cn("mt-4 gap-8", {
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4": view === "grid" && activeItem !== 3,
            })}
          >
            {activeItem !== 3 ? (
              view === "grid" ? (
                <SocialGridItem
                  type={mediaTypes[activeItem]}
                  globalCount={globalCount}
                  setGlobalCount={setGlobalCount}
                  onAssetSelect={handleAssetSelection}
                />
              ) : (
                <SocialListItem
                  type={mediaTypes[activeItem]}
                  globalCount={globalCount}
                  setGlobalCount={setGlobalCount}
                  onAssetSelect={handleAssetSelection}
                />
              )
            ) : (
              <SocialCalendar />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialPage

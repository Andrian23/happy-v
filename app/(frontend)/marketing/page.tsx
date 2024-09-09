"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, X } from "lucide-react"
import { BeatLoader } from "react-spinners"

import MarketingGridItem from "@/components/MarketingGridItem"
import MarketingListItem from "@/components/MarketingListItem"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { Checkbox } from "@/components/ui/Checkbox"
import { Label } from "@/components/ui/Label"
import { type View, ViewSwitch } from "@/components/ViewSwitch"
import { cn } from "@/lib/utils"

const tabs = ["Product one-pagers", "Product brochures", "Publication list", "Studies"]

const mediaTypes = ["PDF", "Images"]

const MarketingPage = () => {
  const [view, setView] = useState<View>("grid")
  const [activeItem, setActiveItem] = useState(0)
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false)
  const [format, setFormat] = useState("Format")
  const [isLoading, setIsLoading] = useState(false)
  const [globalCount, setGlobalCount] = useState(0)
  const [pdfIndex, setPdfIndex] = useState(0)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const showFiltrationMenu = useMemo(() => globalCount !== 0, [globalCount])

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
      <PageTopic
        name="Marketing & Education Assets"
        description="Get access to essential marketing and education materials"
      />
      <div className="mt-5 h-full w-full">
        {showFiltrationMenu ? (
          <div className="my-2 flex h-auto w-full items-center justify-between rounded-full bg-grey-200 px-4 py-2 text-primary-900">
            <div className="flex items-center">
              <X className="mr-4 h-5 w-5" onClick={handleCountZero} />
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
          <div className="flex items-center justify-between max-lg:block">
            <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

            <div className="flex items-center max-lg:mt-2">
              <div
                className={`relative mx-4 h-full w-auto cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium text-primary-900 max-lg:mx-0 ${isFormatMenuOpen ? "border-primary-500 bg-primary-100" : ""} ${format !== "Format" ? "border-primary-500 bg-primary-100" : ""}`}
              >
                <div className="flex items-center gap-2" onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}>
                  {format !== "Format" && <Check className="h-5 w-5" />}
                  {format}
                  {format !== "Format" && <X className="h-5 w-5" onClick={() => setFormat("Format")} />}
                </div>
                {isFormatMenuOpen && (
                  <div className="absolute left-0 top-10 h-auto w-auto rounded-2xl bg-white p-3 shadow-sm">
                    <div className="font-medium text-primary-900">Format</div>
                    <div className="mt-2 flex items-center justify-between gap-6">
                      {mediaTypes.map((type) => (
                        <Label key={type} className="flex items-center gap-2 font-normal">
                          <Checkbox id="pdf" onCheckedChange={() => setFormat(type)} />
                          {type}
                        </Label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex max-md:block">
                <ViewSwitch onChange={setView} state={view} />
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex h-screen w-full items-center justify-center">
            <BeatLoader />
          </div>
        )}

        {!isLoading && (
          <div
            className={cn("mt-4", {
              "grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4": view === "grid",
            })}
          >
            {mediaTypes
              .filter((type) => format === "Format" || type === format)
              .map((item) =>
                view === "grid" ? (
                  <MarketingGridItem
                    key={item}
                    type={item.toLowerCase()}
                    items={[item.toLocaleLowerCase()]}
                    currentIndex={pdfIndex}
                    onNavigate={setPdfIndex}
                    setGlobalCount={setGlobalCount}
                    onAssetSelect={handleAssetSelection}
                  />
                ) : (
                  <MarketingListItem
                    key={item}
                    type={item.toLowerCase()}
                    setGlobalCount={setGlobalCount}
                    onAssetSelect={handleAssetSelection}
                  />
                )
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketingPage

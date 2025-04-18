import React, { useState } from "react"
import { ChartData } from "chart.js"

import { cn } from "@/lib/utils"

import { CardStatistics } from "./CardStatistics"
import { CardTabs } from "./CardTabs"
import { InfoTooltip } from "./InfoTooltip"

export interface ChartCardFormattedData {
  title: string
  tabs: string[]
  count: number
  prefix: string
  differenceFromPreviousPeriod: string
  differenceArrow: boolean
  tooltip: string
  data?: ChartData
}

interface ChartCardProps {
  title: string
  tabs?: string[]
  count: number
  prefix?: string
  children?: React.ReactNode
  className?: string
  differenceFromPreviousPeriod?: string
  differenceArrow?: boolean
  tooltip: string
}

export const ChartCard: React.FC<ChartCardProps> = ({
  className,
  children,
  title,
  tabs,
  count,
  prefix = "",
  differenceFromPreviousPeriod,
  differenceArrow,
  tooltip,
}) => {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <div className={cn("bg-grey-200 relative flex flex-col items-center rounded-2xl p-4 lg:p-6", className)}>
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full flex-col gap-0.5 lg:gap-1">
          <div className="flex items-start gap-2">
            <h5 className="text-primary-900 text-sm font-semibold">{title}</h5>
            <InfoTooltip text={tooltip} />
          </div>
          <div className="text-primary-900 text-xl font-bold lg:text-3xl lg:leading-10">
            {prefix}
            {formatNumber(count)}
          </div>
        </div>
      </div>

      <CardStatistics diffValue={differenceFromPreviousPeriod} differenceArrow={differenceArrow} />

      <CardTabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

      <div className="mt-4 flex w-full flex-col items-center">
        {children || (
          <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-white p-4 lg:px-6 lg:py-10">
            <div className="flex flex-col items-center gap-1">
              <p className="text-primary-900/60 text-sm font-medium">No historical data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const formatNumber = (value: number, decimalPlaces: number = 2): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value)
}

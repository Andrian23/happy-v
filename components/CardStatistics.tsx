import React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

interface ChartStatsProps {
  range?: string
  diffValue?: string
  previousPeriod?: string
  differenceArrow?: boolean
}

export const CardStatistics: React.FC<ChartStatsProps> = ({
  range,
  diffValue,
  previousPeriod,
  differenceArrow = false,
}) => {
  const isNegative = diffValue && parseInt(diffValue.split("%")[0]) < 0

  return (
    <div className="text-grey-500 flex w-full items-center justify-between text-sm font-medium">
      <div>from last {range || " 30 days"}</div>
      {diffValue && (
        <div className="flex flex-col items-start gap-0 lg:flex-row lg:items-center lg:gap-1">
          <div
            className={`flex items-center justify-between rounded-sm px-1 font-medium ${isNegative ? "bg-red/10 text-red" : "bg-status-green/10 text-status-green"}`}
          >
            {differenceArrow ? isNegative ? <ArrowDown size={14} /> : <ArrowUp size={14} /> : isNegative ? "" : "+"}
            {diffValue}
          </div>
          vs previous {previousPeriod || " 30 days"}
        </div>
      )}
    </div>
  )
}

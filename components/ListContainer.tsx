import React, { useState } from "react"
import Link from "next/link"

import { CardPaginationData } from "@/interfaces/pagination"
import { cn } from "@/lib/utils"

import { Button } from "./ui/Button"
import { CardPagination } from "./CardPagination"
import { CardStatistics } from "./CardStatistics"
import { CardTabs } from "./CardTabs"
import { InfoTooltip } from "./InfoTooltip"

interface ListContainerProps {
  title: string
  description: string
  href: string
  innerHref?: string
  linkLabel?: string
  buttonLabel?: string
  count?: number
  prefix?: string
  differenceFromPreviousPeriod?: string
  differenceArrow?: boolean
  tabs?: string[]
  tooltip: string
  pagination?: CardPaginationData
  children?: React.ReactNode
  className?: string
}

export const ListContainer: React.FC<ListContainerProps> = ({
  title,
  description,
  href,
  innerHref,
  linkLabel,
  buttonLabel,
  count,
  prefix,
  differenceFromPreviousPeriod,
  differenceArrow,
  tooltip,
  tabs,
  pagination,
  children,
  className,
}) => {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <div className={cn("bg-grey-200 text-primary-900 relative flex flex-col gap-2 rounded-2xl p-4 lg:p-6", className)}>
      <div className="flex w-full flex-col items-start gap-1 lg:flex-row lg:justify-between">
        <div className="flex w-full flex-col gap-0.5 lg:gap-1">
          <div className="flex items-start gap-2">
            <h5 className="text-primary-900 text-sm font-semibold">{title}</h5>
            <InfoTooltip text={tooltip} />
          </div>
          <div className="text-primary-900 text-xl font-bold lg:text-3xl lg:leading-10">
            {prefix}
            {count}
          </div>
        </div>
        {linkLabel && (
          <Link className="text-primary-500 hover:text-primary-600 text-sm font-semibold" href={href}>
            {linkLabel}
          </Link>
        )}
      </div>

      <CardStatistics diffValue={differenceFromPreviousPeriod} differenceArrow={differenceArrow} />

      <CardTabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

      <div className="border-b border-blue-200 pb-4 lg:pb-6"></div>

      <div className="flex h-full w-full flex-col items-center">
        {children || (
          <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl bg-white p-4 lg:mt-5 lg:px-6 lg:py-10">
            <div className="flex flex-col items-center gap-1">
              <p className="text-primary-900/60 text-sm font-medium">{description}</p>
            </div>
            {buttonLabel && (
              <Button asChild variant="primary" className="font-semibold">
                <Link href={innerHref ?? href}>{buttonLabel}</Link>
              </Button>
            )}
          </div>
        )}

        {children && <CardPagination pagination={pagination} onPageChange={() => {}} />}
      </div>
    </div>
  )
}

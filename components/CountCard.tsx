import React from "react"

import { cn } from "@/lib/utils"

interface CountCardProps {
  icon: React.ReactNode
  count: number
  title: string
  prefix?: string
  className?: string
}

export const CountCard: React.FC<CountCardProps> = ({ className, icon, title, count, prefix = "" }) => {
  return (
    <div className={cn("flex items-center gap-4 rounded-2xl bg-grey-200 p-4 lg:p-6", className)}>
      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-white p-1">{icon}</div>
      <div className="flex w-full flex-col gap-0.5 lg:gap-1">
        <h5 className="text-sm font-semibold text-primary-900">{title}</h5>
        <div className="text-xl font-bold text-primary-900 lg:text-3xl lg:leading-10">
          {prefix}
          {count}
        </div>
      </div>
    </div>
  )
}

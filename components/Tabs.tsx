import React from "react"

import { cn } from "@/lib/utils"

interface TabsProps {
  tabs: string[]
  activeTab: number
  onTabChange: (tab: number) => void
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, tabs, onTabChange }) => {
  return (
    <ul className="m-0 flex gap-1.5 p-0">
      {tabs.map((tab, index) => (
        <li
          key={index}
          className={cn(
            "cursor-pointer bg-grey-200 px-4 py-2 text-sm font-medium text-grey-800 first:rounded-l-xl last:rounded-r-xl",
            { "bg-primary-100 font-semibold text-primary-900": activeTab === index }
          )}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </li>
      ))}
    </ul>
  )
}

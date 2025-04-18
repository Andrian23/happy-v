import React from "react"

import { cn } from "@/lib/utils"

interface TabsProps {
  tabs?: string[]
  activeTab: number
  onTabChange: (tab: number) => void
}

export const CardTabs: React.FC<TabsProps> = ({ activeTab, tabs, onTabChange }) => {
  if (!tabs) return

  return (
    <ul className="m-0 mt-4 flex w-full p-0 xl:absolute xl:top-0 xl:right-0 xl:mr-5 xl:justify-end">
      {tabs.map((tab, index) => (
        <li
          key={index}
          className={cn(
            "bg-dark-grey text-primary-800 w-full cursor-pointer border border-blue-200 px-3 py-1.5 text-center text-sm font-medium text-nowrap first:rounded-l-lg last:rounded-r-lg xl:w-fit",
            { "text-primary-900 bg-white font-medium": activeTab === index }
          )}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </li>
      ))}
    </ul>
  )
}

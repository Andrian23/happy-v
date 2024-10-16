"use client"

import React from "react"

import { cn } from "@/lib/utils"

type Tab = {
  label: string
  value: string
}

type TabsProps = {
  tabs: Tab[]
  activeTab: string
  onChange: (value: string) => void
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <ul className="m-0 flex gap-1.5 p-0">
      {tabs.map(({ label, value }) => (
        <li
          key={value}
          className={cn(
            "cursor-pointer whitespace-nowrap bg-grey-200 px-4 py-2 text-sm font-medium text-grey-800 first:rounded-l-xl last:rounded-r-xl",
            { "bg-primary-100 font-semibold text-primary-900": activeTab === value }
          )}
          onClick={() => onChange(value)}
        >
          {label}
        </li>
      ))}
    </ul>
  )
}

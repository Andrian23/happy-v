import React from "react"

import { Grid } from "@/icons/Grid"
import { List } from "@/icons/List"
import { cn } from "@/lib/utils"

export type View = "grid" | "list"

interface SwitchLayoutProps {
  onChange: (state: View) => void
  state: View
  className?: string
}

const thumbs = [
  { id: "grid", icon: <Grid /> },
  { id: "list", icon: <List /> },
]

export const ViewSwitch: React.FC<SwitchLayoutProps> = ({ onChange, state, className }) => {
  return (
    <div className={cn("flex h-10 shrink-0 rounded-xl border border-grey-400 p-0.5", className)}>
      {thumbs.map(({ icon, id }) => (
        <button
          key={id}
          className={cn(
            "flex aspect-square shrink-0 grow items-center justify-center rounded-[10px] p-1 text-grey-400",
            { "bg-primary-100 text-primary-900": state === id }
          )}
          onClick={() => onChange(id as View)}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}

import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = "right", ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {icon && (
          <div
            className={cn("text-grey-500 absolute", {
              "right-3": iconPosition === "right",
              "left-3": iconPosition === "left",
            })}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "border-grey-400 text-primary-900 ring-ring-900 ring-offset-background placeholder:text-grey-800 read-only:bg-grey-100 disabled:border-grey-300 disabled:text-grey-600 flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
            { "pr-9": icon && iconPosition === "right" },
            { "pl-9": icon && iconPosition === "left" },
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }

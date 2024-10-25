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
            "flex h-10 w-full rounded-xl border border-grey-400 bg-white px-3 py-2 text-sm text-primary-900 ring-ring ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-grey-800 read-only:bg-grey-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:border-grey-300 disabled:text-grey-600",
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

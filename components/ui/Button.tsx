import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-6xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-white text-primary-900 border border-solid border-grey-400 hover:bg-grey-200",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "primary-outline": "border border-solid border-primary-500 text-primary-500 hover:bg-primary-100",
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        "destructive-outline": "border border-solid border-grey-400 text-error-500 hover:bg-destructive-100",
        "destructive-secondary": "bg-error-600/0 text-white hover:bg-error-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-2 rounded-xl",
        md: "h-9 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        smallIcon: "h-6 w-6",
        auto: "h-auto w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

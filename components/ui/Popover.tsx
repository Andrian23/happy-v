import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const popoverVariants = cva("z-50 rounded-lg transition-all", {
  variants: {
    variant: {
      default: "flex flex-col items-start gap-2.5 bg-white shadow-soft",
    },
    size: {
      default: "p-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & VariantProps<typeof popoverVariants>
>(({ className, align = "end", sideOffset = 4, variant, size, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverVariants({ variant, size }), className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
))

PopoverContent.displayName = PopoverPrimitive.Content.displayName

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }

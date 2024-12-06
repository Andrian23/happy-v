import React from "react"

import { cn } from "@/lib/utils"

interface IngredientsCardProps {
  className?: string
  servingSize?: string
  servingsNumber?: string
  howToUse?: string
  allergyWarning?: string
  storage?: string
}

export const IngredientsCard: React.FC<IngredientsCardProps> = ({
  className,
  servingSize,
  servingsNumber,
  howToUse,
  allergyWarning,
  storage,
}) => {
  return (
    <div className={cn("grid gap-5 rounded-2xl bg-grey-200 p-4 text-primary-900 lg:gap-6 lg:p-6", className)}>
      <div className="grid gap-1.5">
        <h5 className="text-base font-bold">Ingredient Amounts</h5>
        <div className="text-sm">{`Serving Size: ${servingSize}`}</div>
        <div className="text-sm">{`Servings Per Container: ${servingsNumber}`}</div>
      </div>

      <div className="grid gap-1.5">
        <div className="text-base font-semibold">How to Use</div>
        <div className="text-sm">{howToUse || "Usage instructions will be available soon."}</div>
      </div>

      <div className="grid gap-2">
        <h5 className="text-base font-bold">Warnings</h5>
        <div>
          <h6 className="text-sm font-bold">Allergy Warning</h6>
          <div className="text-sm">{allergyWarning || "Safety information will be available soon."}</div>
        </div>
      </div>

      <div className="grid gap-1.5">
        <h5 className="text-base font-bold">Storage</h5>
        <div className="text-sm">{storage || "Storage instructions will be available soon."}</div>
      </div>
    </div>
  )
}

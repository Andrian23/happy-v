import React from "react"

import { cn } from "@/lib/utils"

interface IngredientsCardProps {
  className?: string
  servingSize?: string
  servingsNumber?: string
}

export const IngredientsCard: React.FC<IngredientsCardProps> = ({ className, servingSize, servingsNumber }) => {
  return (
    <div className={cn("grid gap-5 rounded-2xl bg-grey-200 p-4 text-primary-900 lg:gap-6 lg:p-6", className)}>
      <div className="grid gap-1.5">
        <h5 className="text-base font-bold">Ingredient Amounts</h5>
        <div className="text-sm">{`Serving Size: ${servingSize}`}</div>
        <div className="text-sm">{`Servings Per Container: ${servingsNumber}`}</div>
      </div>

      <div className="grid gap-1.5">
        <div className="text-base font-semibold">How to Use</div>
        <div className="text-sm">
          For relief, take one (1) stick pack daily with 8-12 oz of room-temp water. Add ice after mixing for
          refreshment. Take after sex, when you feel the symptoms of a UTI coming on, when you feel dehydrated or when
          you are not feeling your best. For prevention, we recommend taking one (1) stick pack every other day.
        </div>
      </div>

      <div className="grid gap-2">
        <h5 className="text-base font-bold">Warnings</h5>
        <div>
          <h6 className="text-sm font-bold">Allergy Warning</h6>
          <div className="text-sm">
            This product is contraindicated in an individual with a history of hypersensitivity to any of its
            ingredients.
          </div>
        </div>
      </div>

      <div className="grid gap-1.5">
        <h5 className="text-base font-bold">Storage</h5>
        <div className="text-sm">Store in a cool, dry place.</div>
      </div>
    </div>
  )
}

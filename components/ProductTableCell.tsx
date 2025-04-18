import React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface ProductTableCellProps {
  title: string
  sku: string
  image?: string
  count?: string | number
  place?: number
  className?: string
  fullName?: string
  email?: string
  date?: string
  total?: string
  earnings?: string
}

export const ProductTableCell: React.FC<ProductTableCellProps> = ({
  className,
  image,
  title,
  sku,
  count,
  total,
  earnings,
}) => {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="flex items-center gap-4">
        {image && <Image src={image} alt="Product Image" width={52} height={52} />}
        <div className="text-primary-900 flex flex-col gap-1 text-sm">
          <div className="font-semibold">{title}</div>
          <div className="text-grey-800 font-normal">{sku}</div>
        </div>
      </div>
      <div className="mt-4 flex w-full justify-between">
        {count && (
          <div className="text-primary-900 flex flex-col text-sm">
            <h6 className="text-grey-800 text-xs uppercase">QTY</h6>
            <div className="font-medium">{count}</div>
          </div>
        )}
        {total && (
          <div className="text-primary-900 flex flex-col text-sm">
            <h6 className="text-grey-800 text-xs uppercase">Total</h6>
            <div className="font-medium">${total}</div>
          </div>
        )}
        {earnings && (
          <div className="text-primary-900 flex flex-col text-right text-sm">
            <h6 className="text-grey-800 text-xs uppercase">Earnings</h6>
            <div className="font-medium">${earnings}</div>
          </div>
        )}
      </div>
    </div>
  )
}

import React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface ProductTableCellProps {
  title: string
  sku: string
  image: string
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
  place,
  image,
  title,
  sku,
  count,
  fullName,
  email,
  date,
  total,
  earnings,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      {place && <div className="text-sm text-grey-800">{place} place</div>}
      <div className="flex items-center gap-4">
        <Image src={image} alt="Product Image" width={52} height={52} />
        <div className="flex flex-col gap-1 text-sm text-primary-900">
          <div className="font-semibold">{title}</div>
          <div className="font-normal text-grey-800">{sku}</div>
          {count && <div className="text-sm font-bold">{count} Orders</div>}
        </div>
      </div>
      {fullName && (
        <div className="mt-4 flex flex-col text-sm text-primary-900">
          <h6 className="text-xs uppercase text-grey-800">Client</h6>
          <div className="font-medium">{fullName}</div>
          <div className="font-normal text-grey-800">{email}</div>
        </div>
      )}
      <div className="mt-4 flex justify-between">
        {date && (
          <div className="flex flex-col text-sm text-primary-900">
            <h6 className="text-xs uppercase text-grey-800">Date</h6>
            <div className="font-medium">{date}</div>
          </div>
        )}
        {total && (
          <div className="flex flex-col text-sm text-primary-900">
            <h6 className="text-xs uppercase text-grey-800">Total</h6>
            <div className="font-medium">{total}</div>
          </div>
        )}
        {earnings && (
          <div className="flex flex-col text-right text-sm text-primary-900">
            <h6 className="text-xs uppercase text-grey-800">Earnings</h6>
            <div className="font-medium">{earnings}</div>
          </div>
        )}
      </div>
    </div>
  )
}

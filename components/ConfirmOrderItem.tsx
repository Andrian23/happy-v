"use client"

import React from "react"
import Image from "next/image"

import type { Product } from "@/models/product"

interface ConfirmOrderItemProps {
  product: Product
}

const ConfirmOrderItem: React.FC<ConfirmOrderItemProps> = ({ product }) => {
  return (
    <div
      className={`flex h-auto w-full items-center justify-between border-b border-grey-400 px-[20px] py-[16px] text-xs uppercase ${product.amount === 0 ? "hidden" : ""}`}
    >
      <div className="flex w-[40%] items-center justify-start">
        <Image src={product.image.src} alt="Order" width={50} height={50} />
        <div className="ml-2 text-[14px] font-semibold text-primary-900">{product.title}</div>
      </div>
      <div className="w-[30%] text-start text-[14px] text-[#25425D]">{product.variants[0].sku}</div>
      <div className="w-[10%] text-start">
        <div className="text-[14px] text-[#25425D]">${product.variants[0].price}</div>
        <div className="text-[10px] text-[#7C8E9E]">${product.variants[0].price}</div>
      </div>
      <div className="w-[10%] text-end text-[14px] text-[#25425D]">{product.amount}</div>
      <div className="w-[10%] text-end text-[14px] font-semibold text-[#25425D]">
        ${(product.amount * Number(product.variants[0].price)).toFixed(2)}
      </div>
    </div>
  )
}

export default ConfirmOrderItem

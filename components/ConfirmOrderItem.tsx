"use client"

import React from "react"
import Image from "next/image"

import type { ShopifyProduct } from "@/models/product"

interface ConfirmOrderItemProps {
  data: {
    node: {
      title: string
      quantity: number
      product: ShopifyProduct
    }
  }
}

const ConfirmOrderItem: React.FC<ConfirmOrderItemProps> = ({ data }) => {
  return (
    <div
      className={`flex h-auto w-full items-center justify-between border-b border-grey-400 px-[20px] py-[16px] text-xs uppercase ${data.node.quantity === 0 ? "hidden" : ""}`}
    >
      <div className="flex w-[40%] items-center justify-start">
        {data.node.product.images.edges[0]?.node?.src && (
          <Image
            src={data.node.product.images.edges[0].node.src}
            alt={data.node.product.images.edges[0].node.altText ?? ""}
            width={50}
            height={50}
          />
        )}
        <div className="ml-2 text-[14px] font-semibold text-primary-900">{data.node.product.title}</div>
      </div>
      <div className="w-[30%] text-start text-[14px] text-[#25425D]">
        {data.node.product.variants.edges[0].node.sku}
      </div>
      <div className="w-[10%] text-start">
        <div className="text-[14px] text-[#25425D]">${data.node.product.variants.edges[0].node.price}</div>
        <div className="text-[10px] text-[#7C8E9E]">${data.node.product.variants.edges[0].node.price}</div>
      </div>
      <div className="w-[10%] text-end text-[14px] text-[#25425D]">{data.node.quantity}</div>
      <div className="w-[10%] text-end text-[14px] font-semibold text-[#25425D]">
        ${((data.node.quantity ?? 0) * Number(data.node.product.variants.edges[0].node.price)).toFixed(2)}
      </div>
    </div>
  )
}

export default ConfirmOrderItem

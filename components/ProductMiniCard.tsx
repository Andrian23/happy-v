"use client"

import React from "react"
import Image from "next/image"

import type { ShopifyProduct } from "@/models/product"

interface ProductMiniCardProps {
  product: ShopifyProduct
  count?: number
}

const ProductMiniCard: React.FC<ProductMiniCardProps> = ({ product, count }) => {
  return (
    <div
      className={`my-2 flex h-auto w-full items-center justify-between rounded-lg border border-[#d3dadf] p-[10px] ${count === 0 ? "hidden" : ""}`}
    >
      <div className="flex items-center">
        {product.images.edges[0]?.node?.src && (
          <Image
            src={product.images.edges[0].node.src}
            alt={product.images.edges[0].node.altText ?? ""}
            width={35}
            height={35}
          />
        )}
        <div className="ml-2">
          <div className="text-sm font-semibold text-primary-900">{product.title}</div>
          <div className="text-xs text-grey-800">Servings: 30</div>
        </div>
      </div>
      <div className="text-end">
        <div className="text-sm font-semibold text-primary-900">${product.variants.edges[0].node.price}</div>
        <div className="text-xs text-grey-800">{count} Unit</div>
      </div>
    </div>
  )
}

export default ProductMiniCard

import React, { useCallback } from "react"
import Image from "next/image"

import { Trash } from "@/icons/Trash"
import type { ShopifyProduct } from "@/models/product"
import { useCartStore } from "@/stores/cart"

import { ProductCounter } from "../ProductCounter"

type ProductCartItemProps = {
  product: ShopifyProduct & { amount: number }
}

export const ProductCartItem: React.FC<ProductCartItemProps> = ({ product }) => {
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const updateCount = useCartStore((state) => state.updateCount)

  const handleUpdateProductCount = useCallback(
    (count: number) => {
      updateCount(product.id, count)
    },
    [product.id, updateCount]
  )

  return (
    <div className="flex items-center rounded-2xl bg-white p-4 lg:py-5">
      <div className="flex items-center gap-4">
        <Image
          src={product.images.edges[0].node.src}
          alt={product.images.edges[0].node.altText ?? ""}
          width={52}
          height={52}
        />
        <div className="grid gap-0.5">
          <h6 className="text-sm font-semibold text-primary-900">{product.title}</h6>
          <p className="text-xs text-primary-800">Servings: {product.variants.edges[0].node.inventoryQuantity}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <p className="text-sm font-semibold text-primary-900">${product.variants.edges[0].node.price}</p>
        <ProductCounter onCountChange={handleUpdateProductCount} defaultCount={product.amount} />
        <Trash className="cursor-pointer text-primary-800" onClick={() => removeFromCart(product.id)} />
      </div>
    </div>
  )
}

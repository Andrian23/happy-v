import React, { useState } from "react"
import Image from "next/image"

import { Trash } from "@/icons/Trash"
import type { Product } from "@/models/product"
import { useCartStore } from "@/stores/cart"

import { ProductCounter } from "../ProductCounter"

type ProductCartItemProps = {
  product: Product & { amount: number }
}

export const ProductCartItem: React.FC<ProductCartItemProps> = ({ product }) => {
  const removeFromCart = useCartStore((state) => state.removeProduct)
  const [count, setCount] = useState(product.amount)

  return (
    <div className="flex items-center rounded-2xl bg-white p-4 lg:py-5">
      <div className="flex items-center gap-4">
        <Image src={product.image?.src} alt="ProductInCart" width={52} height={52} />
        <div className="grid gap-0.5">
          <h6 className="text-sm font-semibold text-primary-900">{product.title}</h6>
          <p className="text-xs text-primary-800">Servings: {product.variants[0].inventory_quantity}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <p className="text-sm font-semibold text-primary-900">${product.variants[0].price}</p>
        <ProductCounter onCountChange={setCount} defaultCount={count} />
        <Trash className="cursor-pointer text-primary-800" onClick={() => removeFromCart(product.id)} />
      </div>
    </div>
  )
}

"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import type { Product } from "@/models/product"
import deleteIcon from "@/public/Delete.svg"
import minusIcon from "@/public/MinusIcon.svg"
import plusIcon from "@/public/PlusIcon.svg"

interface ProductCardProps {
  product: Product
  count: number
  onCountChange: (productId: number, newCount: number) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, count: initialCount, onCountChange }) => {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    setCount(initialCount)
  }, [initialCount])

  const decreaseCount = () => {
    if (count > 1) {
      const newCount = count - 1
      setCount(newCount)
      onCountChange(product.id, newCount)
    }
  }

  const increaseCount = () => {
    const newCount = count + 1
    setCount(newCount)
    onCountChange(product.id, newCount)
  }

  const deleteProductFromCart = () => {
    setCount(0)
    onCountChange(product.id, 0)
  }

  return (
    <div
      className={`mt-4 flex h-20 w-full items-center justify-between rounded-2xl bg-white px-[16px] py-[20px] ${count === 0 ? "hidden" : ""}`}
    >
      <div className="flex items-center justify-between">
        <Image src={product.image?.src} alt="ProductInCart" width={52} height={52} />
        <div className="ml-2">
          <div className="text-sm font-semibold text-primary-900">{product.title}</div>
          <div className="text-[12px] font-medium text-grey-800">Servings: 30</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-primary-900">${product.variants[0].price}</div>
        <div className="counter mx-8 flex h-8 w-[100px] items-center justify-around rounded-2xl border border-grey-400">
          <div
            className="minus cursor-pointer text-sm"
            onClick={decreaseCount}
            style={{ opacity: count === 1 ? 0.1 : 1 }}
          >
            <Image src={minusIcon} alt="minus" className="h-3 w-3" />
          </div>
          <div className="count text-sm">{count}</div>
          <div className="plus cursor-pointer" onClick={increaseCount}>
            <Image src={plusIcon} alt="plus" className="h-3 w-3" />
          </div>
        </div>
        <div className="cursor-pointer" onClick={deleteProductFromCart}>
          <Image src={deleteIcon} alt="Delete" className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default ProductCard

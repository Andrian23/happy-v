import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useAddToCart } from "@/hooks/useAddToCart"
import { cn } from "@/lib/utils"
import type { Product } from "@/models/product"
import { useCartStore } from "@/stores/cart"

import { Button } from "./ui/Button"
import { ProductCounter } from "./ProductCounter"

interface ProductGridItemProps {
  product: Product
  quantity?: boolean
  onAddToCart?: (product: Product) => void
  isSelected?: boolean
  price?: number
  addLabel?: string
}

const ProductGridItem: React.FC<ProductGridItemProps> = ({
  product,
  quantity = true,
  onAddToCart,
  isSelected,
  addLabel = "Add to Cart",
}) => {
  const addProduct = useCartStore((state) => state.addProduct)
  const { count, setCount } = useAddToCart()
  const [isAdded, setIsAdded] = useState(isSelected)

  useEffect(() => {
    setIsAdded(isSelected)
  }, [isSelected])

  const handleClick = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
    setIsAdded(!isAdded)
  }

  if (!product.image || product.image.src === null) return null

  return (
    <div
      className={cn("grid h-full cursor-pointer rounded-2xl bg-grey-200 px-4 pb-4 pt-6", {
        "opacity-60": product.status !== "active",
      })}
    >
      <Link href={`/products/${product.id}`} className="relative mx-auto h-[116px] w-[116px]">
        <Image src={product.image.src} alt="" fill className="object-contain" sizes="116px" />
      </Link>

      <div className="mt-6 grid content-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h4 className="text-sm font-semibold text-primary-900">
              {product.title.length > 35 ? `${product.title.substring(0, 35)}...` : product.title}
            </h4>
          </Link>
          <p className="text-xs text-grey-800">Servings: {product.variants[0].inventory_quantity}</p>
          <p className="mt-4 text-xs text-grey-800 line-through">${product.variants[0].price}</p>
          <div className="flex items-center">
            <p className="text-lg font-semibold text-primary-900">${product.variants[0].price}</p>
            <p className="ml-1.5 text-xs text-grey-800">Wholesale</p>
          </div>
        </div>

        {product.status === "active" &&
          (quantity ? (
            <div className="mt-4 flex items-start justify-start gap-2">
              <ProductCounter onCountChange={setCount} />
              <Button size="md" variant="primary-outline" onClick={() => addProduct(product, count)}>
                Add to Cart
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex">
              <div
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center justify-around rounded-2xl border border-primary-500 px-4 py-2 text-sm text-primary-500",
                  isAdded && "rounded-[98px] border-[#ff3c3c] text-[#ff3c3c]"
                )}
                onClick={handleClick}
              >
                {isAdded ? "Remove" : addLabel}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ProductGridItem

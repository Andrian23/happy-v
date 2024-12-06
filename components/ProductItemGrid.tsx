import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useSupplementInfo } from "@/hooks/useSupplementInfo"
import { servingsNumber } from "@/lib/servingsNumber"
import { cn, extractShopifyProductId } from "@/lib/utils"
import type { ShopifyProduct } from "@/models/product"
import { useCartStore } from "@/stores/cart"

import { Button } from "./ui/Button"
import { ProductCounter } from "./ProductCounter"

interface ProductGridItemProps {
  product: ShopifyProduct
  quantity?: boolean
  onAddToCart?: (product: ShopifyProduct) => void
  isSelected?: boolean
  price?: number
  addLabel?: string
  isButtonPresent?: boolean
}

const ProductGridItem: React.FC<ProductGridItemProps> = ({
  product,
  quantity = true,
  onAddToCart,
  isSelected,
  addLabel = "Add to Cart",
  isButtonPresent = true,
}) => {
  const addProduct = useCartStore((state) => state.addProduct)
  const [count, setCount] = useState(0)
  const [isAdded, setIsAdded] = useState(isSelected)

  const { supplementInfo } = useSupplementInfo(product)

  const handleClick = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
    setIsAdded(!isAdded)
  }

  useEffect(() => {
    setIsAdded(isSelected)
  }, [isSelected])

  if (!product.images.edges[0]?.node?.src) return null

  return (
    <div
      className={cn("grid h-full cursor-pointer rounded-2xl bg-grey-200 px-4 pb-4 pt-6", {
        "opacity-60": product.status !== "ACTIVE",
      })}
    >
      <Link href={`/products/${extractShopifyProductId(product.id)}`} className="relative mx-auto h-[116px] w-[116px]">
        <Image
          src={product.images.edges[0].node.src}
          alt={product.images.edges[0].node.altText ?? ""}
          fill
          className="object-contain"
          sizes="116px"
        />
      </Link>

      <div className="mt-6 grid content-between">
        <div>
          <Link href={`/products/${extractShopifyProductId(product.id)}`}>
            <h4 className="text-sm font-semibold text-primary-900">
              {product.title.length > 35 ? `${product.title.substring(0, 35)}...` : product.title}
            </h4>
          </Link>
          <p className="text-xs text-grey-800">
            Servings:{" "}
            {servingsNumber(supplementInfo?.bottleSizeSecond) || servingsNumber(supplementInfo?.bottleSizeFirst)}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-grey-800">From:</p>
            <p className="text-lg font-semibold text-primary-900">
              ${parseFloat(product?.priceRange?.minVariantPrice.amount) / 100}
            </p>
          </div>
        </div>
        {product.status === "ACTIVE" &&
          isButtonPresent &&
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
                  isAdded && "rounded-[98px] border-error-500 text-error-500"
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

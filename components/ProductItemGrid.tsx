import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useAddToCart } from "@/hooks/useAddToCart"
import { cn } from "@/lib/utils"
import type { Product } from "@/models/product"

import { Button } from "./ui/Button"
import { ProductCounter } from "./ProductCounter"

interface ProductGridItemProps {
  product: Product
  quantity?: boolean
  onAddToCart?: (product: Product) => void
  isSelected?: boolean
  price?: number // Updated to make price a required prop
}

const ProductGridItem: React.FC<ProductGridItemProps> = ({
  product,
  quantity = true,
  onAddToCart,
  isSelected,
  price,
}) => {
  const { setCount, addToCart } = useAddToCart()
  const [isAdded, setIsAdded] = useState(isSelected)

  useEffect(() => {
    setIsAdded(isSelected) // Update internal state whenever the isSelected prop changes
  }, [isSelected])

  const handleClick = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
    setIsAdded(!isAdded) // Toggle on click
  }

  return (
    <>
      {product.image && product.image.src !== null && (
        <div
          className="grid-item grid h-full cursor-pointer grid-rows-[116px_auto] rounded-[20px] bg-grey-200 px-[20px] py-[24px]"
          key={product.id}
        >
          <div className="w-full">
            {product.status === "active" ? (
              <div className={cn("m-auto block w-1/2", quantity ? "h-fit" : "h-fit")}>
                {product.image && product.image.src && (
                  <Link href={`/products/${product.id}`}>
                    <Image src={product.image.src} alt="available" width={150} height={150} />
                  </Link>
                )}
              </div>
            ) : (
              <div className={cn("m-auto block w-1/2 opacity-50", quantity ? "h-[25vh]" : "h-[15vh]")}>
                {product.image && product.image.src && (
                  <Link href={`/products/${product.id}`}>
                    <Image src={product.image.src} alt="available" width={150} height={150} />
                  </Link>
                )}
              </div>
            )}
          </div>
          {product.status === "active" ? (
            <div className="grid-item-info mt-[48px] grid content-between">
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

              {quantity ? (
                <div className="mt-4 flex items-start justify-between gap-2">
                  <ProductCounter onCountChange={setCount} />
                  <Button size="md" variant="primary-outline" onClick={() => addToCart(product)}>
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
                    {isAdded ? "Remove" : "Add to Cart"}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid-item-info mt-[48px] opacity-50">
              <h4 className="text-sm font-semibold text-primary-900">
                {product.title.length > 35 ? `${product.title.substring(0, 35)}...` : product.title}
              </h4>
              <p className="text-xs text-grey-800">Servings: {product.variants[0].inventory_quantity}</p>
              <p className="mt-4 text-xs text-grey-800 line-through">${price} Retail</p>
              <div className="mt-1 flex items-center">
                <p className="text-[18px] font-semibold text-primary-900">${price}</p>
                <p className="ml-1 text-xs text-grey-800">Wholesale</p>
              </div>
              <div className="mt-2 flex">
                <div className="counter flex h-8 w-[100%] items-center justify-around"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ProductGridItem

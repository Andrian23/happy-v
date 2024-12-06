import React, { useCallback, useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { Trash } from "@/icons/Trash"
import { CartLineItem, Connection, useShopifyCartStore } from "@/stores/shopifyCart"

import { ProductCounter } from "../ProductCounter"

type ProductCartItemProps = {
  product: Connection<CartLineItem>["edges"][0]
}

const calculateUnitPrice = (totalAmount: string, quantity: number): number => {
  return parseFloat(totalAmount) / quantity
}

const formatPrice = (price: number | string): string => {
  return `$${Number(price).toFixed(2)}`
}

const getCompareAtPrice = (
  compareAtPrice: string | undefined,
  regularPrice: string,
  originalPrice: string
): string | null => {
  if (!compareAtPrice && !regularPrice) return null
  const priceToCompare = compareAtPrice || regularPrice

  return formatPrice(priceToCompare) !== formatPrice(originalPrice) ? formatPrice(priceToCompare) : null
}

export const ProductCartItem: React.FC<ProductCartItemProps> = ({ product }) => {
  const updateQuantity = useShopifyCartStore((state) => state.updateQuantity)
  const removeFromCart = useShopifyCartStore((state) => state.removeFromCart)
  const cartMetadata = useShopifyCartStore((state) => state.cartMetadata)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleUpdateProductCount = useCallback(
    async (count: number) => {
      setIsUpdating(true)
      try {
        await updateQuantity(product.node.id, count)
      } finally {
        setIsUpdating(false)
      }
    },
    [product.node.id, updateQuantity]
  )

  const handleRemoveItem = useCallback(async () => {
    setIsRemoving(true)
    try {
      await removeFromCart(product.node.id)
    } finally {
      setIsRemoving(false)
    }
  }, [product.node.id, removeFromCart])

  const { cost, quantity, merchandise } = product.node
  const originalPrice = cost?.amountPerQuantity.amount
  const unitPrice = calculateUnitPrice(cost?.totalAmount.amount, quantity)
  const pricesMatch = unitPrice.toFixed(2) === originalPrice

  const compareAtPrice = getCompareAtPrice(
    merchandise.compareAtPriceV2?.amount,
    merchandise.priceV2.amount,
    originalPrice
  )

  return (
    <div
      className={`flex items-center rounded-2xl bg-white p-4 transition-opacity lg:py-5 ${isRemoving ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-[52px] w-[52px]">
          <Image
            src={merchandise.image?.url}
            alt={merchandise.image?.altText ?? ""}
            width={52}
            height={52}
            className="rounded-md"
          />
        </div>
        <div className="grid gap-0.5">
          <h6 className="text-sm font-semibold text-primary-900">{merchandise.product.title}</h6>
          <p className="text-xs text-primary-800">Servings: {cartMetadata[merchandise.id]?.bottleSizeFirst}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex gap-2">
          {pricesMatch ? (
            <>
              {compareAtPrice && <p className="text-xs font-semibold text-grey-800 line-through">{compareAtPrice}</p>}
              <p className="text-sm font-semibold text-primary-900">{formatPrice(originalPrice)}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-grey-800 line-through">{formatPrice(originalPrice)}</p>
              <p className="text-sm font-semibold text-primary-900">{formatPrice(unitPrice)}</p>
            </>
          )}
        </div>

        <div className="relative">
          <ProductCounter onCountChange={handleUpdateProductCount} defaultCount={quantity} idDisabled={isUpdating} />
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <Loader2 className="h-4 w-4 animate-spin text-primary-800" />
            </div>
          )}
        </div>

        <button onClick={handleRemoveItem} disabled={isRemoving} className="relative">
          {isRemoving ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary-800" />
          ) : (
            <Trash className="cursor-pointer text-primary-800" />
          )}
        </button>
      </div>
    </div>
  )
}

import React, { useCallback } from "react"
import Image from "next/image"

import { Trash } from "@/icons/Trash"
import { CartLineItem, Connection, useShopifyCartStore } from "@/stores/shopifyCart"

import { ProductCounter } from "../ProductCounter"

type ProductCartItemProps = {
  product: Connection<CartLineItem>["edges"][0]
}

export const ProductCartItem: React.FC<ProductCartItemProps> = ({ product }) => {
  const updateQuantity = useShopifyCartStore((state) => state.updateQuantity)

  const { cartMetadata } = useShopifyCartStore()

  const { removeFromCart } = useShopifyCartStore((state) => state)

  const handleUpdateProductCount = useCallback(
    (count: number) => {
      updateQuantity(product.node.id, count)
    },
    [product.node.id, updateQuantity]
  )

  const calculateUnitPrice = (totalAmount: string, quantity: number): number => {
    return parseFloat(totalAmount) / quantity
  }

  const formatPrice = (price: number | string): string => {
    return `$${Number(price).toFixed(2)}`
  }

  const { cost, quantity } = product.node
  const originalPrice = cost?.amountPerQuantity.amount
  const unitPrice = calculateUnitPrice(cost?.totalAmount.amount, quantity)
  const pricesMatch = unitPrice.toFixed(2) === originalPrice

  const getCompareAtPrice = () => {
    const compareAtPrice = product.node.merchandise.compareAtPriceV2?.amount
    const regularPrice = product.node.merchandise.priceV2.amount

    if (!compareAtPrice && !regularPrice) return null
    const priceToCompare = compareAtPrice || regularPrice

    return formatPrice(priceToCompare) !== formatPrice(originalPrice) ? formatPrice(priceToCompare) : null
  }

  return (
    <div className="flex items-center rounded-2xl bg-white p-4 lg:py-5">
      <div className="flex items-center gap-4">
        <Image
          src={product.node.merchandise.image?.url}
          alt={product.node.merchandise.image?.altText ?? ""}
          width={52}
          height={52}
        />
        <div className="grid gap-0.5">
          <h6 className="text-sm font-semibold text-primary-900">{product.node.merchandise.product.title}</h6>
          <p className="text-xs text-primary-800">
            Servings: {cartMetadata[product.node.merchandise.id]?.bottleSizeFirst}
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex gap-2">
          {pricesMatch ? (
            <>
              {getCompareAtPrice() && (
                <p className="text-xs font-semibold text-grey-800 line-through">{getCompareAtPrice()}</p>
              )}
              <p className="text-sm font-semibold text-primary-900">{formatPrice(originalPrice)}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-grey-800 line-through">{formatPrice(originalPrice)}</p>
              <p className="text-sm font-semibold text-primary-900">{formatPrice(unitPrice)}</p>
            </>
          )}
        </div>
        <ProductCounter onCountChange={handleUpdateProductCount} defaultCount={product.node.quantity} />
        <Trash className="cursor-pointer text-primary-800" onClick={() => removeFromCart(product.node.id)} />
      </div>
    </div>
  )
}

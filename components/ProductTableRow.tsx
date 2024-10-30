import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { cn, extractShopifyProductId } from "@/lib/utils"
import type { ShopifyProduct } from "@/models/product"
import { useCartStore } from "@/stores/cart"

import { Button } from "./ui/Button"
import { TableCell } from "./ui/Table"
import { ProductCounter } from "./ProductCounter"

interface ProductTableRowProps {
  product: ShopifyProduct
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({ product }) => {
  const addProduct = useCartStore((state) => state.addProduct)
  const [count, setCount] = useState(0)

  if (!product.images.edges[0]?.node?.src) return null

  return (
    <>
      <TableCell className="px-4 py-5">
        <div className="flex items-center gap-4">
          <Link href={`/products/${extractShopifyProductId(product.id)}`} className="relative h-13 w-13 bg-grey-200">
            <Image
              src={product.images.edges[0].node.src}
              alt={product.images.edges[0].node.altText ?? ""}
              fill
              className="object-cover"
              sizes="52px"
            />
          </Link>
          <div className="grid gap-y-0.5">
            <Link href={`/products/${extractShopifyProductId(product.id)}`} className="text-sm font-semibold">
              {product.title.length > 35 ? `${product.title.substring(0, 35)}...` : product.title}
            </Link>
            <span className="text-xs text-grey-800">Servings: {product.variants.edges[0].node.inventoryQuantity}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-semibold text-grey-800">${product.variants.edges[0].node.price}</TableCell>
      <TableCell className="font-semibold">${product.variants.edges[0].node.price}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2 font-semibold">
          <span
            className={cn("block h-2 w-2 rounded-full", product.status === "ACTIVE" ? "bg-[#09BD30]" : "bg-error-500")}
          />
          {product.status === "ACTIVE" ? "Available" : "Not Available"}
        </div>
      </TableCell>
      <TableCell>
        {product.status === "ACTIVE" && (
          <div className="ml-auto flex justify-end gap-2">
            <ProductCounter onCountChange={setCount} />
            <Button size="md" variant="primary-outline" onClick={() => addProduct(product, count)}>
              Add to Cart
            </Button>
          </div>
        )}
      </TableCell>
    </>
  )
}

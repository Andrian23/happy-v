import React from "react"
import Image from "next/image"
import Link from "next/link"

import { useAddToCart } from "@/hooks/useAddToCart"
import { cn } from "@/lib/utils"
import type { Product } from "@/models/product"

import { Button } from "./ui/Button"
import { TableCell } from "./ui/Table"
import { ProductCounter } from "./ProductCounter"

interface ProductTableRowProps {
  product: Product
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({ product }) => {
  const { setCount, addToCart } = useAddToCart()

  return (
    <>
      <TableCell className="px-4 py-5">
        <div className="flex items-center gap-4">
          <Link href={`/products/${product.id}`} className="relative h-13 w-13 bg-grey-200">
            {product.image?.src && (
              <Image
                src={product.image?.src ?? ""}
                alt={product.name ?? ""}
                fill
                className="object-cover"
                sizes="52px"
              />
            )}
          </Link>
          <div className="grid gap-y-0.5">
            <Link href={`/products/${product.id}`} className="text-sm font-semibold">
              {product.title.length > 35 ? `${product.title.substring(0, 35)}...` : product.title}
            </Link>
            <span className="text-xs text-grey-800">Servings: {product.variants[0].inventory_quantity}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-semibold text-grey-800">${product.variants[0].price}</TableCell>
      <TableCell className="font-semibold">${product.variants[0].price}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2 font-semibold">
          <span
            className={cn("block h-2 w-2 rounded-full", product.status === "active" ? "bg-[#09BD30]" : "bg-[#FF3C3C]")}
          />
          {product.status === "active" ? "Available" : "Not Available"}
        </div>
      </TableCell>
      <TableCell>
        {product.status === "active" && (
          <div className="ml-auto flex justify-end gap-2">
            <ProductCounter onCountChange={setCount} />
            <Button size="md" variant="primary-outline" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </div>
        )}
      </TableCell>
    </>
  )
}

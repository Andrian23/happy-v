import React from "react"

import { useMediaQuery } from "@/hooks/useMediaQuery"
import type { ShopifyProduct } from "@/models/product"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"
import { ProductTableCell } from "./ProductTableCell"

interface ProductsTableProps {
  products: { product: ShopifyProduct; quantity: number }[]
  commissionRate?: number
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ products, commissionRate = 0 }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  if (!isDesktop) {
    return (
      <div className="w-full">
        {products.map(({ product, quantity }, index) => (
          <ProductTableCell
            key={product.id}
            title={product.title}
            sku={product.variants.edges[0].node.sku}
            count={quantity}
            image={product.images.edges[0]?.node?.src}
            place={index + 1}
            total={(parseFloat(product.variants.edges[0].node.price) * quantity).toFixed(2)}
            earnings={(parseFloat(product.variants.edges[0].node.price) * quantity * commissionRate).toFixed(2)}
            className="border-grey-400 border-b py-4"
          />
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-grey-800 text-xs font-semibold uppercase">
          <TableHead>Product</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Earnings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(({ product, quantity }) => (
          <TableRow key={product.id}>
            <TableCell className="w-full">
              <ProductTableCell
                title={product.title}
                sku={product.variants.edges[0]?.node?.sku}
                image={product.images.edges[0]?.node?.src}
              />
            </TableCell>
            <TableCell className="text-primary-900 min-w-28 text-sm font-bold">{quantity}</TableCell>
            <TableCell className="text-primary-900 min-w-28 text-sm font-medium">
              ${(parseFloat(product.variants.edges[0].node.price) * quantity).toFixed(2)}
            </TableCell>
            <TableCell className="text-primary-900 min-w-28 text-right text-sm font-bold">
              ${(parseFloat(product.variants.edges[0].node.price) * quantity * commissionRate).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

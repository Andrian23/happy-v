import React from "react"

import { useMediaQuery } from "@/hooks/useMediaQuery"
import type { ShopifyProduct } from "@/models/product"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"
import { ProductTableCell } from "./ProductTableCell"

interface OrdersTableProps {
  products: Array<ShopifyProduct & { amount?: number }>
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ products }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  if (!isDesktop) {
    return (
      <div>
        {products.map((product, index) => (
          <ProductTableCell
            key={product.id}
            title={product.title}
            sku={product.variants.edges[0].node.sku}
            count={product.amount}
            image={product.images.edges[0]?.node?.src}
            place={index + 1}
            className="border-b border-grey-400 py-4"
          />
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs font-semibold uppercase text-grey-800">
          <TableHead className="w-8">#</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Ordered</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <ProductTableCell
                title={product.title}
                sku={product.variants.edges[0].node.sku}
                image={product.images.edges[0]?.node?.src}
              />
            </TableCell>
            <TableCell className="text-right text-sm font-bold text-primary-900">{product.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

import React from "react"

import type { ShopifyProduct } from "@/models/product"

import ProductGridItem from "../ProductItemGrid"
import { ProductTableRow } from "../ProductTableRow"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/Table"
import type { View } from "../ViewSwitch"

interface ProductItemProps {
  view?: View
  products: ShopifyProduct[]
}

export const ProductsLayout: React.FC<ProductItemProps> = ({ products, view = "grid" }) => {
  if (view === "grid") {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <ProductGridItem key={product.id} product={product} isButtonPresent={false} />
        ))}
      </div>
    )
  }

  return (
    <Table className="text-primary-900 mt-6 border-separate border-spacing-0 overflow-hidden rounded-2xl border">
      <TableHeader className="bg-grey-200 text-grey-800 text-xs uppercase">
        <TableRow className="[&>th]:border-b">
          <TableHead className="px-5 py-3">Name</TableHead>
          <TableHead className="px-5 py-3">From</TableHead>
          <TableHead className="px-5 py-3">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="[&>td]:border-b last:[&>td]:border-0">
            <ProductTableRow product={product} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

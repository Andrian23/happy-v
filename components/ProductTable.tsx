import React from "react"

import type { Product } from "@/models/product"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/Table"
import ProductGridItem from "./ProductItemGrid"
import { ProductTableRow } from "./ProductTableRow"
import type { View } from "./ViewSwitch"

interface ProductItemProps {
  view?: View
  products: Product[]
}

export const ProductsLayout: React.FC<ProductItemProps> = ({ products, view = "grid" }) => {
  if (view === "grid") {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductGridItem key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <Table className="mt-6 border-separate border-spacing-0 overflow-hidden rounded-2xl border text-primary-900">
      <TableHeader className="bg-grey-200 text-xs uppercase text-grey-800">
        <TableRow className="[&>th]:border-b">
          <TableHead className="px-5 py-3">Name</TableHead>
          <TableHead className="px-5 py-3">Retail</TableHead>
          <TableHead className="px-5 py-3">Wholesale</TableHead>
          <TableHead className="px-5 py-3">Status</TableHead>
          <TableHead className="w-60">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="[&>td]:border-b [&>td]:last:border-0">
            <ProductTableRow product={product} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

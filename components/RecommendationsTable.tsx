import React from "react"

import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Recommendation } from "@/models/recommendation"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"
import { ProductTableCell } from "./ProductTableCell"

interface RecommendationsTableProps {
  recommendations: Recommendation[]
}

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({ recommendations }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  if (!isDesktop) {
    return (
      <div>
        {recommendations.map((recommendation) =>
          recommendation.selectedProducts.map((product) => (
            <ProductTableCell
              key={product.id}
              title={product.title}
              sku={product.variants.edges[0].node.sku}
              count={product.amount}
              image={product.images.edges[0]?.node?.src}
              fullName={`${recommendation.clients[0].firstName} ${recommendation.clients[0].lastName}`}
              email={recommendation.clients[0].email}
              date={new Date(recommendation.created).toLocaleDateString()}
              total={(parseFloat(product.variants.edges[0].node.price) * parseInt(product.amount)).toFixed(2)}
              earnings={(parseFloat(product.variants.edges[0].node.price) * parseInt(product.amount)).toFixed(2)}
              className="border-b border-grey-400 py-4"
            />
          ))
        )}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs font-semibold uppercase text-grey-800">
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Earnings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recommendations.map((recommendation) =>
          recommendation.selectedProducts.map((product) => (
            <TableRow key={recommendation.id}>
              <TableCell>
                <ProductTableCell
                  title={product.title}
                  sku={product.variants.edges[0].node.sku}
                  image={product.images.edges[0]?.node?.src}
                />
              </TableCell>
              <TableCell className="text-right text-sm font-medium text-primary-900">{product.amount}</TableCell>
              <TableCell className="text-sm font-bold text-primary-900">
                <div className="text-sm font-medium text-primary-900">
                  {recommendation.clients[0].firstName} {recommendation.clients[0].lastName}
                </div>
                <div className="text-sm font-normal text-grey-800">{recommendation.clients[0].email}</div>
              </TableCell>
              <TableCell className="text-sm font-medium text-primary-900">
                {new Date(recommendation.created).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm font-medium text-primary-900">
                ${(parseFloat(product.variants.edges[0].node.price) * parseInt(product.amount)).toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-sm font-bold text-primary-900">
                ${(parseFloat(product.variants.edges[0].node.price) * parseInt(product.amount)).toFixed(2)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

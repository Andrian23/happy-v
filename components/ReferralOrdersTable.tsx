import React from "react"

import { Order } from "@/models/order"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"

interface ReferralOrdersTableProps {
  orders: Order[]
  commissionRate?: number
}

export const ReferralOrdersTable: React.FC<ReferralOrdersTableProps> = ({ orders, commissionRate }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-blue-550 text-xs font-semibold uppercase">
          <TableHead className="max-lg:px-0">Order</TableHead>
          <TableHead className="max-lg:px-0">Date</TableHead>
          <TableHead className="max-lg:px-0">Total</TableHead>
          <TableHead className="text-right max-lg:px-0">Earnings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="text-primary-900 text-sm font-bold max-lg:px-0">{order.id}</TableCell>
            <TableCell className="text-sm font-medium text-blue-600 max-lg:px-0">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="text-sm font-medium text-blue-600 max-lg:px-0">${order.totalPrice}</TableCell>
            <TableCell className="text-primary-900 text-right text-sm font-bold max-lg:px-0">
              ${(order.totalPrice * (commissionRate || 0)).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

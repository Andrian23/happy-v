"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import AddressBlock from "@/components/AddressBlock"
import ConfirmOrderItem from "@/components/ConfirmOrderItem"
import SummaryItem from "@/components/SummaryItem"
import { Button } from "@/components/ui/Button"
import type { Order } from "@/models/order"
import { Product } from "@/models/product"
import type { ShippingAddress, ShippingMethod } from "@/models/shipping"
import cardIcon from "@/public/Card.svg"
import confirmedOrderImage from "@/public/Confirmed_Order.svg"

const headerRow = [
  { label: "Product name", width: "40%", align: "text-start" },
  { label: "SKU", width: "30%", align: "text-start" },
  { label: "Wholesale", width: "10%", align: "text-start" },
  { label: "Quantity", width: "10%", align: "text-end" },
  { label: "Total", width: "10%", align: "text-end" },
]

type ConfirmedProps = {
  order: Order | null
}

export const Confirmed: React.FC<ConfirmedProps> = ({ order }) => {
  const shippingMethod = JSON.parse(order?.shippingMethod as unknown as string) as ShippingMethod
  const shippingAddress = JSON.parse(order?.shippingAddress as unknown as string) as ShippingAddress
  const products = JSON.parse(order?.products as unknown as string) as Product[]
  const billingAddress = JSON.parse(order?.billingAddress as unknown as string) as ShippingAddress

  return (
    <div className="h-full w-full bg-grey-200">
      <div className="h-full w-full">
        <div className="h-auto w-full rounded-2xl bg-white py-8">
          <div className="flex items-center justify-center">
            <div>
              <div className="flex items-center justify-center">
                <Image src={confirmedOrderImage} className="h-[94px] w-[94px]" alt="Order Confirmed" />
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-[#09BD30] max-lg:text-xs">Order Confirmed</div>
                <div className="mb-2 text-[28px] font-semibold text-primary-900 max-lg:text-xl">
                  Order ID: {order?.id}
                </div>
                <div className="my-2 text-sm font-medium text-primary-900 max-lg:text-xs">
                  Thank you for you&apos;r order! Your order was placed successfully
                </div>
                <div className="my-2 text-sm font-medium text-grey-800 max-lg:text-xs">
                  Placed on: {order?.createdAt ? format(new Date(order.createdAt), "MMMM do, yyyy, h:mma") : ""}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button variant="secondary" className="mt-5" asChild>
                  <Link href="/orders">Back to wholesale orders</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 h-auto w-full rounded-2xl bg-white">
          <div className="flex h-auto w-full items-center justify-between border-b border-grey-400 px-5 py-4 text-xs uppercase text-grey-800">
            {headerRow.map(({ label, width, align }) => (
              <div key={label} className={`w-[${width}] ${align}`}>
                {label}
              </div>
            ))}
          </div>

          <>
            {products.map((product, index) => (
              <ConfirmOrderItem key={index} product={product} />
            ))}
          </>

          <div className="p-5">
            <div className="my-2 flex h-auto w-full items-start justify-between">
              <div className="text-mb font-semibold text-primary-900 max-lg:hidden">Order Summary</div>
              <div className="h-auto w-[35%] rounded-2xl bg-grey-200 p-3 max-lg:w-full">
                <SummaryItem label="Subtotal" value={`$${order?.totalPrice}`} isBold />
                <SummaryItem label={shippingMethod?.type} value={shippingMethod?.price} />
                <SummaryItem label="Taxes" value="$0.00" className="border-b border-dashed border-gray-400 pb-3 pt-3" />
                <SummaryItem label="Total" value={`$${order?.totalPrice}`} isBold />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {shippingAddress && <AddressBlock title="Shipping Address" address={shippingAddress} />}
            {billingAddress && <AddressBlock title="Billing Address" address={billingAddress} />}
            <div className="h-full rounded-2xl bg-white p-4 text-sm text-primary-900 max-lg:my-4 max-lg:w-full max-lg:text-xs">
              <div className="text-base font-semibold">Payment Method</div>
              <div className="h-full w-full">
                <div className="flex items-center">
                  <Image src={cardIcon} alt="Credit Card" className="h-5 w-5" />
                  <div className="my-2 ml-2 font-medium">Credit Card</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

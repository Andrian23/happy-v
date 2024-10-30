"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"

import type { CartItem } from "@/interfaces/cart"
import type { Order } from "@/models/order"
import type { ShopifyProduct } from "@/models/product"
import type { ShippingAddress, ShippingMethod } from "@/models/shipping"
import amazonPayIcon from "@/public/Amazon_Pay.svg"
import cardIcon from "@/public/Card.svg"
import cartIcon from "@/public/Cart.svg"
import payPalIcon from "@/public/PayPal.svg"
import shopPayIcon from "@/public/Shop_Pay.svg"

type OrderPageProps = {
  order: Order
}

export const OrderDetails: React.FC<OrderPageProps> = ({ order }) => {
  const products = JSON.parse(order?.products as unknown as string) as Array<ShopifyProduct & { amount: number }>
  const shippingMethod = JSON.parse(order?.shippingMethod as unknown as string) as ShippingMethod
  const shippingAddress = JSON.parse(order?.shippingAddress as unknown as string) as ShippingAddress
  const [totalItemCount, setTotalItemCount] = useState(0)

  useEffect(() => {
    const cartData = localStorage.getItem("cart")
    if (cartData) {
      const cartItems: CartItem[] = JSON.parse(cartData)

      const totalCount = cartItems.reduce((total, item) => total + item.count, 0)
      setTotalItemCount(totalCount)
    } else {
      setTotalItemCount(0)
    }
  }, [])

  if (!order) return null

  return (
    <div className="h-screen w-full">
      <div className="mt-2 flex h-10 items-center justify-between">
        <div className="flex items-center">
          <Link href="/orders">
            <ArrowLeft color="#7F85A4" width={20} height={20} />
          </Link>
          <div className="ml-2 text-sm text-[#7F85A4]">Back to My Orders</div>
        </div>
        <div className="relative block h-12 w-8 max-md:hidden">
          <Link href="/cart">
            <Image src={cartIcon} alt="Cart" className="absolute right-[5px] top-[5px] h-[25px] w-[25px]" />
            <div className="absolute right-0 top-0 z-[2] h-[14px] w-[14px] rounded-full bg-primary-500"></div>
            <div className="absolute right-[1px] top-[-1px] z-[3] rounded-full px-[3px] text-[10px] text-white">
              {totalItemCount}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <div className="">
          <div className="text-[28px] font-semibold text-primary-900">Order: {order.id}</div>
          <div className="mt-2 flex text-sm">
            <div className="text-grey-800">Order date:</div>
            <div className="mx-1 text-primary-900">{format(order.createdAt, "MMM d, yyyy")}</div>
            <div className="mx-2 text-grey-800">|</div>
            {order.financialStatus === "paid" ? (
              <div className="text-[#09BD30]">Paid</div>
            ) : (
              <div className="text-[#FF3C3C]">Refunded</div>
            )}
            <div className="mx-1 text-grey-800">•</div>
            {order.fulfillmentStatus !== null ? (
              <div className="text-[#09BD30]">Fulfilled</div>
            ) : (
              <div className="text-[#FF3C3C]">Unfulfilled</div>
            )}
          </div>
        </div>
        <div className="text-sm">
          {order.fulfillments && order.fulfillments.length > 0 && (
            <Link href={order.fulfillments[0].tracking_url}>
              <div className="ml-auto cursor-pointer rounded-3xl border border-primary-500 px-2 py-1 text-center text-xs text-primary-500">
                • Track order
              </div>
            </Link>
          )}
          {order.fulfillments && order.fulfillments.length > 0 && (
            <div className="mt-2 text-xs text-grey-800">
              {order.fulfillments[0].tracking_company} {order.fulfillments[0].tracking_number}
            </div>
          )}
        </div>
      </div>
      <div className="mt-[24px] w-full rounded-xl border border-grey-400">
        <div className="flex justify-between border-b border-grey-400 px-[20px] py-[16px] text-[12px] uppercase text-grey-800">
          <div className="w-[30%]">Product name</div>
          <div className="">SKU</div>
          <div className="">Wholesale</div>
          <div className="">Quantity</div>
          <div className="">Total</div>
        </div>

        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="flex h-20 items-center justify-between border-b border-grey-400 p-4 text-sm uppercase text-primary-900"
            >
              <div className="flex w-[25%] items-center">
                {product.images.edges[0]?.node?.src && (
                  <Image
                    src={product.images.edges[0].node.src}
                    alt={product.images.edges[0].node.altText ?? ""}
                    width={50}
                    height={50}
                  />
                )}
                <div className="ml-2 font-semibold">{product.title}</div>
              </div>
              <div className="">{product.variants.edges[0].node.sku}</div>
              <div className="">
                <div className="text-sm">${product.variants.edges[0].node.price}</div>
                <div className="text-[10px]">${product.variants.edges[0].node.price}</div>
              </div>
              <div className="">{product.amount}</div>
              <div className="">${product.variants.edges[0].node.price}</div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-grey-800">No products found in this order.</div>
        )}
        <div className="flex h-auto w-full justify-between max-lg:p-0 lg:p-4">
          <div className="block text-[16px] font-semibold text-primary-900 max-md:hidden">Order Summary</div>
          <div className="w-[40%] bg-grey-200 p-4 text-sm max-lg:rounded-s-none max-md:w-full lg:rounded-2xl">
            <div className="flex justify-between text-sm text-primary-900">
              <div className="">Subtotal</div>
              <div className="">${order.totalPrice}</div>
            </div>
            <div className="mt-[16px] flex justify-between text-sm text-grey-800">
              <div className="">{shippingMethod.type}</div>
              <div className="">{shippingMethod.price}</div>
            </div>
            <div className="mt-[16px] flex justify-between text-sm text-grey-800">
              <div className="">Taxes</div>
              <div className="">$0.00</div>
            </div>
            <div className="mt-4 w-full border-2 border-t border-dashed border-grey-400"></div>
            <div className="mt-[16px] flex justify-between text-[16px] text-primary-900">
              <div className="">Total</div>
              <div className="font-semibold">${order.totalPrice}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[20px] flex w-full justify-between max-md:block">
        <div className="w-full rounded-xl border border-grey-400 p-[20px]">
          <div className="text-[16px] font-semibold text-primary-900">Payment</div>
          <div className="mt-[20px] text-sm">
            <div className="text-sm text-grey-800">Payment method:</div>
            <div className="text-primary-900">
              {order.paymentMethod === "creditCard" ? (
                <div className="flex items-center">
                  <Image src={cardIcon} alt="Credit Card" className="h-5 w-5" />
                  <div className="my-2 ml-2 text-sm font-medium">Credit Card</div>
                </div>
              ) : order.paymentMethod === "shopPay" ? (
                <Image src={shopPayIcon} alt="Visa" className="h-[18px] w-20" />
              ) : order.paymentMethod === "paypal" ? (
                <Image src={payPalIcon} alt="Visa" className="h-5 w-[79px]" />
              ) : order.paymentMethod === "amazonPay" ? (
                <Image src={amazonPayIcon} alt="Visa" className="h-[18px] w-[94px]" />
              ) : null}
            </div>
          </div>
          <div className="mt-[16px] text-sm">
            <div className="text-grey-800">Payment status:</div>
            <div className="text-primary-900">Paid</div>
          </div>
          {shippingAddress && (
            <div className="mt-[20px] text-sm">
              <div className="mb-[4px] text-grey-800">Billing address:</div>
              <div className="text-primary-900">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </div>
              <div className="my-[8px] text-primary-900">
                {shippingAddress.postalZipCode} {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.stateProvince}
              </div>
              <div className="text-primary-900">{shippingAddress.country}</div>
            </div>
          )}
        </div>
        <div className="ml-4 w-full rounded-xl border border-grey-400 p-[20px] max-md:ml-0 max-md:mt-4">
          <div className="text-[16px] font-semibold text-primary-900">Delivery</div>
          {shippingAddress && (
            <div className="mt-2 text-sm">
              <div className="mb-[4px] text-grey-800">Shipping Address</div>
              <div className="text-primary-900">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </div>
              <div className="my-[8px] text-primary-900">
                {shippingAddress.postalZipCode} {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.stateProvince}
              </div>
              <div className="text-primary-900">{shippingAddress.country}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

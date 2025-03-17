"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"

import type { CartItem } from "@/interfaces/cart"
import formatText from "@/lib/format-text"
import getStatusStyle from "@/lib/get-status-style"
import type { Order } from "@/models/order"
// import amazonPayIcon from "@/public/Amazon_Pay.svg"
import cardIcon from "@/public/Card.svg"
import cartIcon from "@/public/Cart.svg"
// import payPalIcon from "@/public/PayPal.svg"
// import shopPayIcon from "@/public/Shop_Pay.svg"

type OrderPageProps = {
  order: Order
}

type CustomAttribute = {
  key: string
  value: string
}

export const OrderDetails: React.FC<OrderPageProps> = ({ order }) => {
  const products = order?.lineItems
  const shippingMethod = order?.shippingLine
  const shippingAddress = order?.shippingAddress
  const [totalItemCount, setTotalItemCount] = useState(0)
  const attributesMap =
    order.customAttributes?.reduce(
      (acc: Record<string, string>, { key, value }: CustomAttribute) => {
        acc[key] = value
        return acc
      },
      {} as Record<string, string>
    ) || {}

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
            <Image src={cartIcon} alt="Cart" className="absolute top-[5px] right-[5px] h-[25px] w-[25px]" />
            <div className="bg-primary-500 absolute top-0 right-0 z-2 h-[14px] w-[14px] rounded-full"></div>
            <div className="absolute top-[-1px] right-[1px] z-3 rounded-full px-[3px] text-[10px] text-white">
              {totalItemCount}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <div>
          <div className="text-primary-900 text-[28px] font-semibold">
            Order: {order.id.replace("gid://shopify/Order/", "")}
          </div>
          <div className="mt-2 flex text-sm">
            <div className="text-grey-800">Order date:</div>
            <div className="text-primary-900 mx-1">{format(order.createdAt, "MMM d, yyyy")}</div>
            <div className="text-grey-800 mx-2">|</div>
            {order.displayFinancialStatus === "PAID" ? (
              <div className="text-green-100">{formatText(order.displayFinancialStatus)}</div>
            ) : (
              <div className="text-error-500">{formatText(order.displayFinancialStatus)}</div>
            )}
            <div className="text-grey-800 mx-1">•</div>
            {order.displayFulfillmentStatus !== null ? (
              <div className={`${getStatusStyle(order.displayFulfillmentStatus).color}`}>
                {getStatusStyle(order.displayFulfillmentStatus).text}
              </div>
            ) : (
              <div className="text-error-500">No Status</div>
            )}
          </div>
        </div>
        <div className="text-sm">
          {order.fulfillments && order.fulfillments.length > 0 && (
            <Link href={order.fulfillments[0].trackingInfo.url}>
              <div className="border-primary-500 text-primary-500 ml-auto cursor-pointer rounded-3xl border px-2 py-1 text-center text-xs">
                • Track order
              </div>
            </Link>
          )}
          {order.fulfillments && order.fulfillments.length > 0 && (
            <div className="text-grey-800 mt-2 text-xs">
              {order.fulfillments[0].trackingInfo.company} {order.fulfillments[0].trackingInfo.number}
            </div>
          )}
        </div>
      </div>
      <div className="border-grey-400 mt-6 w-full rounded-xl border">
        <div className="text-3 border-grey-400 text-grey-800 flex items-center justify-between gap-2 border-b px-5 py-4 uppercase">
          <div className="w-[30%]">Product name</div>
          <div className="hidden md:block">SKU</div>
          <div>Wholesale</div>
          <div>Quantity</div>
          <div>Total</div>
        </div>
        {products.edges && products.edges.length > 0 ? (
          products.edges?.map((item, index) => (
            <div
              key={index}
              className="border-grey-400 text-primary-900 flex h-20 items-center justify-between border-b p-4 text-sm uppercase"
            >
              <div className="flex w-3/12 items-center">
                {item.node.product.images.edges[0]?.node?.src && (
                  <Image
                    src={item.node.product.images.edges[0].node.src}
                    alt={item.node.product.images.edges[0].node.altText ?? ""}
                    width={50}
                    height={50}
                  />
                )}
                <div className="ml-2 font-semibold">{item.node.product.title}</div>
              </div>
              <div className="hidden md:block">{item.node.product.variants.edges[0].node.sku}</div>
              <div>
                <div className="text-sm">${item.node.product.variants.edges[0].node.price}</div>
                <div className="text-[10px]">${item.node.product.variants.edges[0].node.price}</div>
              </div>
              <div>{item.node.quantity}</div>
              <div>${item.node.product.variants.edges[0].node.price}</div>
            </div>
          ))
        ) : (
          <div className="text-grey-800 p-4 text-center">No products found in this order.</div>
        )}
        <div className="flex h-auto w-full justify-between max-lg:p-0 lg:p-4">
          <div className="text-primary-900 block p-4 text-base font-semibold max-md:hidden lg:p-0">Order Summary</div>
          <div className="bg-grey-200 w-1/2 p-4 text-sm max-lg:rounded-s-none max-md:w-full lg:rounded-2xl">
            <div className="text-primary-900 flex justify-between text-sm">
              <div>Subtotal</div>
              <div>${parseFloat(order.currentSubtotalPriceSet.shopMoney.amount).toFixed(2)}</div>
            </div>
            <div className="text-grey-800 mt-4 flex justify-between text-sm">
              <div>{shippingMethod?.title}</div>
              <div>${parseFloat(shippingMethod.originalPriceSet.shopMoney.amount).toFixed(2)}</div>
            </div>
            <div className="text-grey-800 mt-4 flex justify-between text-sm">
              <div>Taxes</div>
              <div>
                $
                {parseFloat(
                  order.currentTaxLines && order.currentTaxLines?.length > 0
                    ? order.currentTaxLines[0]?.priceSet?.shopMoney?.amount
                    : "0.00"
                ).toFixed(2)}
              </div>
            </div>
            <div className="border-grey-400 mt-4 w-full border-2 border-t border-dashed"></div>
            <div className="text-primary-900 mt-4 flex justify-between text-base">
              <div>Total</div>
              <div className="font-semibold">${order.totalPrice}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-between max-md:block">
        <div className="border-grey-400 w-full rounded-xl border p-5">
          <div className="text-primary-900 text-base font-semibold">Payment</div>
          <div className="mt-5 text-sm">
            <div className="text-grey-800 text-sm">Payment method:</div>
            <div className="text-primary-900">
              {attributesMap && attributesMap.stripe_card_brand === "visa" ? (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <p>Credit Card</p>
                  <p>**{attributesMap.stripe_card_last4}</p>
                  <Image src={cardIcon} alt="Credit Card" className="h-5 w-5" />
                </div>
              ) : // ) : order.paymentMethod === "shopPay" ? (
              //   <Image src={shopPayIcon} alt="Visa" className="h-[18px] w-20" />
              // ) : order.paymentMethod === "paypal" ? (
              //   <Image src={payPalIcon} alt="Visa" className="h-5 w-[79px]" />
              // ) : order.paymentMethod === "amazonPay" ? (
              //   <Image src={amazonPayIcon} alt="Visa" className="h-[18px] w-[94px]" />
              null}
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="text-grey-800">Payment status:</div>
            <div className="text-primary-900">{formatText(order.displayFinancialStatus)}</div>
          </div>
          {shippingAddress && (
            <div className="mt-5 text-sm">
              <div className="text-grey-800 mb-1">Billing address:</div>
              <div className="text-primary-900">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </div>
              <div className="text-primary-900 my-2">
                {shippingAddress.zip} {shippingAddress.address2}, {shippingAddress.city}, {shippingAddress.province}
              </div>
              <div className="text-primary-900">{shippingAddress.country}</div>
            </div>
          )}
        </div>
        <div className="border-grey-400 ml-4 w-full rounded-xl border p-5 max-md:mt-4 max-md:ml-0">
          <div className="text-primary-900 text-base font-semibold">Delivery</div>
          {shippingAddress && (
            <div className="mt-2 text-sm">
              <div className="text-grey-800 mb-1">Shipping Address</div>
              <div className="text-primary-900">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </div>
              <div className="text-primary-900 my-2">
                {shippingAddress.zip} {shippingAddress.address2}, {shippingAddress.city}, {shippingAddress.province}
              </div>
              <div className="text-primary-900">{shippingAddress.country}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

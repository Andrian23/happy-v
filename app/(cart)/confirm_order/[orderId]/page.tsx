"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { format } from "date-fns"

import { getOrderByOrderId } from "@/actions/order"
import AddressBlock from "@/components/AddressBlock"
import ConfirmOrderItem from "@/components/ConfirmOrderItem"
import Loader from "@/components/Loader"
import SummaryItem from "@/components/SummaryItem"
import { Button } from "@/components/ui/Button"
import { useCart, useLocalStorage, useProductData } from "@/hooks"
import type { Order } from "@/models/order"
import amazonPayLogo from "@/public/Amazon_Pay.svg"
import cardIcon from "@/public/Card.svg"
import confirmedOrderImage from "@/public/Confirmed_Order.svg"
import payPalLogo from "@/public/PayPal.svg"
import shopPayLogo from "@/public/Shop_Pay.svg"

const headerRow = [
  { label: "Product name", width: "40%", align: "text-start" },
  { label: "SKU", width: "30%", align: "text-start" },
  { label: "Wholesale", width: "10%", align: "text-start" },
  { label: "Quantity", width: "10%", align: "text-end" },
  { label: "Total", width: "10%", align: "text-end" },
]

const getPaymentMethodContent = (paymentMethod: string | undefined) => {
  switch (paymentMethod) {
    case "creditCard":
      return (
        <div className="flex items-center">
          <Image src={cardIcon} alt="Credit Card" className="h-5 w-5" />
          <div className="my-2 ml-2 font-medium">Credit Card</div>
        </div>
      )
    case "shopPay":
      return <Image src={shopPayLogo} alt="Shop Pay" className="h-[18px] w-20" />
    case "paypal":
      return <Image src={payPalLogo} alt="PayPal" className="h-5 w-[79px]" />
    case "amazonPay":
      return <Image src={amazonPayLogo} alt="Amazon Pay" className="h-[18px] w-[94px]" />
    default:
      return null
  }
}

const ConfirmedOrderPage = () => {
  const router = useRouter()
  const [orderData, setOrderData] = useState<Order | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shippingAddress] = useLocalStorage<string | null>("shippingAddress", null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPaymentMethod] = useLocalStorage<string | null>("selectedPaymentMethod", null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shippingMethod] = useLocalStorage<string | null>("shippingMethod", null)

  const pathname = usePathname()
  const orderId = pathname.split("/").pop()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cartContent, listProductsId } = useCart(setTotalPrice)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [productData] = useProductData(listProductsId)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        const order = await getOrderByOrderId(parseInt(orderId, 10))
        setOrderData(order)

        // Calculate total price
        const total = order.products?.reduce((acc, product) => {
          return acc + parseFloat(product.variants[0].price) * product.count
        }, 0)
        setTotalPrice(total ?? 0)
      }
    }
    fetchOrderData()
  }, [orderId])

  return (
    <div className="h-full w-full bg-grey-200">
      <div className="h-full w-full px-[10rem] py-[32px] max-lg:px-[1rem]">
        <div className="h-auto w-full rounded-2xl bg-white py-[32px]">
          <div className="flex items-center justify-center">
            <div>
              <div className="flex items-center justify-center">
                <Image src={confirmedOrderImage} className="h-[94px] w-[94px]" alt="Order Confirmed" />
              </div>
              <div className="mt-2 text-center">
                <div className="text-[14px] font-medium text-[#09BD30] max-lg:text-xs">Order Confirmed</div>
                <div className="mb-2 text-[28px] font-semibold text-primary-900 max-lg:text-xl">
                  Order ID: {JSON.stringify(orderData?.id)}{" "}
                </div>
                <div className="my-2 text-[14px] font-medium text-primary-900 max-lg:text-xs">
                  Thank you for you&apos;r order! Your order was placed successfully
                </div>
                <div className="my-2 text-[14px] font-medium text-grey-800 max-lg:text-xs">
                  Placed on: {orderData?.createdAt ? format(new Date(orderData.createdAt), "MMMM do, yyyy, h:mma") : ""}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button variant="secondary" className="mt-5" onClick={() => router.push("/orders")}>
                  Back to wholesale orders
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 h-auto w-full rounded-2xl bg-white">
          <div className="flex h-auto w-full items-center justify-between border-b border-grey-400 px-[20px] py-[16px] text-xs uppercase text-grey-800">
            {headerRow.map(({ label, width, align }) => (
              <div key={label} className={`w-[${width}] ${align}`}>
                {label}
              </div>
            ))}
          </div>

          <>
            {orderData?.products ? (
              orderData?.products.map((product, index) => <ConfirmOrderItem key={index} product={product} />)
            ) : (
              <Loader />
            )}
          </>

          <div className="p-5">
            <div className="my-2 flex h-auto w-full items-start justify-between">
              <div className="text-mb font-semibold text-primary-900 max-lg:hidden">Order Summary</div>
              <div className="h-auto w-[35%] rounded-2xl bg-grey-200 p-3 max-lg:w-full">
                <SummaryItem label="Subtotal" value={`$${orderData?.totalPrice}`} isBold />
                <SummaryItem label={orderData?.shippingMethod?.type} value={orderData?.shippingMethod?.price} />
                <SummaryItem label="Taxes" value="$0.00" className="border-b border-dashed border-gray-400 pb-3 pt-3" />
                <SummaryItem
                  label="Total"
                  value={`$${(parseFloat(orderData?.shippingMethod?.price.replace("$", "") ?? "0") + totalPrice).toFixed(2)}`}
                  isBold
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {orderData?.shippingAddress && (
              <AddressBlock title="Shipping Address" address={orderData.shippingAddress} />
            )}
            {orderData?.billingAddress && <AddressBlock title="Billing Address" address={orderData.billingAddress} />}
            <div className="h-full rounded-2xl bg-white p-4 text-sm text-primary-900 max-lg:my-4 max-lg:w-full max-lg:text-xs">
              <div className="text-base font-semibold">Payment Method</div>
              <div className="h-full w-full">{getPaymentMethodContent(orderData?.paymentMethod)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmedOrderPage

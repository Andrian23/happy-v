"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Elements } from "@stripe/react-stripe-js"
import { type Appearance, loadStripe } from "@stripe/stripe-js"

import BillingModal from "@/components/BillingModal"
import Breadcrumbs from "@/components/Breadcrumbs"
import OrderSummary from "@/components/OrderSummary"
import PaymentMethod from "@/components/PaymentMethod"
import PaymentModal from "@/components/PaymentModal"
import { Button } from "@/components/ui/Button"
import { useCart, useLocalStorage, useProductData, useStorageChange } from "@/hooks"
import type { CartItem } from "@/interfaces/cart"
import type { UserCard } from "@/interfaces/payment"
import { handleCartItemsChange } from "@/lib"
import { cn } from "@/lib/utils"
import type { ShippingAddress, ShippingMethod } from "@/models/shipping"
import amazonPayLogo from "@/public/Amazon_Pay.svg"
import americanExpressLogo from "@/public/American_express.svg"
import cardIcon from "@/public/Card.svg"
import mastercardLogo from "@/public/Mastercard.svg"
import payPalLogo from "@/public/PayPal.svg"
import radioButtonIcon from "@/public/Radio_button.svg"
import shopPayLogo from "@/public/Shop_Pay.svg"
import visaLogo from "@/public/Visa.svg"

const appearance = {
  variables: {
    fontFamily: '"Hanken Grotesk", sans-serif',
  },
  rules: {
    ".Input": {
      padding: "8px 12px",
      borderRadius: "12px",
      boxShadow: "none",
      fontSize: "14px",
      lineHeight: "24px",
      color: "#25425d",
      fontWeight: "500",
    },
    ".Input::placeholder": {
      color: "#7C8E9E",
    },
    ".Label": {
      fontWeight: "600",
      color: "#25425d",
      marginBottom: "8px",
      fontSize: "14px",
    },
  },
} satisfies Appearance

const paymentMethods = [
  { name: "shopPay", icon: <Image src={shopPayLogo} alt="ShopPay logo" className="h-[18px] w-20" /> },
  { name: "paypal", icon: <Image src={payPalLogo} alt="PayPal logo" className="h-5 w-[79px]" /> },
  { name: "amazonPay", icon: <Image src={amazonPayLogo} alt="Amazon logo" className="h-[18px] w-[94px]" /> },
]

type PaymentProps = {
  clientSecret?: string
}

export const Payment: React.FC<PaymentProps> = ({ clientSecret }) => {
  const router = useRouter()

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [isBillingModalVisible, setIsBillingModalVisible] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isProtected, setIsProtected] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("protected") === "true"
    }
    return false
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedPaymentMethod") || null
    }
    return null
  })

  const [cart] = useLocalStorage<CartItem[]>("cart", [])
  const [shippingAddress] = useLocalStorage<ShippingAddress | null>("shippingAddress", null)
  const [shippingMethod] = useLocalStorage<ShippingMethod | null>("shippingMethod", null)
  const [userCard] = useLocalStorage<UserCard | null>("userCard", null)
  const [email] = useLocalStorage<string>("shippingAddress", "", "email")

  const { cartContent, listProductsId, totalCount } = useCart(setTotalPrice)
  const [productData] = useProductData(listProductsId, cart)
  useStorageChange(handleCartItemsChange(setTotalPrice))

  const handlePaymentModal = () => setIsPaymentModalVisible(!isPaymentModalVisible)
  const handleBillingModal = () => setIsBillingModalVisible(!isBillingModalVisible)

  const handleProtectionClick = () => {
    const newValue = !isProtected
    setIsProtected(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem("protected", newValue.toString())
    }
  }

  const handlePaymentMethodClick = (method: string) => {
    setSelectedPaymentMethod(method)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPaymentMethod", method)
    }
  }

  const handlePlaceOrder = async () => {
    if (!userCard || !selectedPaymentMethod) return
    try {
      const response = await fetch("/api/upload_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: orderData.email,
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.shippingAddress,
          shippingMethod: orderData.shippingMethod,
          paymentMethod: orderData.selectedPaymentMethod,
          products: orderData.productData,
          totalPrice: orderData.totalPrice,
          status: "pending",
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", response.status, errorText)
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      console.log("Order uploaded successfully:", result)

      localStorage.removeItem("cart")
      localStorage.removeItem("shippingMethod")
      localStorage.removeItem("selectedPaymentMethod")
      localStorage.removeItem("userCard")
      // Redirect to confirm_order with orderId
      router.push(`/confirm_order/${result.newOrder.id}`)
    } catch (error) {
      console.error("Error uploading order:", error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  const orderData = {
    email: email,
    shippingAddress: shippingAddress,
    shippingMethod: shippingMethod,
    selectedPaymentMethod: selectedPaymentMethod,
    userCard: userCard,
    productData: productData,
    totalPrice: totalPrice,
    status: "pending",
  }

  return (
    <>
      {isPaymentModalVisible && (
        <Elements
          stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)}
          options={{ appearance, clientSecret }}
        >
          <PaymentModal />
        </Elements>
      )}
      {isBillingModalVisible && <BillingModal />}
      <section className="lg:col-span-3">
        <Breadcrumbs currentStep="payment" />
        <div className="h-auto w-full rounded-2xl bg-white p-4">
          <div className="border-b border-gray-200 pb-4 pt-2">
            <div className="my-1 text-sm text-grey-800">Contact</div>
            <div className="my-1 text-sm font-medium text-primary-900">{email}</div>
          </div>
          <div className="border-b border-gray-200 pt-2">
            <div className="my-1 text-sm text-grey-800">Ship to</div>
            <div className="flex items-start justify-between">
              {shippingAddress ? (
                <div className="pb-4 text-sm font-medium text-primary-900">
                  <div>
                    {shippingAddress.address}, {shippingAddress.apartment}, {shippingAddress.city},{" "}
                    {shippingAddress.province} {shippingAddress.postalCode}
                  </div>
                  <div>{shippingAddress.country}</div>
                </div>
              ) : null}
              <Link href="/shipping">
                <div className="cursor-pointer text-sm font-medium text-primary-500">Change</div>
              </Link>
            </div>
          </div>
          <div className="pt-4">
            <div className="my-1 text-sm text-grey-800">Method</div>
            <div className="flex items-start justify-between">
              <div className="text-sm font-medium text-primary-900">
                {shippingMethod && (
                  <div>
                    {shippingMethod.type} • {shippingMethod.price}
                  </div>
                )}
              </div>
              <Link href="/shipping">
                <div className="cursor-pointer text-sm font-medium text-primary-500">Change</div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xl font-semibold text-primary-900">Payment</div>
          <div className="my-4 h-auto w-full rounded-xl bg-white p-4">
            <div className="flex w-full items-center" onClick={() => handlePaymentMethodClick("creditCard")}>
              <div
                className={cn(
                  "relative h-5 w-5 shrink-0 rounded-full border border-grey-700",
                  selectedPaymentMethod === "creditCard" && "border-primary-500"
                )}
              >
                {selectedPaymentMethod === "creditCard" && (
                  <Image src={radioButtonIcon} alt="Shipping" fill className="h-5 w-5 object-contain" />
                )}
              </div>

              <div className="ml-2 flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Image src={cardIcon} alt="cart" className="h-[17px] w-[17px]" color="#25425D" />
                  <div className="ml-2 text-sm font-medium text-primary-900">Credit Card</div>
                </div>
                <div className="flex items-center">
                  <Image src={visaLogo} alt="Visa" className="h-3 w-10" />
                  <Image src={mastercardLogo} alt="Mastercard" className="ml-2 h-3.5 w-[23px]" />
                  <Image src={americanExpressLogo} alt="American_express" className="ml-2 h-3 w-[47px]" />
                </div>
              </div>
            </div>
            {selectedPaymentMethod === "creditCard" && (
              <>
                {selectedPaymentMethod === "creditCard" && userCard && (
                  <div className="my-4 h-auto w-full rounded-xl border border-grey-400 p-4">
                    <div className="flex items-start justify-start">
                      <Image src={radioButtonIcon} alt="Shipping" className="h-5 w-5" />
                      <div className="ml-2 text-sm font-medium text-primary-900">
                        <div>**** **** **** {userCard.cardNumber.slice(-4)}</div>
                        <div>{userCard.cardName}</div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === "creditCard" && (
                  <Button variant="primary-outline" className="mt-4 w-full gap-2" onClick={handlePaymentModal}>
                    <Plus />
                    Add credit card
                  </Button>
                )}
              </>
            )}
          </div>
          {paymentMethods.map(({ name, icon }) => (
            <PaymentMethod
              key={name}
              onClick={() => handlePaymentMethodClick(name)}
              isSelected={selectedPaymentMethod === name}
            >
              {icon}
            </PaymentMethod>
          ))}
        </div>

        <div className="mt-8">
          <div className="text-xl font-semibold text-primary-900">Billing Address</div>
          <div className="mt-4 rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              {shippingAddress ? (
                <div className="text-sm font-medium text-primary-900">
                  <div>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </div>
                  <div>
                    {shippingAddress.address}, {shippingAddress.apartment}, {shippingAddress.city},{" "}
                    {shippingAddress.province} {shippingAddress.postalCode}
                  </div>
                  <div>{shippingAddress.country}</div>
                </div>
              ) : null}
              <div className="cursor-pointer text-sm font-medium text-primary-500" onClick={handleBillingModal}>
                Change
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:col-span-2">
        <OrderSummary
          totalCount={totalCount}
          cartContent={cartContent}
          productData={productData}
          subtotal={totalPrice.toFixed(2)}
          shipping={shippingMethod ? shippingMethod.price : "N/A"}
          taxes="Calculated at checkout"
          handleProtectionClick={handleProtectionClick}
        >
          <div className="p-4">
            <div className="flex justify-between pt-4 text-lg font-semibold">
              <div>Total</div>
              <div>
                $
                {(
                  totalPrice +
                  (isProtected ? 1.99 : 0) +
                  (shippingMethod ? parseFloat(shippingMethod.price.replace("$", "")) : 0)
                ).toFixed(2)}
              </div>
            </div>
            <div>
              <Button
                className="mt-5 w-full"
                variant="primary"
                disabled={!userCard || !selectedPaymentMethod}
                onClick={handlePlaceOrder}
              >
                Place order
              </Button>
            </div>
          </div>
        </OrderSummary>
      </section>
    </>
  )
}
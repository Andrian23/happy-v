"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Elements } from "@stripe/react-stripe-js"
import { type Appearance, loadStripe, type PaymentMethod } from "@stripe/stripe-js"

import { placeOrder } from "@/actions/order"
import { getPaymentMethods } from "@/actions/paymentIntent"
import BillingModal from "@/components/BillingModal"
import Breadcrumbs from "@/components/Breadcrumbs"
import { OrderSummary, shippingMethods } from "@/components/cart/OrderSummary"
import PaymentModal from "@/components/PaymentModal"
import { Button } from "@/components/ui/Button"
import { useLocalStorage } from "@/hooks"
import { cn } from "@/lib/utils"
import type { ShippingAddress } from "@/models/shipping"
import americanExpressLogo from "@/public/American_express.svg"
import cardIcon from "@/public/Card.svg"
import mastercardLogo from "@/public/Mastercard.svg"
import radioButtonIcon from "@/public/Radio_button.svg"
import visaLogo from "@/public/Visa.svg"
import { useCartStore } from "@/stores/cart"

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
      borderColor: "#E7E6E6",
    },
    ".Input::placeholder": {
      color: "#7C8E9E",
    },
    ".Input:focus": {
      borderColor: "#E7E6E6",
      outline: "none",
      boxShadow: `0 0 0 2px #fff, 0 0 0 4px #6CB4DA`,
    },
    ".Input--invalid": {
      boxShadow: "none",
      borderColor: "#FF6A6A",
    },
    ".Error": {
      color: "#FF6A6A",
      fontSize: "14px",
      lineHeight: "20px",
    },
    ".Label": {
      fontWeight: "600",
      color: "#25425d",
      marginBottom: "8px",
      fontSize: "14px",
    },
  },
} satisfies Appearance

type PaymentProps = {
  clientSecret?: string
  initialPaymentMethods: PaymentMethod[]
  defaultPaymentMethod: string | null
}

export const Payment: React.FC<PaymentProps> = ({ clientSecret, initialPaymentMethods, defaultPaymentMethod }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(defaultPaymentMethod)
  const router = useRouter()

  const [isBillingModalVisible, setIsBillingModalVisible] = useState(false)

  const products = useCartStore((state) => state.products)
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const [shippingAddress] = useLocalStorage<ShippingAddress | null>("shippingAddress", null)
  const [email] = useLocalStorage<string>("shippingAddress", "", "email")

  const handleBillingModal = () => setIsBillingModalVisible(!isBillingModalVisible)

  const refreshPaymentMethods = useCallback(async () => {
    const { paymentMethods, defaultPaymentMethod } = await getPaymentMethods()
    setPaymentMethods(paymentMethods)
    setSelectedPaymentMethod(defaultPaymentMethod)
  }, [])

  const handleAddPaymentMethod = useCallback(async () => {
    await refreshPaymentMethods()
  }, [refreshPaymentMethods])

  const handlePlaceOrder = useCallback(
    async (totalPrice: number) => {
      if (!selectedPaymentMethod || !shippingMethod || !shippingAddress) return

      try {
        const order = await placeOrder({
          shippingMethod: {
            type: shippingMethod,
            price: shippingMethods[shippingMethod].price,
          },
          products,
          totalPrice,
          paymentMethod: selectedPaymentMethod,
          shippingAddress,
          billingAddress: shippingAddress,
        })

        router.push(`/confirmed/${order.id}`)
      } catch {
        console.error("Error uploading order:")
      }
    },
    [router, selectedPaymentMethod, shippingMethod, shippingAddress, products]
  )

  return (
    <>
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
                    {shippingMethods[shippingMethod].label} • ${shippingMethods[shippingMethod].price.toFixed(2)}
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
            <div className="flex w-full items-center">
              <div className="relative h-5 w-5 shrink-0 rounded-full border border-primary-500">
                <Image src={radioButtonIcon} alt="Shipping" fill className="h-5 w-5 object-contain" />
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
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="my-4 h-auto w-full rounded-xl border border-grey-400 p-4"
                onClick={() => setSelectedPaymentMethod(pm.id)}
              >
                <div className="flex items-start justify-start">
                  <div
                    className={cn(
                      "relative h-5 w-5 shrink-0 rounded-full border border-grey-700",
                      selectedPaymentMethod === pm.id && "border-primary-500"
                    )}
                  >
                    {selectedPaymentMethod === pm.id && (
                      <Image src={radioButtonIcon} alt="Shipping" fill className="h-5 w-5 object-contain" />
                    )}
                  </div>
                  <div className="ml-2 text-sm font-medium text-primary-900">
                    <div>**** **** **** {pm.card?.last4}</div>
                    <div>{pm.card?.brand}</div>
                  </div>
                </div>
              </div>
            ))}

            <Elements
              stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)}
              options={{ appearance, clientSecret }}
            >
              <PaymentModal onPaymentAdded={handleAddPaymentMethod}>
                <Button variant="primary-outline" className="mt-4 w-full gap-2">
                  <Plus />
                  Add credit card
                </Button>
              </PaymentModal>
            </Elements>
          </div>
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

      <OrderSummary
        onSubmit={handlePlaceOrder}
        buttonLabel="Place order"
        disabled={!selectedPaymentMethod || !shippingAddress || !shippingMethod}
      />
    </>
  )
}

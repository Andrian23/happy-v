"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"

import { Elements } from "@stripe/react-stripe-js"
import { type Appearance, loadStripe, type PaymentMethod } from "@stripe/stripe-js"

// import { createOrderShopify } from "@/actions/order"
import { getPaymentMethods } from "@/actions/paymentIntent"
import Breadcrumbs from "@/components/Breadcrumbs"
// import { OrderSummary } from "@/components/cart/OrderSummary"
import PaymentModal from "@/components/PaymentModal"
import SettingsShippingModal from "@/components/SettingsShippingModal"
import { Button } from "@/components/ui/Button"
import { useLocalStorage } from "@/hooks"
// import { useShippingMethods } from "@/lib/useShippingMethods"
import { cn } from "@/lib/utils"
import americanExpress from "@/public/american-express.webp"
import cardIcon from "@/public/Card.svg"
import mastercard from "@/public/mastercard.webp"
import radioButtonIcon from "@/public/Radio_button.svg"
import visa from "@/public/visa.webp"
import { useAddressStore } from "@/stores/address"
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

const paymentMethodIcons = {
  visa: {
    src: visa,
    alt: "Visa",
    width: 40,
    height: 12,
  },
  mastercard: {
    src: mastercard,
    alt: "Mastercard",
    width: 23,
    height: 14,
  },
  amex: {
    src: americanExpress,
    alt: "American Express",
    width: 47,
    height: 12,
  },
}

type PaymentProps = {
  clientSecret?: string
  initialPaymentMethods: PaymentMethod[]
  defaultPaymentMethod: string | null
}

export const Payment: React.FC<PaymentProps> = ({ clientSecret, initialPaymentMethods, defaultPaymentMethod }) => {
  // const router = useRouter()
  // const searchParams = useSearchParams()

  const [email] = useLocalStorage<string>("shippingAddress", "", "email")

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(defaultPaymentMethod)
  const [isBillingModalVisible, setIsBillingModalVisible] = useState(false)

  // const subtotal = useCartStore((state) =>
  //   state.products.reduce((acc, product) => acc + parseFloat(product.variants.edges[0].node.price) * product.amount, 0)
  // )
  // const products = useCartStore((state) => state.products)
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const { selectedShippingAddress, billingAddress, setBillingAddress } = useAddressStore()

  // const checkoutId = searchParams.get("checkoutId")
  // const { shippingMethods, totalTaxAmount } = useShippingMethods(checkoutId, selectedShippingAddress)

  const handleBillingModal = () => setIsBillingModalVisible(!isBillingModalVisible)

  const refreshPaymentMethods = useCallback(async () => {
    const { paymentMethods, defaultPaymentMethod } = await getPaymentMethods()
    setPaymentMethods(paymentMethods)
    setSelectedPaymentMethod(defaultPaymentMethod)
  }, [])

  const handleAddPaymentMethod = useCallback(async () => {
    await refreshPaymentMethods()
  }, [refreshPaymentMethods])

  // const handlePlaceOrder = useCallback(
  //   async (totalPrice: number) => {
  //     if (!selectedPaymentMethod || !shippingMethod || !billingAddress || !selectedShippingAddress) return
  //
  //     const { order } = await createOrderShopify({
  //       lineItems: products.map((product) => ({
  //         variantId: product.variants.edges[0].node.id,
  //         quantity: product.amount,
  //       })),
  //       transactions: [
  //         {
  //           kind: "SALE",
  //           status: "SUCCESS",
  //           amountSet: {
  //             shopMoney: {
  //               amount: totalPrice.toString(),
  //               currencyCode: "USD",
  //             },
  //           },
  //         },
  //       ],
  //       shippingAddress: {
  //         firstName: selectedShippingAddress.firstName,
  //         lastName: selectedShippingAddress.lastName,
  //         address1: selectedShippingAddress.address,
  //         address2: selectedShippingAddress.apartmentSuite || "",
  //         city: selectedShippingAddress.city,
  //         province: selectedShippingAddress.stateProvince,
  //         country: selectedShippingAddress.country,
  //         zip: selectedShippingAddress.postalZipCode,
  //         phone: selectedShippingAddress.phone,
  //       },
  //       billingAddress: {
  //         firstName: billingAddress.firstName,
  //         lastName: billingAddress.lastName,
  //         address1: billingAddress.address,
  //         address2: billingAddress.apartmentSuite || "",
  //         city: billingAddress.city,
  //         province: billingAddress.stateProvince,
  //         country: billingAddress.country,
  //         zip: billingAddress.postalZipCode,
  //         phone: billingAddress.phone,
  //       },
  //       shippingLines: [
  //         {
  //           title: shippingMethods?.find((method) => method.code === shippingMethod)?.title || "",
  //           source: "shopify",
  //           code: "Standard (2-6 days)",
  //           taxLines: {
  //             title: "Tax",
  //             rate: (parseFloat(totalTaxAmount.amount) / subtotal).toString(),
  //             priceSet: {
  //               shopMoney: {
  //                 amount: totalTaxAmount.amount,
  //                 currencyCode: "UAH",
  //               },
  //             },
  //           },
  //           priceSet: {
  //             shopMoney: {
  //               amount: shippingMethods?.find((method) => method.code === shippingMethod)?.estimatedCost.amount || "",
  //               currencyCode: "UAH",
  //             },
  //             presentmentMoney: {
  //               amount: shippingMethods?.find((method) => method.code === shippingMethod)?.estimatedCost.amount || "",
  //               currencyCode: "UAH",
  //             },
  //           },
  //         },
  //       ],
  //       payment: {
  //         paymentMethod: selectedPaymentMethod,
  //         amount: totalPrice.toString(),
  //       },
  //     })
  //
  //     router.push(`/confirmed/${order.id.replace("gid://shopify/Order/", "")}`)
  //   },
  //   [router, selectedPaymentMethod, shippingMethod, selectedShippingAddress, billingAddress, products]
  // )

  useEffect(() => {
    if (!billingAddress && selectedShippingAddress) {
      setBillingAddress(selectedShippingAddress)
    }
  }, [billingAddress, selectedShippingAddress, setBillingAddress])

  return (
    <>
      {selectedShippingAddress && isBillingModalVisible && (
        <SettingsShippingModal
          shippingData={selectedShippingAddress}
          onClose={handleBillingModal}
          addressType="billing"
        />
      )}
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
              {selectedShippingAddress ? (
                <div className="pb-4 text-sm font-medium text-primary-900">
                  <div>
                    {selectedShippingAddress.address}, {selectedShippingAddress.apartmentSuite},{" "}
                    {selectedShippingAddress.city}, {selectedShippingAddress.stateProvince}{" "}
                    {selectedShippingAddress.postalZipCode}
                  </div>
                  <div>{selectedShippingAddress.country}</div>
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
                    {/*{shippingMethods?.find((method) => method.code === shippingMethod)?.title} - $*/}
                    {/*{shippingMethods?.find((method) => method.code === shippingMethod)?.estimatedCost.amount}*/}
                    {/*{shippingMethods[shippingMethod].label} - ${shippingMethods[shippingMethod].price}*/}
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
                  <Image src={visa} alt="Visa" className="h-3 w-10" />
                  <Image src={mastercard} alt="Mastercard" className="ml-2 h-3.5 w-[23px]" />
                  <Image src={americanExpress} alt="American_express" className="ml-2 h-3 w-[47px]" />
                </div>
              </div>
            </div>
            {paymentMethods.map((pm) => {
              const paymentMethodIcon = paymentMethodIcons[pm.card?.brand as keyof typeof paymentMethodIcons]
              return (
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
                      <Image
                        src={paymentMethodIcon.src}
                        alt={paymentMethodIcon.alt}
                        height={paymentMethodIcon.height}
                        width={paymentMethodIcon.width}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

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
              {billingAddress ? (
                <div className="text-sm font-medium text-primary-900">
                  <div>
                    {billingAddress.firstName} {billingAddress.lastName}
                  </div>
                  <div>
                    {billingAddress.address}, {billingAddress.apartmentSuite}, {billingAddress.city},{" "}
                    {billingAddress.stateProvince} {billingAddress.postalZipCode}
                  </div>
                  <div>{billingAddress.country}</div>
                </div>
              ) : null}
              <div className="cursor-pointer text-sm font-medium text-primary-500" onClick={handleBillingModal}>
                Change
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*<OrderSummary*/}
      {/*  onSubmit={handlePlaceOrder}*/}
      {/*  buttonLabel="Place order"*/}
      {/*  disabled={!selectedPaymentMethod || !selectedShippingAddress || !shippingMethod || !billingAddress}*/}
      {/*  shippingMethods={shippingMethods}*/}
      {/*  totalTaxAmount={totalTaxAmount}*/}
      {/*/>*/}
    </>
  )
}

import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"

import { PaymentMethod } from "@stripe/stripe-js"

import { getPaymentMethods } from "@/actions/paymentIntent"
import americanExpress from "@/public/american-express.webp"
import mastercard from "@/public/mastercard.webp"
import settingsPaymentIcon from "@/public/SettingsPayment.svg"
import visa from "@/public/visa.webp"

import { Button } from "./ui/Button"
import Loader from "./Loader"

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

const SettingsPayment = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const { paymentMethods, defaultPaymentMethod } = await getPaymentMethods()
      setPaymentMethods(paymentMethods)
      setDefaultPaymentMethod(defaultPaymentMethod)
      setIsLoading(false)
    }
    fetchPaymentMethods()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  if (paymentMethods.length > 0) {
    return paymentMethods.map((paymentMethod) => {
      const paymentMethodIcon = paymentMethodIcons[paymentMethod.card?.brand as keyof typeof paymentMethodIcons]
      return (
        <div key={paymentMethod.id} className="my-4 h-auto w-[60%] rounded-2xl bg-grey-200 p-4 max-lg:w-full">
          <div className="flex items-center justify-between text-sm">
            <Image
              src={paymentMethodIcon.src}
              alt={paymentMethodIcon.alt}
              height={paymentMethodIcon.height}
              width={paymentMethodIcon.width}
            />

            {defaultPaymentMethod === paymentMethod.id && (
              <div className="rounded-full bg-primary-500 px-2 py-1 text-[12px] text-white">Default</div>
            )}
          </div>
          <div className="my-2 text-sm">**** **** **** {paymentMethod.card?.last4}</div>
          <div className="flex items-center justify-start text-sm">
            {/* <Button
              variant="destructive-outline"
              className="cursor-pointer rounded-full border border-grey-400 px-3 py-2 text-[#FF3C3C]"
              onClick={() => console.log("Delete payment method")}
            >
              Delete
            </Button> */}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="text-center">
        <div className="m-auto w-fit rounded-full bg-grey-200 p-4">
          <Image src={settingsPaymentIcon} alt="Cart" className="h-[42px] w-[42px]" />
        </div>
        <div className="mt-2 text-sm font-medium text-primary-900">It&apos;s still empty here</div>
        <div className="mt-2 text-sm text-grey-800">You have not added any payment method yet</div>
        <div className="flex items-center justify-center">
          <Button variant="primary" className="mt-2 gap-2">
            <Plus />
            Add payment method
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPayment

import React, { useMemo } from "react"

import { useCartStore } from "@/stores/cart"

import { Button } from "../ui/Button"
import { Checkbox } from "../ui/Checkbox"
import { Label } from "../ui/Label"

const PROTECTION_PRICE = 1.99
const STANDARD_SHIPPING_PRICE = 8.3
const EXPRESS_SHIPPING_PRICE = 12.3

export const shippingMethods = {
  standard: {
    label: "Standard (2-6 Days)",
    price: STANDARD_SHIPPING_PRICE,
  },
  express: {
    label: "Express (1-2 Business Days)",
    price: EXPRESS_SHIPPING_PRICE,
  },
}

type OrderSummaryProps = {
  onSubmit: (total: number) => void
  buttonLabel: string
  disabled?: boolean
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ onSubmit, buttonLabel, disabled }) => {
  const subtotal = useCartStore((state) =>
    state.products.reduce((acc, product) => acc + parseFloat(product.variants[0].price) * product.amount, 0)
  )
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const isProtected = useCartStore((state) => state.protected)
  const setIsProtected = useCartStore((state) => state.setProtected)
  const total = useMemo(() => {
    const protectionPrice = isProtected ? PROTECTION_PRICE : 0
    const shippingPrice = shippingMethod ? shippingMethods[shippingMethod].price : 0

    return subtotal + protectionPrice + shippingPrice
  }, [subtotal, isProtected, shippingMethod])

  return (
    <section className="h-fit w-full rounded-xl bg-white text-primary-900 lg:col-span-2">
      <div className="border-b border-grey-400 p-4 lg:p-6">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="mt-6 grid gap-y-4 text-sm text-primary-800">
          <div className="grid grid-cols-2 gap-y-4 [&>span:nth-child(even)]:text-right">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
            <span>Shipping</span>
            <span>
              {shippingMethod ? `$${shippingMethods[shippingMethod].price.toFixed(2)}` : "Calculated at checkout"}
            </span>
            <span>Taxes</span>
            <span>Calculated at checkout</span>
          </div>
          <hr className="block" />
          <div className="flex justify-between text-primary-900">
            <Label className="flex gap-2">
              <Checkbox checked={isProtected} onCheckedChange={setIsProtected} />
              Protect your package
            </Label>
            <span>${PROTECTION_PRICE}</span>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="flex justify-between text-xl font-bold">
          Total
          <span>${total.toFixed(2)}</span>
        </div>

        <Button variant="primary" className="mt-5 w-full" onClick={() => onSubmit(total)} disabled={disabled}>
          {buttonLabel}
        </Button>
      </div>
    </section>
  )
}

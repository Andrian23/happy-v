import React from "react"

import { useCartStore } from "@/stores/cart"

import { Button } from "../ui/Button"
// import { Checkbox } from "../ui/Checkbox"
// import { Label } from "../ui/Label"
//
// const PROTECTION_PRICE = 1.99

type OrderSummaryProps = {
  onSubmit: (total?: string) => void
  buttonLabel: string
  disabled?: boolean
  shippingMethods?: {
    code: string
    title: string
    handle: string
    estimatedCost: { amount: string; currency: string }
  }[]
  totalTaxAmount?: {
    amount: string
    currencyCode: string
  }
  total?: string
  subtotal?: string
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  onSubmit,
  buttonLabel,
  disabled,
  shippingMethods,
  totalTaxAmount,
  total,
  subtotal,
}) => {
  // const subtotal = useCartStore((state) =>
  //   state.products.reduce((acc, product) => acc + parseFloat(product.node.price) * product.amount, 0)
  // )
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  // const isProtected = useCartStore((state) => state.protected)
  // const setIsProtected = useCartStore((state) => state.setProtected)

  return (
    <section className="h-fit w-full rounded-xl bg-white text-primary-900 lg:col-span-2">
      <div className="border-b border-grey-400 p-4 lg:p-6">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="mt-6 grid gap-y-4 text-sm text-primary-800">
          <div className="grid grid-cols-2 gap-y-4 [&>span:nth-child(even)]:text-right">
            <span>Subtotal</span>
            <span>${subtotal ? parseFloat(subtotal).toFixed(2) : "0.00"}</span>
            <span>Shipping</span>
            <span>
              {shippingMethod
                ? `$${parseFloat(shippingMethods?.find((method) => method.code === shippingMethod)?.estimatedCost.amount ?? "0.00").toFixed(2)}`
                : "Calculated at checkout"}
            </span>
            <span>Taxes</span>
            <span>
              {totalTaxAmount ? `$${parseFloat(totalTaxAmount.amount).toFixed(2)}` : "Calculated at checkout"}
            </span>
          </div>
          {/*<hr className="block" />*/}
          {/*<div className="flex justify-between text-primary-900">*/}
          {/*  <Label className="flex gap-2">*/}
          {/*    <Checkbox checked={isProtected} onCheckedChange={setIsProtected} />*/}
          {/*    Protect your package*/}
          {/*  </Label>*/}
          {/*  <span>${PROTECTION_PRICE}</span>*/}
          {/*</div>*/}
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="flex justify-between text-xl font-bold">
          Total
          <span>${total ? parseFloat(total).toFixed(2) : 0}</span>
        </div>

        <Button variant="primary" className="mt-5 w-full" onClick={() => onSubmit(total)} disabled={disabled}>
          {buttonLabel}
        </Button>
      </div>
    </section>
  )
}

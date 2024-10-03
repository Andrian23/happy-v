import React from "react"

import Promo from "../OrderSummary/Promo"
import ProtectPackage from "../OrderSummary/ProtectPackage"
import { Button } from "../ui/Button"

export const OrderSummary = () => {
  return (
    <section className="h-fit w-full rounded-xl bg-white lg:col-span-2">
      <div className="w-full border-b border-grey-400 p-4">
        <div className="pb-4 text-xl font-semibold">Order Summary</div>
        {summary.map(({ title, value }, index) => (
          <div
            key={title}
            className={`flex justify-between text-sm text-grey-800 ${index === summary.length - 1 ? "border-b border-grey-400 pb-6 pt-2" : "py-2"}`}
          >
            <div>{title}</div>
            <div>{value}</div>
          </div>
        ))}
        <ProtectPackage handleProtectionClick={() => {}} />
        <Promo />
      </div>

      <div className="p-4">
        <div className="flex justify-between pt-4 text-xl font-semibold">
          <div>Total</div>
          <div>${(total + (isProtected ? 1.99 : 0)).toFixed(2)}</div>
        </div>

        <Button variant="primary" className="mt-5 w-full" disabled={products.length === 0} onClick={handleCheckout}>
          Checkout
        </Button>
      </div>
    </section>
  )
}

"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { ProductCartItem } from "@/components/cart/ProductCartItem"
import EmptyCart from "@/components/EmptyCart"
import Promo from "@/components/OrderSummary/Promo"
import ProtectPackage from "@/components/OrderSummary/ProtectPackage"
import { Button } from "@/components/ui/Button"
import { useCartStore } from "@/stores/cart"

export const Cart = () => {
  const products = useCartStore((state) => state.products)
  const total = useCartStore((state) =>
    state.products.reduce((acc, product) => acc + parseFloat(product.variants[0].price) * product.amount, 0)
  )
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProtected, setIsProtected] = useState(false)

  const summary = useMemo(
    () => [
      {
        title: "Subtotal",
        value: total.toFixed(2),
      },
      {
        title: "Shipping",
        value: "Calculated at checkout",
      },
      {
        title: "Taxes",
        value: "Calculated at checkout",
      },
    ],
    [total]
  )

  const handleCheckout = useCallback(() => {
    if (products.length === 0) return
    router.push("/shipping")
  }, [router, products])

  return (
    <>
      <section className="lg:col-span-3">
        <h2 className="text-xl font-semibold text-primary-900">Cart</h2>
        <div className="mt-3 grid gap-3 lg:mt-4 lg:gap-4">
          {products.length !== 0 && products.map((product) => <ProductCartItem key={product.id} product={product} />)}
        </div>
        {products.length === 0 && <EmptyCart />}
      </section>

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
    </>
  )
}

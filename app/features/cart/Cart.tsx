"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { OrderSummary } from "@/components/cart/OrderSummary"
import { ProductCartItem } from "@/components/cart/ProductCartItem"
import EmptyCart from "@/components/EmptyCart"
import { useCartStore } from "@/stores/cart"

export const Cart = () => {
  const products = useCartStore((state) => state.products)
  const router = useRouter()

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

      <OrderSummary onSubmit={handleCheckout} buttonLabel="Checkout" disabled={products.length === 0} />
    </>
  )
}

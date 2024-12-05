"use client"

import { OrderSummary } from "@/components/cart/OrderSummary"
import { ProductCartItem } from "@/components/cart/ProductCartItem"
import EmptyCart from "@/components/EmptyCart"
import { useCheckout } from "@/hooks/useCheckout"
import { useShopifyCartStore } from "@/stores/shopifyCart"

export const Cart = () => {
  const { cart } = useShopifyCartStore()
  const { handleCheckout } = useCheckout()
  const isCartEmpty = !cart || cart.lines.edges.length === 0

  const onCheckout = () => {
    if (!isCartEmpty) {
      handleCheckout(cart.id)
    }
  }

  return (
    <>
      <section className="lg:col-span-3">
        <h2 className="text-xl font-semibold text-primary-900">Cart</h2>
        <div className="mt-3 grid gap-3 lg:mt-4 lg:gap-4">
          {cart &&
            cart?.lines.edges.length > 0 &&
            cart.lines.edges.map((line) => <ProductCartItem key={line.node.id} product={line} />)}
        </div>
        {(!cart || cart.lines.edges.length === 0) && <EmptyCart />}
      </section>

      <OrderSummary
        onSubmit={onCheckout}
        buttonLabel="Checkout"
        disabled={!cart || cart.lines.edges.length === 0}
        total={cart?.cost?.subtotalAmount.amount || ""}
        subtotal={cart?.cost?.subtotalAmount.amount || ""}
      />
    </>
  )
}

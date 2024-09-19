"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import EmptyCart from "@/components/EmptyCart"
import Promo from "@/components/OrderSummary/Promo"
import ProtectPackage from "@/components/OrderSummary/ProtectPackage"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/Button"
import { useStorageChange } from "@/hooks"
import type { CartItem } from "@/interfaces/cart"
import { calculateTotalPrice } from "@/lib"
import { useCartStore } from "@/stores/cart"

export const Cart = () => {
  const products = useCartStore((state) => state.products)
  const router = useRouter()
  const [totalPrice, setTotalPrice] = useState(0)
  const [isProtected, setIsProtected] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleProtectionClick = () => {
    const newValue = !isProtected
    setIsProtected(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem("protected", newValue.toString())
    }
  }

  const handleCheckout = useCallback(() => {
    if (products.length === 0) return
    router.push("/shipping")
  }, [router, products])

  const handleCountChange = (productId: number, newCount: number) => {
    let updatedCartItems = cartItems.map((item) => (item.productId === productId ? { ...item, count: newCount } : item))

    // Filter out items with count 0
    updatedCartItems = updatedCartItems.filter((item) => item.count > 0)

    setCartItems(updatedCartItems)
    localStorage.setItem("cart", JSON.stringify(updatedCartItems))
    setTotalPrice(calculateTotalPrice(updatedCartItems))
  }

  const updateTotalPrice = useCallback(() => {
    if (typeof window !== "undefined") {
      const cartData = localStorage.getItem("cart")
      if (cartData) {
        const cartItems = JSON.parse(cartData)
        setTotalPrice(calculateTotalPrice(cartItems))
      }
    }
  }, [])

  useStorageChange(updateTotalPrice, true)

  const summary = [
    {
      title: "Subtotal",
      value: totalPrice.toFixed(2),
    },
    {
      title: "Shipping",
      value: "Calculated at checkout",
    },
    {
      title: "Taxes",
      value: "Calculated at checkout",
    },
  ]

  return (
    <>
      <section className="lg:col-span-3">
        <h2 className="text-xl font-semibold text-primary-900">Cart</h2>
        {products.length ? (
          products.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              count={product.amount}
              onCountChange={(productId, newCount) => handleCountChange(Number(productId), newCount)}
            />
          ))
        ) : (
          <EmptyCart />
        )}
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
          <ProtectPackage handleProtectionClick={handleProtectionClick} />
          <Promo />
        </div>

        <div className="p-4">
          <div className="flex justify-between pt-4 text-xl font-semibold">
            <div>Total</div>
            <div>${(totalPrice + (isProtected ? 1.99 : 0)).toFixed(2)}</div>
          </div>

          <Button variant="primary" className="mt-5 w-full" disabled={products.length === 0} onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </section>
    </>
  )
}

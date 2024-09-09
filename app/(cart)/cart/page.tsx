"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import EmptyCart from "@/components/EmptyCart"
import Loader from "@/components/Loader"
import Promo from "@/components/OrderSummary/Promo"
import ProtectPackage from "@/components/OrderSummary/ProtectPackage"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/Button"
import { useCart, useProductData, useStorageChange } from "@/hooks"
import type { CartItem } from "@/interfaces/cart"
import { calculateTotalPrice } from "@/lib"

const CartPage = () => {
  const router = useRouter()
  const [totalPrice, setTotalPrice] = useState(0)
  const [isProtected, setIsProtected] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { cartContent, listProductsId, emptyCart } = useCart(setTotalPrice, setIsProtected, setCartItems)

  const handleProtectionClick = () => {
    const newValue = !isProtected
    setIsProtected(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem("protected", newValue.toString())
    }
  }

  const handleCheckout = useCallback(() => {
    if (emptyCart) return
    router.push("/shipping")
  }, [router, emptyCart])

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

  const [productData] = useProductData(listProductsId)
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
    <div className="h-screen w-full">
      <div className="flex h-full w-full justify-between bg-grey-200 px-[10rem] py-[2rem] max-lg:block max-lg:px-[1rem]">
        <div className="h-[70%] w-[60%] max-lg:w-full">
          <div className="text-[20px] font-semibold text-primary-900">Cart</div>
          {cartContent ? (
            <>
              {productData ? (
                productData.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    count={cartItems.find((item) => item.productId === product.id)?.count || 0}
                    onCountChange={(productId, newCount) => handleCountChange(Number(productId), newCount)}
                  />
                ))
              ) : (
                <Loader />
              )}
            </>
          ) : (
            <Loader />
          )}
          {emptyCart ? <EmptyCart /> : <></>}
        </div>

        <div className="h-fit w-[35%] rounded-xl bg-white max-lg:mt-6 max-lg:w-full">
          <div className="h-[70%] w-full border-b border-grey-400 p-4">
            <div className="pb-4 text-[20px] font-semibold">Order Summary</div>
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
            <div className="flex justify-between pt-4 text-[20px] font-semibold">
              <div>Total</div>
              <div>${(totalPrice + (isProtected ? 1.99 : 0)).toFixed(2)}</div>
            </div>

            <Button variant="primary" className="mt-5 w-full" disabled={emptyCart} onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

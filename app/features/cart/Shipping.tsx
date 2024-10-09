"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import Breadcrumbs from "@/components/Breadcrumbs"
import OrderSummary from "@/components/OrderSummary"
import ShippingModal from "@/components/ShippingModal"
import ShippingVariant from "@/components/ShippingVariant"
import { Button } from "@/components/ui/Button"
import { useCart, useLocalStorage, useProductData, useStorageChange } from "@/hooks"
import type { CartItem } from "@/interfaces/cart"
import { handleCartItemsChange } from "@/lib"
import type { ShippingAddress } from "@/models/shipping"
import radioButtonIcon from "@/public/Radio_button.svg"

export const Shipping = () => {
  const router = useRouter()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isProtected, setIsProtected] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState(() => {
    if (typeof window !== "undefined") {
      const savedShipping = localStorage.getItem("shippingMethod")
      return savedShipping ? JSON.parse(savedShipping) : null
    }
    return null
  })

  const [cart] = useLocalStorage<CartItem[]>("cart", [])
  const [shippingAddress] = useLocalStorage<ShippingAddress | null>("shippingAddress", null)

  const { cartContent, listProductsId, totalCount } = useCart(setTotalPrice, setIsProtected)
  const [productData] = useProductData(listProductsId)
  useStorageChange(handleCartItemsChange(setTotalPrice))

  const handleModalToggle = () => setIsModalVisible(!isModalVisible)

  const handleShipping = useCallback(() => {
    if (!shippingAddress) return

    if (selectedShipping && typeof window !== "undefined") {
      localStorage.setItem("shippingMethod", JSON.stringify(selectedShipping))
    }

    router.push("/payment")
  }, [router, shippingAddress, selectedShipping])

  const handleShippingChange = (type: string, price: string) => {
    const newShipping = { type, price }
    setSelectedShipping(newShipping)
    if (typeof window !== "undefined") {
      localStorage.setItem("shippingMethod", JSON.stringify(newShipping))
    }
  }

  const handleProtectionClick = () => {
    const newValue = !isProtected
    setIsProtected(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem("protected", newValue.toString())
    }
  }

  return (
    <>
      {isModalVisible && <ShippingModal />}
      <section className="lg:col-span-3">
        <Breadcrumbs currentStep="shipping" />

        <div className="text-2xl font-semibold text-primary-900">Shipping address</div>

        {shippingAddress && (
          <div className="my-4 flex h-auto w-full items-start justify-start rounded-xl bg-white p-4">
            <Image src={radioButtonIcon} alt="Shipping" className="h-5 w-5" />
            <div className="ml-2 text-sm font-medium text-primary-900">
              <div>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </div>
              <div className="mt-1">
                {shippingAddress.address}, {shippingAddress.apartment}, {shippingAddress.city},{" "}
                {shippingAddress.province} {shippingAddress.postalCode}
              </div>
              <div className="mt-1">{shippingAddress.country}</div>
              <div className="mt-1">{shippingAddress.phone}</div>
            </div>
          </div>
        )}
        <Button variant="primary-outline" className="w-full gap-2" onClick={handleModalToggle}>
          <Plus />
          Add shipping address
        </Button>

        <div className="mt-10">
          <div className="text-2xl font-semibold text-primary-900">Shipping method</div>
          <div className="mt-4">
            <ShippingVariant
              id="standard"
              onClick={() => handleShippingChange("Standard (2-6 Days)", "$8.30")}
              isSelected={selectedShipping?.type === "Standard (2-6 Days)"}
              label="Standard (2-6 Days)"
              price="$8.30"
            />
            <ShippingVariant
              id="express"
              onClick={() => handleShippingChange("Express (1-2 Business Days)", "$12.30")}
              isSelected={selectedShipping?.type === "Express (1-2 Business Days)"}
              label="Express (1-2 Business Days)"
              price="$12.30"
              marginTop
            />
          </div>
        </div>
      </section>

      <section className="lg:col-span-2">
        <OrderSummary
          className="h-min"
          totalCount={totalCount}
          cartContent={cartContent}
          productData={productData}
          cart={cart}
          subtotal={totalPrice.toFixed(2)}
          shipping={selectedShipping ? selectedShipping.price : "Calculated at checkout"}
          taxes="$0.00"
          handleProtectionClick={handleProtectionClick}
        >
          <div className="p-4">
            <div className="flex justify-between pt-4 text-lg font-semibold">
              <div>Total</div>
              <div>
                $
                {(
                  totalPrice +
                  (isProtected ? 1.99 : 0) +
                  (selectedShipping ? parseFloat(selectedShipping.price.slice(1)) : 0)
                ).toFixed(2)}
              </div>
            </div>

            <Button variant="primary" className="mt-5 w-full" disabled={!shippingAddress} onClick={handleShipping}>
              To shipping
            </Button>
          </div>
        </OrderSummary>
      </section>
    </>
  )
}

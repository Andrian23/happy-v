"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import Breadcrumbs from "@/components/Breadcrumbs"
import { OrderSummary, shippingMethods } from "@/components/cart/OrderSummary"
import ShippingModal from "@/components/ShippingModal"
import ShippingVariant from "@/components/ShippingVariant"
import { Button } from "@/components/ui/Button"
import { useLocalStorage } from "@/hooks"
import type { ShippingAddress } from "@/models/shipping"
import radioButtonIcon from "@/public/Radio_button.svg"
import { useCartStore } from "@/stores/cart"

export const Shipping = () => {
  const router = useRouter()
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [shippingAddress] = useLocalStorage<ShippingAddress | null>("shippingAddress", null)

  const handleModalToggle = () => setIsModalVisible(!isModalVisible)

  const handleShipping = useCallback(() => {
    if (!shippingAddress || !shippingMethod) return

    router.push("/payment")
  }, [router, shippingAddress, shippingMethod])

  const handleShippingChange = (id: "standard" | "express") => {
    setShippingMethod(id)
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
          <div className="mt-4 grid gap-y-4">
            {Object.entries(shippingMethods).map(([id, { label, price }]) => (
              <ShippingVariant
                key={id}
                onClick={() => handleShippingChange(id as "standard" | "express")}
                isSelected={shippingMethod === id}
                label={label}
                price={price}
              />
            ))}
          </div>
        </div>
      </section>

      <OrderSummary
        onSubmit={handleShipping}
        disabled={!shippingAddress || !shippingMethod}
        buttonLabel="To shipping"
      />
    </>
  )
}

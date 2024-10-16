"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"

import { getShippingAddresses } from "@/actions/shippingAddress"
import Breadcrumbs from "@/components/Breadcrumbs"
import { OrderSummary, shippingMethods } from "@/components/cart/OrderSummary"
import SettingsShippingModal from "@/components/SettingsShippingModal"
import ShippingVariant from "@/components/ShippingVariant"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import type { ShippingAddress } from "@/models/shipping"
import { useAddressStore } from "@/stores/address"
import { useCartStore } from "@/stores/cart"

export const Shipping = () => {
  const router = useRouter()
  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])
  const { selectedShippingAddress, setShippingAddress } = useAddressStore()

  const { data } = useSession()

  const handleModalToggle = () => setIsModalVisible(!isModalVisible)

  const handleShipping = useCallback(() => {
    if (!selectedShippingAddress || !shippingMethod) return

    router.push("/payment")
  }, [router, selectedShippingAddress, shippingMethod])

  const handleShippingChange = (id: "standard" | "express") => {
    setShippingMethod(id)
  }

  useEffect(() => {
    const fetchShippingAddresses = async () => {
      try {
        const addresses = await getShippingAddresses()
        if (addresses.length > 0) {
          setShippingAddresses(addresses)
          setShippingAddress(addresses.find(({ id }) => id === data?.user.defaultShippingAddress) || addresses[0])
        }
      } catch (error) {
        console.error("Failed to fetch shipping addresses:", error)
      }
    }

    fetchShippingAddresses()
  }, [])

  return (
    <>
      {isModalVisible && <SettingsShippingModal onClose={handleModalToggle} setShippingData={setShippingAddresses} />}
      <section className="lg:col-span-3">
        <Breadcrumbs currentStep="shipping" />

        <div className="text-2xl font-semibold text-primary-900">Shipping address</div>

        <RadioGroup
          value={selectedShippingAddress?.id?.toString()}
          onValueChange={(value) =>
            setShippingAddress(shippingAddresses.find(({ id }) => id.toString() === value) as ShippingAddress)
          }
        >
          {!!shippingAddresses.length &&
            shippingAddresses.map(
              ({
                id,
                firstName,
                lastName,
                address,
                apartmentSuite,
                stateProvince,
                country,
                city,
                postalZipCode,
                phone,
              }) => (
                <div className="my-4 flex h-auto w-full items-start justify-start rounded-xl bg-white p-4" key={id}>
                  <RadioGroupItem value={id.toString()} id={`address-${id}`} />
                  <Label htmlFor={`address-${id}`}>
                    <div className="ml-3 text-sm font-medium text-primary-900">
                      <div>
                        {firstName} {lastName}
                      </div>
                      <div className="mt-1">
                        {address}, {apartmentSuite}, {city}, {stateProvince} {postalZipCode}
                      </div>
                      <div className="mt-1">{country}</div>
                      <div className="mt-1">{phone}</div>
                    </div>
                  </Label>
                </div>
              )
            )}
        </RadioGroup>
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
        disabled={!selectedShippingAddress || !shippingMethod}
        buttonLabel="To shipping"
      />
    </>
  )
}

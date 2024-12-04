"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"

import { updateShippingAddress, updateShippingMethod } from "@/actions/cart"
import { getShippingAddresses } from "@/actions/shippingAddress"
import Breadcrumbs from "@/components/Breadcrumbs"
import { OrderSummary } from "@/components/cart/OrderSummary"
import SettingsShippingModal from "@/components/SettingsShippingModal"
import ShippingVariant from "@/components/ShippingVariant"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { useShippingMethods } from "@/lib/useShippingMethods"
import type { ShippingAddress } from "@/models/shipping"
import { useAddressStore } from "@/stores/address"
import { useCartStore } from "@/stores/cart"

export const Shipping = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data } = useSession()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])

  const checkoutId = searchParams.get("checkoutId")

  const shippingMethod = useCartStore((state) => state.shippingMethod)
  const setShippingMethod = useCartStore((state) => state.setShippingMethod)
  const { selectedShippingAddress, setShippingAddress } = useAddressStore()

  const { shippingMethods, totalTaxAmount } = useShippingMethods(checkoutId, selectedShippingAddress)

  const handleModalToggle = () => setIsModalVisible(!isModalVisible)

  const updateAddress = async () => {
    if (!selectedShippingAddress || !data?.user?.email || !checkoutId) return

    const buyerIdentity = {
      email: data.user.email,
      deliveryAddressPreferences: [
        {
          deliveryAddress: {
            firstName: selectedShippingAddress.firstName,
            lastName: selectedShippingAddress.lastName,
            address1: selectedShippingAddress.address,
            address2: selectedShippingAddress.apartmentSuite || "",
            city: selectedShippingAddress.city,
            country: selectedShippingAddress.country,
            province: selectedShippingAddress.stateProvince,
            zip: selectedShippingAddress.postalZipCode,
            phone: selectedShippingAddress.phone,
          },
        },
      ],
    }

    try {
      await updateShippingAddress(checkoutId, buyerIdentity)
    } catch (error) {
      console.error("Error updating shipping address:", error)
    }
  }

  useEffect(() => {
    if (selectedShippingAddress) {
      updateAddress()
    }
  }, [selectedShippingAddress])

  const handleShipping = useCallback(async () => {
    if (!selectedShippingAddress || !shippingMethod || !checkoutId) return

    const deliveryOption = shippingMethods.find(({ code }) => code === shippingMethod)
    if (!deliveryOption) {
      console.error("Shipping method not found.")
      return
    }

    try {
      const result = await updateShippingMethod(checkoutId, [
        {
          deliveryOptionHandle: deliveryOption.handle,
          deliveryGroupId: deliveryOption.groupId,
        },
      ])

      if (result) {
        router.push(`/payment?checkoutId=${checkoutId}`)
      } else {
        console.error("Failed to update shipping method.")
      }
    } catch (error) {
      console.error("Error while updating shipping method:", error)
    }
  }, [router, selectedShippingAddress, shippingMethod, checkoutId, shippingMethods])

  const handleShippingChange = (id: string) => {
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
            {shippingMethods.map(({ code, title, estimatedCost, handle }) => (
              <ShippingVariant
                key={handle}
                onClick={() => handleShippingChange(code)}
                isSelected={shippingMethod === code}
                label={title || ""}
                price={estimatedCost?.amount || ""}
              />
            ))}
          </div>
        </div>
      </section>

      <OrderSummary
        onSubmit={handleShipping}
        disabled={!selectedShippingAddress || !shippingMethod}
        buttonLabel="To shipping"
        shippingMethods={shippingMethods}
        totalTaxAmount={totalTaxAmount}
      />
    </>
  )
}

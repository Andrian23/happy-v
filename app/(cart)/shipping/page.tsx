"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"

import { getShippingAddresses } from "@/actions/shippingAddress"
import Breadcrumbs from "@/components/Breadcrumbs"
import OrderSummary from "@/components/OrderSummary"
import SettingsShippingModal from "@/components/SettingsShippingModal"
import ShippingVariant from "@/components/ShippingVariant"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { useCart, useLocalStorage, useProductData, useStorageChange } from "@/hooks"
import type { CartItem } from "@/interfaces/cart"
import { handleCartItemsChange } from "@/lib"
import { ShippingAddress } from "@/models/shipping"
import { useAddressStore } from "@/stores/address"

const ShippingPage = () => {
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
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])

  const { data } = useSession()
  const [cart] = useLocalStorage<CartItem[]>("cart", [])
  const { cartContent, listProductsId, totalCount } = useCart(setTotalPrice, setIsProtected)
  const [productData] = useProductData(listProductsId)
  useStorageChange(handleCartItemsChange(setTotalPrice))

  const { selectedShippingAddress, setShippingAddress } = useAddressStore()

  const handleModalToggle = () => setIsModalVisible(!isModalVisible)

  const handleShipping = useCallback(() => {
    if (!selectedShippingAddress) return

    if (selectedShippingAddress && typeof window !== "undefined") {
      localStorage.setItem("shippingMethod", JSON.stringify(selectedShipping))
    }

    router.push("/payment")
  }, [router, selectedShippingAddress, selectedShipping])

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
    <div>
      {isModalVisible && <SettingsShippingModal onClose={handleModalToggle} setShippingData={setShippingAddresses} />}
      <Breadcrumbs currentStep="shipping" />
      <div className="flex h-screen w-full items-center justify-center max-lg:h-full">
        <div className="flex h-full w-full justify-between bg-grey-200 px-[10rem] py-[2rem] max-lg:block max-lg:px-[1rem]">
          <div className="h-[70%] w-[60%] max-lg:h-full max-lg:w-full">
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
          </div>

          <OrderSummary
            className="h-min max-lg:h-full"
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

              <Button
                variant="primary"
                className="mt-5 w-full"
                disabled={!shippingAddresses.length}
                onClick={handleShipping}
              >
                To shipping
              </Button>
            </div>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}

export default ShippingPage

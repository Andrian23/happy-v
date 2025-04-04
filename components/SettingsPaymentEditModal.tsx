"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"

import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"
import type { UserCard } from "@/interfaces/payment"
import type { ShippingAddress } from "@/models/shipping"

interface AddressSelectionProps {
  onClose: () => void
}

const AddressSelection: React.FC<AddressSelectionProps> = ({ onClose }) => {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)

  useEffect(() => {
    const address = localStorage.getItem("shippingAddress")
    if (address) {
      setShippingAddress(JSON.parse(address))
    }
  }, [])

  return (
    <div className="mt-4 rounded-lg py-1">
      <div className="mb-4 flex justify-start">
        <button
          className="text-primary-900 mt-2 w-fit cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
      <div className="mb-4 flex items-center">
        <input type="radio" id="address1" name="address" className="mr-2" />
        <label htmlFor="address1" className="text-primary-900">
          {shippingAddress && (
            <>
              <div className="font-semibold">{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</div>
              <div>{`${shippingAddress.address}, Apartment ${shippingAddress.apartmentSuite}, ${shippingAddress.city}, ${shippingAddress.stateProvince}, ${shippingAddress.country}, ${shippingAddress.postalZipCode}`}</div>
            </>
          )}
        </label>
      </div>
    </div>
  )
}

interface SettingsPaymentEditModalProps {
  onClose: () => void
}

const SettingsPaymentEditModal: React.FC<SettingsPaymentEditModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [isDefault, setIsDefault] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isAddressSelectionVisible, setIsAddressSelectionVisible] = useState(false)

  useEffect(() => {
    const address = localStorage.getItem("shippingAddress")
    if (address) {
      setShippingAddress(JSON.parse(address))
    }

    const userCard = localStorage.getItem("userCard")
    if (userCard) {
      const savedCard: UserCard = JSON.parse(userCard)
      setCardNumber(savedCard.cardNumber)
      setCardName(savedCard.cardName)
      setExpirationDate(savedCard.expirationDate)
      setCvc(savedCard.cvc)
      setIsDefault(savedCard.isDefault)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  const handleSaveCard = () => {
    const cardDetails = {
      cardNumber,
      cardName,
      expirationDate,
      cvc,
      isDefault,
    }
    localStorage.setItem("userCard", JSON.stringify(cardDetails))
    handleClose()
    window.location.reload()
  }

  const handleAddressChangeClick = () => {
    setIsAddressSelectionVisible(!isAddressSelectionVisible)
  }

  const handleAddressSelectionClose = () => {
    setIsAddressSelectionVisible(false)
  }

  return (
    <div className={`fixed inset-0 z-5 flex items-center justify-center bg-black/70 ${!isVisible ? "hidden" : ""}`}>
      <div className="w-[40rem] rounded-2xl bg-white shadow-lg max-md:w-full">
        <div className="border-grey-400 flex w-full items-center justify-between border-b p-[24px] max-md:p-[1.3rem]">
          <div className="text-primary-900 text-2xl font-semibold">Edit Payment Method</div>
          <X color="#25425D" onClick={handleClose} />
        </div>
        <div className="h-auto w-full p-[24px] max-md:p-[1.3rem]">
          <div className="my-2 h-auto w-full">
            <div className="text-primary-900 mb-2 text-sm font-medium">Card number</div>
            <Input
              type="text"
              placeholder="1234 1234 1234 1234"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="text-primary-900 mb-2 text-sm font-medium">Name on the card</div>
            <Input
              type="text"
              placeholder="Enter the name from the card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="w-[48%]">
              <div className="text-primary-900 mb-2 text-sm font-medium">Expiration date</div>
              <Input
                type="text"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="rounded-[12px]"
              />
            </div>
            <div className="w-[48%]">
              <div className="text-primary-900 mb-2 text-sm font-medium">CVC</div>
              <Input
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="rounded-[12px]"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Checkbox id="terms" checked={isDefault} onCheckedChange={(value) => setIsDefault(!!value)} />
            <div className="text-primary-900 ml-4 text-sm font-semibold">Set as a default card</div>
          </div>
          <div className="my-8">
            <div className="text-primary-900 text-lg font-semibold">Billing Address</div>
            {shippingAddress && (
              <div className="mt-4 text-sm">
                <div>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</div>
                <div>{`${shippingAddress.address}, ${shippingAddress.apartmentSuite}, ${shippingAddress.city}, ${shippingAddress.stateProvince}, ${shippingAddress.country}, ${shippingAddress.postalZipCode}`}</div>
                {!isAddressSelectionVisible && (
                  <div
                    className="text-primary-900 mt-2 w-fit cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm"
                    onClick={handleAddressChangeClick}
                  >
                    Change
                  </div>
                )}
                {isAddressSelectionVisible && <AddressSelection onClose={handleAddressSelectionClose} />}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end">
            <div
              className="bg-primary-500 cursor-pointer rounded-full px-4 py-2 text-sm text-white"
              onClick={handleSaveCard}
            >
              Save payment method
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPaymentEditModal

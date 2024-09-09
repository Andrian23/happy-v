"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"

import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"
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
          className="mt-2 w-fit cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm text-primary-900"
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
              <div>{`${shippingAddress.address}, Apartment ${shippingAddress.apartment}, ${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.country}, ${shippingAddress.postalCode}`}</div>
            </>
          )}
        </label>
      </div>
    </div>
  )
}

interface SettingsPaymentModalProps {
  onClose: () => void
}

const SettingsPaymentModal: React.FC<SettingsPaymentModalProps> = ({ onClose }) => {
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
    <div
      className={`fixed inset-0 z-[5] flex items-center justify-center bg-black bg-opacity-70 ${!isVisible ? "hidden" : ""}`}
    >
      <div className="w-[40rem] rounded-2xl bg-white shadow-lg max-md:w-full">
        <div className="flex w-full items-center justify-between border-b border-grey-400 p-[24px] max-md:p-[1.3rem]">
          <div className="text-2xl font-semibold text-primary-900">Add Payment Method</div>
          <X color="#25425D" onClick={handleClose} />
        </div>
        <div className="h-auto w-full p-[24px] max-md:p-[1.3rem]">
          <div className="my-2 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Card number</div>
            <Input
              type="text"
              placeholder="1234 1234 1234 1234"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Name on the card</div>
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
              <div className="mb-2 text-sm font-medium text-primary-900">Expiration date</div>
              <Input
                type="text"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="rounded-[12px]"
              />
            </div>
            <div className="w-[48%]">
              <div className="mb-2 text-sm font-medium text-primary-900">CVC</div>
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
            <div className="ml-4 text-sm font-semibold text-primary-900">Set as a default card</div>
          </div>
          <div className="my-8">
            <div className="text-lg font-semibold text-primary-900">Billing Address</div>
            {shippingAddress && (
              <div className="mt-4 text-sm">
                <div>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</div>
                <div>{`${shippingAddress.address}, ${shippingAddress.apartment}, ${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.country}, ${shippingAddress.postalCode}`}</div>
                {!isAddressSelectionVisible && (
                  <div
                    className="mt-2 w-fit cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm text-primary-900"
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
              className="cursor-pointer rounded-full bg-primary-500 px-4 py-2 text-sm text-white"
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

export default SettingsPaymentModal

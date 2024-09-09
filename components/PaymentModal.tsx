"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"

const PaymentModal = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  const handleClose = () => {
    setIsVisible(false)
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

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70 ${!isVisible ? "hidden" : ""}`}
    >
      <div className="w-[40rem] rounded-2xl bg-white shadow-lg max-md:w-full">
        <div className="flex w-full items-center justify-between border-b border-grey-400 p-8 max-md:p-[1.3rem]">
          <div className="text-2xl font-semibold text-[#25425D]">Add new card</div>
          <X color="#25425D" onClick={handleClose} />
        </div>
        <div className="h-auto w-full p-8 max-md:p-[1.3rem]">
          <div className="my-2 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-[#25425D]">Card number</div>
            <Input
              type="text"
              placeholder="1234 1234 1234 1234"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-[#25425D]">Name on the card</div>
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
              <div className="mb-2 text-sm font-medium text-[#25425D]">Expiration date</div>
              <Input
                type="text"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="rounded-[12px]"
              />
            </div>
            <div className="w-[48%]">
              <div className="mb-2 text-sm font-medium text-[#25425D]">CVC</div>
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
            <div className="ml-4 text-sm font-semibold text-[#25425D]">Set as a default credit card</div>
          </div>
          <div className="flex items-center justify-end">
            <div
              className="cursor-pointer rounded-full bg-[#6CB4DA] px-4 py-2 text-sm text-white"
              onClick={handleSaveCard}
            >
              Add card
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal

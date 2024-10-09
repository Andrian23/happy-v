"use client"

import React, { useState } from "react"
import { X } from "lucide-react"

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"

import { Button } from "./ui/Button"

const PaymentModal = () => {
  const [isVisible, setIsVisible] = useState(true)
  // const [cardNumber, setCardNumber] = useState("")
  // const [cardName, setCardName] = useState("")
  // const [expirationDate, setExpirationDate] = useState("")
  // const [cvc, setCvc] = useState("")
  // const [isDefault, setIsDefault] = useState(false)

  const elements = useElements()
  const stripe = useStripe()

  const handleClose = () => {
    setIsVisible(false)
  }

  // const handleSaveCard = () => {
  //   const cardDetails = {
  //     cardNumber,
  //     cardName,
  //     expirationDate,
  //     cvc,
  //     isDefault,
  //   }
  //   localStorage.setItem("userCard", JSON.stringify(cardDetails))
  //   handleClose()
  //   window.location.reload()
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
    })

    console.log(result)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70 ${!isVisible ? "hidden" : ""}`}
    >
      <div className="w-[40rem] rounded-2xl bg-white shadow-lg max-md:w-full">
        <div className="flex w-full items-center justify-between border-b border-grey-400 p-8 max-md:p-[1.3rem]">
          <div className="text-2xl font-semibold text-[#25425D]">Add new card</div>
          <X color="#25425D" onClick={handleClose} />
        </div>
        <div className="h-auto w-full p-8 max-md:p-[1.3rem]">
          <PaymentElement />

          <div className="mt-5 flex items-center justify-end">
            <Button type="submit" variant="primary">
              Add card
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PaymentModal

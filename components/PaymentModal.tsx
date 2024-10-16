"use client"

import React, { useCallback, useState } from "react"

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"

import { setDefaultPaymentMethod } from "@/actions/paymentIntent"

import { Button } from "./ui/Button"
import { Checkbox } from "./ui/Checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog"
import { Label } from "./ui/Label"

type PaymentModalProps = React.PropsWithChildren & {
  onPaymentAdded?: () => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ children, onPaymentAdded }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string>()
  const [isOpen, setIsOpen] = useState(false)
  const [isDefault, setIsDefault] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(undefined)

      if (!stripe || !elements) {
        return
      }

      const result = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      })

      if (result.error) {
        setError(result.error.message)
      } else {
        if (result.setupIntent?.status === "succeeded") {
          setIsOpen(false)
          onPaymentAdded?.()
          if (isDefault) {
            await setDefaultPaymentMethod(result.setupIntent.payment_method as string)
          }
        }
      }
    },
    [stripe, elements, onPaymentAdded, isDefault]
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-primary-900">
          <DialogTitle className="text-2xl font-bold text-primary-900">Add new card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <PaymentElement />

          <Label className="mt-5 flex gap-2">
            <Checkbox checked={isDefault} onCheckedChange={(value) => setIsDefault(!!value)} />
            Set as a default credit card
          </Label>
          {error && <p className="text-sm text-error-500">{error}</p>}
          <Button type="submit" variant="primary" className="ml-auto mt-3 flex" disabled={!stripe || !elements}>
            Add card
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentModal

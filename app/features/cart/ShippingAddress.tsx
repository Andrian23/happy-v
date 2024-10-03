import React from "react"

import { AddressElement } from "@stripe/react-stripe-js"

export const ShippingAddress = () => {
  return <AddressElement options={{ mode: "shipping" }} />
}

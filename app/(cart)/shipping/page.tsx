import { Suspense } from "react"

import { Shipping } from "@/app/features/cart/Shipping"

export default function ShippingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shipping />
    </Suspense>
  )
}

import { getPaymentMethods, setupIntent } from "@/actions/paymentIntent"
import { Payment } from "@/app/features/cart/Payment"

export default async function PaymentPage() {
  const { clientSecret } = await setupIntent()
  const { paymentMethods, defaultPaymentMethod } = await getPaymentMethods()

  return (
    <Payment
      clientSecret={clientSecret}
      initialPaymentMethods={paymentMethods}
      defaultPaymentMethod={defaultPaymentMethod}
    />
  )
}

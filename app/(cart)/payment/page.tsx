import { createPaymentIntent } from "@/actions/paymentIntent"
import { Payment } from "@/app/features/cart/Payment"

export default async function PaymentPage() {
  const { clientSecret } = await createPaymentIntent()

  return <Payment clientSecret={clientSecret} />
}

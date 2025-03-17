import { getOrderByOrderId } from "@/actions/order"
import { Confirmed } from "@/app/features/cart/Confirmed"

export default async function ConfirmedPage({ params }: { params: Promise<{ orderId: string }> }) {
  const orderId = (await params).orderId
  const order = await getOrderByOrderId(orderId)

  return <Confirmed order={order} />
}

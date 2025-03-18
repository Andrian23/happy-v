import { getOrderByOrderId } from "@/actions/order"
import { OrderDetails } from "@/app/features/orders/OrderDetails"

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const orderId = (await params).orderId
  const order = await getOrderByOrderId(orderId)

  return <OrderDetails order={order} />
}

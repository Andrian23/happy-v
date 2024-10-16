import { getOrderByOrderId } from "@/actions/order"
import { OrderDetails } from "@/app/features/orders/OrderDetails"

type Props = {
  params: { orderId: string }
}

export default async function OrderPage({ params }: Props) {
  const order = await getOrderByOrderId(params.orderId)

  return <OrderDetails order={order} />
}

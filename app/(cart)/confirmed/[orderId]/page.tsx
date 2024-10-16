import { getOrderByOrderId } from "@/actions/order"
import { Confirmed } from "@/app/features/cart/Confirmed"

type Props = {
  params: { orderId: string }
}

export default async function ConfirmedPage({ params }: Props) {
  const order = await getOrderByOrderId(params.orderId)

  return <Confirmed order={order} />
}

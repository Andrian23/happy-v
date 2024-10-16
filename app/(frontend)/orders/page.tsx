import { getOrderByUserId } from "@/actions/order"
import { OrdersList } from "@/app/features/orders/OrdersList"

export default async function OrdersPage() {
  const orders = await getOrderByUserId()

  return <OrdersList orders={orders} />
}

import { getOrdersByUserId, getTopOrderedProducts } from "@/actions/order"
import { Dashboard } from "@/app/features/dashboard/Dashboard"
import { defaultEarnings } from "@/mock-data/dashboardData"

export default async function DashboardPage() {
  const orders = await getOrdersByUserId(1, 10)
  const topOrderedProducts = await getTopOrderedProducts()

  return <Dashboard orders={orders} topOrderedProducts={topOrderedProducts} earnings={defaultEarnings} />
}

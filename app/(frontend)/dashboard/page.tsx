import { getOrderByUserId, getTopOrderedProducts } from "@/actions/order"
import { getRecommendationByUser } from "@/actions/recommendation"
import { Dashboard } from "@/app/features/dashboard/Dashboard"

export default async function DashboardPage() {
  const orders = await getOrderByUserId()
  const recommendations = await getRecommendationByUser()
  const topOrderedProducts = await getTopOrderedProducts()

  return <Dashboard orders={orders} recommendations={recommendations} topOrderedProducts={topOrderedProducts} />
}

import { getOrderByUserId } from "@/actions/order"
import { getRecommendationByUser } from "@/actions/recommendation"
import { Dashboard } from "@/app/features/dashboard/Dashboard"

export default async function DashboardPage() {
  const orders = await getOrderByUserId()
  const recommendations = await getRecommendationByUser()

  return <Dashboard orders={orders} recommendations={recommendations} />
}

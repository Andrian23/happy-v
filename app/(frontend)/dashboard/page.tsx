"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { getOrderByUserId } from "@/actions/order"
import { getRecommendationByUser } from "@/actions/recommendation"
import { CountCard } from "@/components/CountCard"
import { ListContainer } from "@/components/ListContainer"
import { OrdersTable } from "@/components/OrdersTable"
import PageTopic from "@/components/PageTopic"
import { RecommendationsTable } from "@/components/RecommendationsTable"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import type { Order } from "@/models/order"
import type { Product } from "@/models/product"
import type { Recommendation } from "@/models/recommendation"
import bagIcon from "@/public/Bag.svg"
import cardIcon from "@/public/Card.svg"
import cursorIcon from "@/public/Cursor.svg"
import dollarIcon from "@/public/Dollar.svg"

type ProductCount = { [key in Product["title"]]: Product }

const earnings = [
  {
    title: "Total Net Sale",
    icon: dollarIcon,
    count: 0,
    prefix: "$",
    alt: "dollar sign icon",
  },
  {
    title: "Current Estimated Earnings",
    icon: cardIcon,
    count: 0,
    prefix: "$",
    alt: "credit card icon",
  },
]

const analytics = [
  {
    title: "Total Orders",
    icon: cursorIcon,
    count: 0,
    alt: "cursor icon",
  },
  {
    title: "Total Products",
    icon: cardIcon,
    count: 0,
    alt: "credit card icon",
  },
  {
    title: "Total Recommendations",
    icon: bagIcon,
    count: 0,
    alt: "shopping bag icon",
  },
]

const terms = [
  {
    title: "50%",
    description: "Earn commission on the first month of a product subscription",
  },
  {
    title: "30%",
    description: "Earn commission on one-time purchases",
  },
  {
    title: "30%",
    description: "Off wholesale products",
  },
]

const DashboardPage = () => {
  const [isHidden, setIsHidden] = useState(false)
  const [period, setPeriod] = useState("last_month")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orders, setOrders] = useState<Order[]>([])
  const [productCounts, setProductCounts] = useState<ProductCount>({})

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrderByUserId()
      setOrders(data)

      const counts: ProductCount = {}
      data.forEach((order) => {
        order.products?.forEach((product) => {
          if (counts[product.title]) {
            counts[product.title].count += product.count
          } else {
            counts[product.title] = { ...product, count: product.count }
          }
        })
      })
      setProductCounts(counts)
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    async function fetchOrdersAndRecommendations() {
      const [ordersData, recommendationsData] = await Promise.all([getOrderByUserId(), getRecommendationByUser()])
      setOrders(ordersData)
      setRecommendations(recommendationsData)

      const counts: ProductCount = {}
      ordersData.forEach((order) => {
        order.products?.forEach((product) => {
          if (counts[product.title]) {
            counts[product.title].count += product.count
          } else {
            counts[product.title] = { ...product, count: product.count }
          }
        })
      })
      setProductCounts(counts)
    }

    fetchOrdersAndRecommendations()
  }, [])

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <div className="block">
        <PageTopic name="Dashboard">
          <Select value={period} onValueChange={setPeriod} defaultValue="last_month">
            <SelectTrigger className="max-w-32 font-medium max-lg:ml-auto lg:mr-auto lg:min-w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="last_month">Last 30 days</SelectItem>
                <SelectItem value="this_year">This year</SelectItem>
                <SelectItem value="all_time">All time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </PageTopic>

        {!isHidden && (
          <div className="mt-5 h-auto w-full rounded-2xl bg-primary-100 p-6">
            <div className="flex w-full items-center justify-between">
              <div className="text-xl font-semibold text-primary-900 max-lg:text-lg">
                The best terms of cooperation for you
              </div>
              <X className="cursor-pointer text-grey-800" onClick={() => setIsHidden(true)} />
            </div>

            <ul className="m-0 mt-4 grid gap-2 p-0 lg:mt-7 lg:grid-cols-3 lg:gap-8">
              {terms.map(({ title, description }) => (
                <li key={description} className="flex items-center gap-2 text-primary-900 lg:gap-3">
                  <div className="text-xl font-bold lg:text-3xl">{title}</div>
                  <div className="text-sm font-medium">{description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-2 lg:gap-6">
          {earnings.map(({ title, icon, alt, count, prefix }) => (
            <CountCard
              key={title}
              title={title}
              icon={<Image src={icon} alt={alt} width={24} height={24} />}
              count={count}
              prefix={prefix}
            />
          ))}
        </div>

        <ListContainer
          title="My top ordered products"
          linkLabel="View My Orders"
          description="Lets make your first purchase"
          href="/orders"
          buttonLabel="To Wholesale Products"
          className="mt-4 lg:mt-6"
        >
          {Object.values(productCounts).length > 0 ? <OrdersTable products={Object.values(productCounts)} /> : null}
        </ListContainer>

        <ListContainer
          title="Purchases from recommendations"
          linkLabel="View Recommendations"
          description="Send your first recommendation"
          href="/recommendations"
          buttonLabel="To Recommendations"
          className="mt-4 lg:mt-6"
        >
          {recommendations.length > 0 ? <RecommendationsTable recommendations={recommendations} /> : null}
        </ListContainer>

        <ListContainer
          title="Purchases from affiliate links"
          linkLabel="View Affiliate Links"
          description="Share your affiliate link with clients"
          href="/affiliate"
          buttonLabel="To Affiliate Links"
          className="mt-4 lg:mt-6"
        />

        <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-3 lg:gap-6">
          {analytics.map(({ title, icon, alt, count }) => (
            <CountCard
              key={title}
              title={title}
              icon={<Image src={icon} alt={alt} width={24} height={24} />}
              count={count}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

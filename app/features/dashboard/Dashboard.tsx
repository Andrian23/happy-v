"use client"

import { useState } from "react"
import localFont from "next/font/local"
import { X } from "lucide-react"

import { ChartCard, ChartCardFormattedData } from "@/components/ChartCard"
import LineChart from "@/components/charts/LineChart"
import { ListContainer } from "@/components/ListContainer"
import PageTopic from "@/components/PageTopic"
import { ProductsTable } from "@/components/ProductsTable copy"
import { ReferralOrdersTable } from "@/components/ReferralOrdersTable"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { CardPaginationData } from "@/interfaces/pagination"
import { terms } from "@/mock-data/dashboardData"
import type { Order } from "@/models/order"
import type { ShopifyProduct } from "@/models/product"

const perfectlyNineties = localFont({
  src: "../../../public/fonts/perfectly-nineties-regular.otf",
  variable: "--font-perfectly-nineties",
})

type DashboardProps = {
  earnings: ChartCardFormattedData[]
  orders: { orders: Order[]; pagination?: CardPaginationData }
  topOrderedProducts: { product: ShopifyProduct; quantity: number }[]
}

export const Dashboard: React.FC<DashboardProps> = ({
  earnings = [],
  orders = { orders: [] },
  topOrderedProducts = [],
}) => {
  const [isHidden, setIsHidden] = useState(false)
  const [period, setPeriod] = useState("last_month")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [commissionRate, setCommissionRate] = useState(0)

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
          <div className="mt-5 h-auto w-full rounded-2xl bg-gradient-to-br from-[#E5F3FF] to-[#A7CDED] p-6">
            <div className="flex w-full items-center justify-between">
              <div className="text-primary-900 w-full text-left text-xl font-semibold uppercase max-lg:text-lg lg:text-center">
                The best terms of cooperation for you!
              </div>
              <X className="text-primary-900 cursor-pointer" onClick={() => setIsHidden(true)} />
            </div>

            <ul className="m-0 mt-4 grid gap-2 p-0 lg:mt-7 lg:grid-cols-3 lg:gap-20">
              {terms.map(({ title, description }) => (
                <li
                  key={description}
                  className="text-primary-900 flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:gap-3 xl:text-balance xl:not-first:ps-12"
                >
                  <div className={`text-3xl font-medium lg:text-[2.375rem] ${perfectlyNineties.className}`}>
                    {title}
                  </div>
                  <div className="text-sm font-medium">{description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:mt-6 lg:grid-cols-2 lg:gap-6">
          <div className="flex w-full flex-col gap-4 lg:gap-6">
            {earnings?.map(
              ({ title, tabs, count, prefix, data, differenceFromPreviousPeriod, differenceArrow, tooltip }) => (
                <ChartCard
                  key={title}
                  title={title}
                  tabs={tabs}
                  count={count}
                  prefix={prefix}
                  differenceArrow={differenceArrow}
                  differenceFromPreviousPeriod={differenceFromPreviousPeriod}
                  tooltip={tooltip}
                >
                  {data ? <LineChart data={data} /> : null}
                </ChartCard>
              )
            )}
          </div>

          <ListContainer
            title="Orders from affiliate links"
            description="No historical data available"
            href="/orders"
            innerHref="/products"
            count={0}
            tooltip="The number of client orders placed through your affiliate links. Each order may contain multiple products. This metric helps track the effectiveness of your shared links."
            pagination={orders.pagination}
          >
            {orders?.orders?.length > 0 ? (
              <ReferralOrdersTable orders={orders.orders} commissionRate={commissionRate} />
            ) : null}
          </ListContainer>
        </div>

        <ListContainer
          title="Products sold from affiliate links"
          description="No historical data available"
          href="/orders"
          innerHref="/products"
          count={0}
          className="mt-4 lg:mt-6"
          differenceFromPreviousPeriod=""
          differenceArrow={false}
          tabs={["All", "One-time", "Subscription"]}
          tooltip="The total number of individual products sold through your affiliate links."
        >
          {topOrderedProducts?.length > 0 ? (
            <ProductsTable products={topOrderedProducts} commissionRate={commissionRate} />
          ) : null}
        </ListContainer>
      </div>
    </div>
  )
}

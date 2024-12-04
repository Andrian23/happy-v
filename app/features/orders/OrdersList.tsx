"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"

import CustomSearchInput from "@/components/CustomSearchInput"
import EmptyOrder from "@/components/EmptyOrder"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import formatText from "@/lib/format-text"
import getStatusStyle, { FulfillmentStatus } from "@/lib/get-status-style"
import { highlightText } from "@/lib/highlightText"
import { Order } from "@/models/order"

const tabs = ["All", "Fulfilled", "Unfulfilled"]

type OrdersListProps = {
  orders: Order[]
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  const [activeItem, setActiveItem] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<string>("all")

  const filteredOrders = useMemo(() => {
    const fulfillmentStatuses: Record<number, FulfillmentStatus | "all"> = {
      1: "FULFILLED",
      2: "UNFULFILLED",
      0: "all",
    }

    const status = fulfillmentStatuses[activeItem] ?? "all"

    return status === "all" ? orders : orders.filter((order) => order.displayFulfillmentStatus === status)
  }, [activeItem, orders])

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="My Orders" description="View all your wholesale orders in one place" />
      <div className="main-products mt-5">
        <div className="flex w-full flex-col justify-between gap-2 lg:flex-row lg:items-center">
          <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />
          <div className="filter-items-second flex max-md:mt-2 max-md:block">
            <div className="flex">
              <CustomSearchInput
                value={searchTerm}
                placeholder="Search orders"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative z-[4] ml-2 max-md:ml-0 max-md:mt-2">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px] rounded-[12px] border-grey-400 max-md:w-full">
                  <SelectValue placeholder="For all times" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">For all times</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                    <SelectItem value="last-month">Last month</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      {
        <>
          {orders.length === 0 && <EmptyOrder />}
          {filteredOrders.length > 0 && (
            <div className="mt-4">
              {orders?.map((order) => {
                const products = order.lineItems

                return (
                  <Link href={`/orders/${order.id.replace("gid://shopify/Order/", "")}`} key={order.id}>
                    <div className="my-2 flex h-full w-full items-center justify-between rounded-2xl bg-grey-200 p-2 text-sm max-md:block max-md:p-4">
                      <div>
                        <div className="flex flex-row gap-2 text-primary-900 md:flex-col md:gap-0 lg:flex-row lg:gap-2">
                          <div className="font-semibold">
                            Order: {highlightText(order.id.replace("gid://shopify/Order/", ""), searchTerm)}
                          </div>
                          <div>from {format(order.createdAt, "MMM d, yyyy")}</div>
                        </div>
                        <div className="mt-1 flex">
                          {order.displayFinancialStatus === "PAID" ? (
                            <div className="text-green-100">{formatText(order.displayFinancialStatus)}</div>
                          ) : (
                            <div className="text-error-500">{formatText(order.displayFinancialStatus)}</div>
                          )}
                          <div className="mx-1 text-grey-400">•</div>
                          {order.displayFulfillmentStatus !== null ? (
                            <div className={`${getStatusStyle(order.displayFulfillmentStatus).color}`}>
                              {getStatusStyle(order.displayFulfillmentStatus).text}
                            </div>
                          ) : (
                            <div className="text-error-500">No Status</div>
                          )}
                        </div>
                      </div>
                      <div className="flex w-3/5 justify-between max-md:mt-2 max-md:w-full lg:w-1/2">
                        <div className="flex items-center justify-center gap-3">
                          {products.edges?.map((item, index) =>
                            item.node.product.images.edges[0]?.node?.src ? (
                              <Image
                                key={index}
                                src={item.node.product.images.edges[0].node.src}
                                alt={item.node.product.images.edges[0].node.altText ?? ""}
                                width={52}
                                height={52}
                              />
                            ) : null
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs uppercase text-grey-800">Total</div>
                            <div className="text-primary-900">${order.totalPrice}</div>
                          </div>
                          <div className="ml-4">
                            <ChevronRight width={30} height={70} color="#25425D" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      }
    </div>
  )
}

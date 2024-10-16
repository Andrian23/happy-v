"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"

import CustomSearchInput from "@/components/CustomSearchInput"
import EmptyOrder from "@/components/EmptyOrder"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { highlightText } from "@/lib/highlightText"
import { Order } from "@/models/order"
import type { Product } from "@/models/product"

const tabs = ["All", "Fulfilled", "Unfulfilled"]

type OrdersListProps = {
  orders: Order[]
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  const [activeItem, setActiveItem] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<string>("all") // State to track selected sort option

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="My Orders" description="View all your wholesale orders in one place" />
      <div className="main-products mt-5">
        <div className="flex w-full items-center justify-between max-md:block">
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
          {orders.length > 0 && (
            <div className="mt-4">
              {orders?.map((order) => {
                const products = JSON.parse(order?.products as unknown as string) as Product[]

                return (
                  <Link href={`/orders/${order.id}`} key={order.id}>
                    <div className="my-2 flex h-full w-full items-center justify-between rounded-2xl bg-grey-200 p-2 text-sm max-md:block max-md:p-4">
                      <div className="">
                        <div className="flex text-primary-900">
                          <div className="font-semibold">Order: {highlightText(order.id.toString(), searchTerm)} •</div>
                          <div className="ml-2">from {format(order.createdAt, "MMM d, yyyy")}</div>
                        </div>
                        <div className="mt-1 flex">
                          {order.financial_status === "paid" ? (
                            <div className="text-[#09BD30]">Paid</div>
                          ) : (
                            <div className="text-error-500">Refunded</div>
                          )}
                          <div className="mx-1 text-grey-400">•</div>
                          {order.fulfillment_status !== null ? (
                            <div className="text-[#09BD30]">Fulfilled</div>
                          ) : (
                            <div className="text-error-500">Unfulfilled</div>
                          )}
                        </div>
                      </div>
                      <div className="flex w-[50%] justify-between max-md:mt-2 max-md:w-full">
                        <div className="flex items-center justify-center">
                          {products?.map((product, index) => (
                            <Image
                              key={index}
                              src={product.images[0].src}
                              alt="OrderImg"
                              width={60}
                              height={60}
                              className="mx-2"
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="">
                            <div className="text-xs uppercase text-grey-800">Total</div>
                            <div className="mt-1 text-primary-900">${order.totalPrice.toFixed(2)}</div>
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

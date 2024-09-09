"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BeatLoader } from "react-spinners"

import { getOrderByUserId } from "@/actions/order"
import CustomSearchInput from "@/components/CustomSearchInput"
import EmptyOrder from "@/components/EmptyOrder"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { highlightText } from "@/lib/highlightText"
import { Order } from "@/models/order"

type SortOptions = "all" | "last-year" | "last-month" | "recent"

const tabs = ["All", "Fulfilled", "Unfulfilled"]

const OrdersPage = () => {
  const [activeItem, setActiveItem] = useState(0)
  const [ordersNew, setOrdersNew] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOptions>("all") // State to track selected sort option

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getOrderByUserId()
      console.log(orders)
      setOrdersNew(orders)
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  let filteredOrders = ordersNew?.filter(
    (order) => typeof order.id === "number" && order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (activeItem === 1) {
    // Fulfilled
    filteredOrders = filteredOrders?.filter((order) => order.fulfillment_status !== null)
  } else if (activeItem === 2) {
    // Unfulfilled
    filteredOrders = filteredOrders?.filter((order) => order.fulfillment_status == null)
  }

  const handleSortChange = (value: SortOptions) => {
    setSortOption(value)
  }

  // Sorting based on selected option
  const now = new Date()
  if (sortOption === "recent") {
    filteredOrders = filteredOrders?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortOption === "last-year") {
    filteredOrders = filteredOrders
      ?.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortOption === "last-month") {
    filteredOrders = filteredOrders
      ?.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else {
    filteredOrders = filteredOrders?.sort((a) => (a.fulfillment_status === null ? 1 : -1))
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="My Orders" description="View all your wholesale orders in one place" />
      <div className="main-products mt-5">
        <div className="flex w-full items-center justify-between max-md:block">
          <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />
          <div className="filter-items-second flex max-md:mt-2 max-md:block">
            <div className="flex">
              <CustomSearchInput value={searchTerm} placeholder="Search orders" onChange={handleInputChange} />
            </div>
            <div className="relative z-[4] ml-2 max-md:ml-0 max-md:mt-2">
              <Select onValueChange={handleSortChange}>
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
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <BeatLoader />
        </div>
      ) : (
        <>
          {!ordersNew.length && (
            <>
              <EmptyOrder />
            </>
          )}
          {ordersNew.length > 0 && (
            <div className="mt-4">
              {filteredOrders?.map((order) => (
                <Link href={`/orders/${order.id}`} key={order.id}>
                  <div className="my-2 flex h-full w-full items-center justify-between rounded-2xl bg-grey-200 p-2 text-sm max-md:block max-md:p-4">
                    <div className="">
                      <div className="flex text-primary-900">
                        <div className="font-semibold">Order: {highlightText(order.id.toString(), searchTerm)} •</div>
                        <div className="ml-2">from {formatDate(order.createdAt)}</div>
                      </div>
                      <div className="mt-1 flex">
                        {order.financial_status === "paid" ? (
                          <div className="text-[#09BD30]">Paid</div>
                        ) : (
                          <div className="text-[#FF3C3C]">Refunded</div>
                        )}
                        <div className="mx-1 text-grey-400">•</div>
                        {order.fulfillment_status !== null ? (
                          <div className="text-[#09BD30]">Fulfilled</div>
                        ) : (
                          <div className="text-[#FF3C3C]">Unfulfilled</div>
                        )}
                      </div>
                    </div>
                    <div className="flex w-[50%] justify-between max-md:mt-2 max-md:w-full">
                      <div className="flex items-center justify-center">
                        {order.products?.map((product, index) => (
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
                          <div className="mt-1 text-primary-900">
                            $
                            {(
                              parseFloat(order.totalPrice) + parseFloat(order.shippingMethod.price.replace("$", ""))
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <ChevronRight width={30} height={70} color="#25425D" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OrdersPage

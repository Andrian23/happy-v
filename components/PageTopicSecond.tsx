"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"

import type { CartItem } from "@/interfaces/cart"
import cartIcon from "@/public/Cart.svg"

interface PageTopicSecondProps {
  link: string
  name: string
  description?: string
  enable: boolean
}

const PageTopicSecond: React.FC<PageTopicSecondProps> = (props) => {
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days")

  const pathname = usePathname()
  const isSuperAdminPage = pathname.startsWith("/super-admin")

  useEffect(() => {
    const cartData = localStorage.getItem("cart")
    if (cartData) {
      const cartItems: CartItem[] = JSON.parse(cartData)
      const totalCount = cartItems.reduce((total, item) => total + item.count, 0)
      setTotalItemCount(totalCount)
    } else {
      setTotalItemCount(0)
    }
  }, [])

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center max-md:w-[100%] max-md:justify-between">
          <Link href={props.link} className="flex cursor-pointer items-center justify-start">
            <ArrowLeft className="mr-[8px] h-[20px] w-[20px]" color="#7C8E9E" />
            <div className="text-sm font-normal text-[#7F85A4]">{props.name}</div>
          </Link>
          {props.enable ? (
            <div className="relative z-[-4]">
              <div
                className={`ml-2 border px-[12px] py-[8px] ${dropdownOpen ? "border-primary-500" : "border-grey-400"} flex w-fit items-center justify-between rounded-xl`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="text-md text-primary-900 font-medium">{selectedPeriod}</div>
                {dropdownOpen ? (
                  <ChevronUp className="ml-[12px] cursor-pointer" color="#25425D" />
                ) : (
                  <ChevronDown className="ml-[12px] cursor-pointer" color="#25425D" />
                )}
              </div>
              {dropdownOpen && (
                <div className="absolute mt-2 w-[180px] rounded-xl bg-white px-4 py-2 shadow-xl">
                  <div
                    className="my-2 cursor-pointer"
                    onClick={() => {
                      setSelectedPeriod("Last 30 days")
                      setDropdownOpen(false)
                    }}
                  >
                    Last 30 days
                  </div>
                  <div
                    className="my-2 cursor-pointer"
                    onClick={() => {
                      setSelectedPeriod("This year")
                      setDropdownOpen(false)
                    }}
                  >
                    This year
                  </div>
                  <div
                    className="my-2 cursor-pointer"
                    onClick={() => {
                      setSelectedPeriod("All time")
                      setDropdownOpen(false)
                    }}
                  >
                    All time
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="relative block h-12 w-8 max-md:hidden">
          {!isSuperAdminPage && (
            <Link href="/cart">
              <Image src={cartIcon} alt="Cart" className="absolute top-[5px] right-[5px] h-[25px] w-[25px]" />
              <div className="bg-primary-500 absolute top-0 right-0 z-2 h-[14px] w-[14px] rounded-full"></div>
              <div className="absolute top-[-1px] right-[1px] z-3 rounded-full px-[3px] text-[10px] text-white">
                {totalItemCount}
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="text-gray-400 max-md:text-xs">{props.description}</div>
    </>
  )
}

export default PageTopicSecond

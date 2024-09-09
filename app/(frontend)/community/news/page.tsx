"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Tabs } from "@/components/Tabs"
import { CartItem } from "@/interfaces/cart"
import cartIcon from "@/public/Cart.svg"
import newsMiniIcon from "@/public/NewsMini.svg"

const CommunityNewsPage = () => {
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [activeItem, setActiveItem] = useState(0)
  const tabs = useMemo(() => [`Latest (${totalItemCount})`, "Top"], [totalItemCount])

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
    <div className="m-[10px] w-[98%] max-md:m-0">
      <div className="flex h-auto w-full items-center justify-between">
        <Link href="/community">
          <div className="flex items-center justify-start">
            <ArrowLeft width={20} height={20} color="#7F85A4" />
            <div className="ml-2 text-sm text-[#7F85A4]">Back to community forum</div>
          </div>
        </Link>

        <div className="relative block h-12 w-8 max-md:hidden">
          <Link href="/cart">
            <Image src={cartIcon} alt="Cart" className="absolute right-[5px] top-[5px] h-[25px] w-[25px]" />
            <div className="absolute right-0 top-0 rounded-full bg-primary-500 px-[3px] py-[1px] text-xs text-white">
              {totalItemCount}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-8 flex h-auto w-full items-center justify-center rounded-2xl bg-grey-200 px-8 py-12">
        <div className="">
          <div className="text-center text-3xl font-semibold text-primary-900">News from Happy V</div>
          <div className="mt-2 text-center text-sm text-grey-800">See latest news from Happy V</div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between max-lg:block">
        <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />
      </div>
      <div className="mt-4">
        <div className="my-4 flex h-auto w-full items-center justify-between rounded-xl bg-grey-200 p-4">
          <div className="">
            <div className="flex items-center justify-start">
              <div className="h-[40px] w-[40px] rounded-full bg-slate-500"></div>
              <div className="ml-2">
                <div className="text-sm text-primary-900">Happy V team</div>
                <div className="flex items-center justify-start">
                  <Image src={newsMiniIcon} alt="AskMini" className="h-[15px] w-[15px]" />
                  <div className="ml-2 text-xs text-grey-800">News from Happy V</div>
                </div>
              </div>
            </div>
            <div className="text-md mt-3 font-medium text-primary-900">
              What do you think about new Happy V products?
            </div>
          </div>
          <div className="flex items-center justify-start">
            <div className="flex items-center justify-start"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityNewsPage

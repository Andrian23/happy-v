"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

import listOrdersLogo from "@/public/List-orders.svg"

const EmptyOrder: React.FC = () => {
  return (
    <div className="main-orders mt-2 flex h-screen w-full items-center justify-center">
      <div className="empty-block">
        <div className="block">
          <div className="flex items-center justify-center">
            <div className="flex h-[6rem] w-[6rem] items-center justify-center rounded-full bg-grey-200">
              <Image src={listOrdersLogo} alt="Logo" className="h-[50px] w-[50px]" />
            </div>
          </div>
          <div className="flex w-full items-center justify-center rounded-xl bg-white text-center">
            <div className="my-8 block">
              <div className="my-1 text-[16px] font-bold text-primary-900">It&apos;s still empty here</div>

              <div className="my-1 text-sm text-[#576b7d99]">Make your first purchase</div>
              <Link href="/products">
                <div className="my-2 cursor-pointer rounded-3xl bg-primary-500 px-[16px] py-[8px] text-sm font-semibold text-white">
                  Wholesale products
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyOrder

"use client"

import React from "react"
import Image from "next/image"

import listOrdersLogo from "@/public/List-orders.svg"

const EmptyRequest: React.FC = () => {
  return (
    <div className="main-requests mt-2 flex h-[calc(100vh-100px)] w-full items-center justify-center">
      <div className="empty-block">
        <div className="block">
          <div className="flex items-center justify-center">
            <div className="bg-grey-200 flex h-[6rem] w-[6rem] items-center justify-center rounded-full">
              <Image src={listOrdersLogo} alt="Logo" className="h-[50px] w-[50px]" />
            </div>
          </div>
          <div className="flex w-full items-center justify-center rounded-xl bg-white text-center">
            <div className="my-4 block">
              <div className="text-primary-900 my-1 text-[16px] font-bold">There are no requests yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyRequest

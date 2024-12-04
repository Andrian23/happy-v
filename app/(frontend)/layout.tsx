import React from "react"

import CartInitializer from "@/app/features/cart/CartInitializer"
import MenuMobile from "@/components/MenuMobile"
import Sidebar from "@/components/Sidebar"

export default function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MenuMobile />
      <div className="m-[14px] flex">
        <div className="fixed mr-[42px] h-[97%] w-[301px] max-md:hidden">
          <Sidebar />
        </div>
        <div className="ml-auto block w-[calc(100%-323px)] max-md:w-[100%]">
          <CartInitializer />
          {children}
        </div>
      </div>
    </>
  )
}

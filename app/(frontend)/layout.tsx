import React from "react"

import CartInitializer from "@/app/features/cart/CartInitializer"
import { auth } from "@/auth"
import MenuMobile from "@/components/sidebar/MenuMobile"
import Sidebar from "@/components/sidebar/Sidebar"

export default async function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <>
      <MenuMobile isAdmin={isAdmin} />
      <div className="m-[14px] flex">
        <div className="fixed mr-[42px] h-[97%] w-[301px] max-md:hidden">
          <Sidebar isAdmin={isAdmin} />
        </div>
        <div className="ml-auto block w-[calc(100%-323px)] max-md:w-[100%]">
          <CartInitializer />
          {children}
        </div>
      </div>
    </>
  )
}

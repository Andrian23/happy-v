"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, X } from "lucide-react"

import type { CartItem } from "@/interfaces/cart"
import cartIcon from "@/public/Cart.svg"
import mobileLogo from "@/public/Logo_mobile.svg"

import SidebarMobile from "./SidebarMobile"

const MenuMobile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [totalItemCount, setTotalItemCount] = useState(0) // Стан для зберігання загальної кількості товарів
  const pathname = usePathname()

  useEffect(() => {
    const cartData = localStorage.getItem("cart")
    if (cartData) {
      const cartItems: CartItem[] = JSON.parse(cartData)
      // Обчислення загальної кількості товарів
      const totalCount = cartItems.reduce((total, item) => total + item.count, 0)
      setTotalItemCount(totalCount)
    } else {
      setTotalItemCount(0) // Скидання загальної кількості, якщо кошик порожній
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="header-mobile fixed top-0 h-[70px] w-full border-b border-black/15 bg-white md:hidden">
      <div className="header-container flex items-center justify-between p-4 max-md:p-[1.125rem]">
        {isOpen ? <X onClick={() => setIsOpen(false)} /> : <MenuIcon onClick={() => setIsOpen(true)} />}
        <div className="logo">
          <Link href="/dashboard">
            <Image src={mobileLogo} alt="Logo" className="h-[50px] w-[120px]" />
          </Link>
        </div>
        <div className="relative block h-12 w-8">
          <Link href="/cart">
            <Image src={cartIcon} alt="Cart" className="absolute right-[5px] top-[5px] h-6 w-6" />
            <div className="absolute right-0 top-0 z-[2] h-[14px] w-[14px] rounded-full bg-primary-500"></div>
            <div className="absolute right-[1px] top-[-1px] z-[3] rounded-full px-[3px] text-[10px] text-white">
              {totalItemCount}
            </div>
          </Link>
        </div>
      </div>
      {isOpen == true ? (
        <div className="absolute top-[70px] z-[99999] w-full">
          <SidebarMobile />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MenuMobile

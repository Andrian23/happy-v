"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, X } from "lucide-react"

import Sidebar from "@/components/sidebar/Sidebar"
import type { CartItem } from "@/interfaces/cart"
import cartIcon from "@/public/Cart.svg"
import mobileLogo from "@/public/Logo_mobile.svg"

interface MenuMobileProps {
  isAdmin?: boolean
}

const MenuMobile: React.FC<MenuMobileProps> = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [totalItemCount, setTotalItemCount] = useState(0)
  const pathname = usePathname()

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

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className={`relative top-0 ${isAdmin ? "h-25" : "h-17.5"} w-full border-b border-black/15 bg-white md:hidden`}>
      <div className="flex items-center justify-between p-4 max-md:p-[1.125rem]">
        {isOpen ? (
          <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
        ) : (
          <MenuIcon onClick={() => setIsOpen(true)} className="cursor-pointer" />
        )}
        <div className="logo flex flex-col items-center">
          <Link href="/dashboard">
            <Image src={mobileLogo} alt="Logo" className="h-12.5 w-30" />
          </Link>
          {isAdmin && <h2 className="text-xs font-medium">Super Admin</h2>}
        </div>
        <div className="relative block h-8 w-8">
          <Link href="/cart">
            <Image src={cartIcon} alt="Cart" className="absolute top-[5px] right-[5px] h-6 w-6" />
            <div className="bg-primary-500 absolute top-0 right-0 z-2 h-3.5 w-3.5 rounded-full"></div>
            <div className="absolute -top-px right-px z-3 rounded-full px-[3px] text-[10px] text-white">
              {totalItemCount}
            </div>
          </Link>
        </div>
      </div>
      {isOpen ? (
        <div className={`absolute ${isAdmin ? "top-25" : "top-17.5"} z-99999 w-full shadow-lg`}>
          <Sidebar isAdmin={isAdmin} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MenuMobile

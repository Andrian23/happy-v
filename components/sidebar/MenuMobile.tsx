"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, X } from "lucide-react"

import Sidebar from "@/components/sidebar/Sidebar"
import { Badge } from "@/components/ui/Badge"
import { Cart } from "@/icons/Cart"
import mobileLogo from "@/public/Logo_mobile.svg"
import { useShopifyCartStore } from "@/stores/shopifyCart"

interface MenuMobileProps {
  isAdmin?: boolean
}

const MenuMobile: React.FC<MenuMobileProps> = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const cart = useShopifyCartStore((state) => state.cart)
  const fetchCart = useShopifyCartStore((state) => state.fetchCart)
  const cartCount = cart?.lines.edges.reduce((total, { node }) => total + node.quantity, 0) || 0

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

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

        {isAdmin ? (
          <div className="w-6" />
        ) : (
          <div className="relative">
            <Link href="/cart">
              <Cart className="text-primary-900 h-6 w-6" />
              <Badge className="absolute -top-1 -right-1 flex aspect-square min-w-4 items-center justify-center rounded-full p-0.5 text-[10px] leading-none">
                {cartCount}
              </Badge>
            </Link>
          </div>
        )}
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

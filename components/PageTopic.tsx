"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Cart } from "@/icons/Cart"
import { cn } from "@/lib/utils"
import { useShopifyCartStore } from "@/stores/shopifyCart"

import { Badge } from "./ui/Badge"

interface PageTopicProps {
  name?: string
  description?: string
  children?: React.ReactNode
  sticky?: boolean
}

const PageTopic: React.FC<PageTopicProps> = ({ name, description, children, sticky = false }) => {
  const cart = useShopifyCartStore((state) => state.cart)

  const fetchCart = useShopifyCartStore((state) => state.fetchCart)

  const cartCount = cart?.lines.edges.reduce((total, { node }) => total + node.quantity, 0) || 0

  const pathname = usePathname()

  const isSuperAdminPage = pathname.startsWith("/super-admin")

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return (
    <div className={cn("border-b border-blue-200 bg-white pt-1 pb-4 lg:pt-4", sticky && "lg:sticky lg:top-0 lg:z-10")}>
      <div className="flex items-center justify-between gap-4 max-lg:w-full">
        {name && <h2 className="text-primary-900 text-[28px] leading-9 font-bold lg:leading-none">{name}</h2>}
        {children}
        {!isSuperAdminPage && (
          <Link href="/cart" className="relative ml-auto max-lg:hidden">
            <Cart className="text-primary-900 h-6 w-6" />
            <Badge className="absolute -top-1 -right-1 flex aspect-square min-w-4 items-center justify-center rounded-full p-0.5 text-[10px] leading-none">
              {cartCount}
            </Badge>
          </Link>
        )}
      </div>
      {description && <div className="text-grey-800 text-xs lg:text-sm">{description}</div>}
    </div>
  )
}

export default PageTopic

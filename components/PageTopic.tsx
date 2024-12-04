"use client"

import React, { useEffect } from "react"
import Link from "next/link"

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

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return (
    <div className={cn("bg-white pb-3 pt-4", sticky && "lg:sticky lg:top-0 lg:z-10")}>
      <div className="flex items-center justify-between gap-4 max-lg:w-full">
        {name && <h2 className="text-[28px] font-bold leading-9 text-primary-900">{name}</h2>}
        {children}
        <Link href="/cart" className="relative ml-auto max-lg:hidden">
          <Cart className="h-6 w-6 text-primary-900" />
          <Badge className="absolute -right-1 -top-1 flex aspect-square min-w-4 items-center justify-center rounded-full p-0.5 text-[10px] leading-none">
            {cartCount}
          </Badge>
        </Link>
      </div>
      {description && <div className="text-xs text-grey-800 lg:text-sm">{description}</div>}
    </div>
  )
}

export default PageTopic

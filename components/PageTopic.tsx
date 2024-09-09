"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import { Cart } from "@/icons/Cart"
import type { CartItem } from "@/interfaces/cart"
import { cn } from "@/lib/utils"

import { Badge } from "./ui/badge"

interface PageTopicProps {
  name: string
  description?: string
  children?: React.ReactNode
  sticky?: boolean
}

const PageTopic: React.FC<PageTopicProps> = ({ name, description, children, sticky = false }) => {
  const [totalItemCount, setTotalItemCount] = useState(0)

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
    <div className={cn("bg-white pb-3 pt-4", sticky && "lg:sticky lg:top-0 lg:z-10")}>
      <div className="flex items-center gap-4 max-lg:w-full">
        <h2 className="text-[28px] font-bold leading-9 text-primary-900">{name}</h2>
        {children}
        <Link href="/cart" className="relative ml-auto max-lg:hidden">
          <Cart className="h-6 w-6 text-primary-900" />
          <Badge className="absolute -right-1 -top-1 flex h-3 w-3 justify-center p-0 text-[10px]">
            {totalItemCount}
          </Badge>
        </Link>
      </div>
      <div className="text-xs text-grey-800 lg:text-sm">{description}</div>
    </div>
  )
}

export default PageTopic

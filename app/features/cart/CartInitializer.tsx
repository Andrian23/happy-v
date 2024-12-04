"use client"

import { useEffect } from "react"

import { useShopifyCartStore } from "@/stores/shopifyCart"

export default function CartInitializer() {
  const fetchCart = useShopifyCartStore((state) => state.fetchCart)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return null
}

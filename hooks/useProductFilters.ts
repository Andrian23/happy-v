import { useEffect, useState } from "react"

import type { ShopifyProduct } from "@/models/product"

type ProductFilters = {
  category: string
  sort: string
}

const filterMap: Record<ProductFilters["category"], string[]> = {
  all: [],
  vaginal: ["vaginal health"],
  gut: ["gut health"],
  wellness: ["vaginal health", "gut health"],
  accessories: ["accessories"],
}

export const useProductFilters = (products: ShopifyProduct[], filters: ProductFilters) => {
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([])
  const { category, sort } = filters

  useEffect(() => {
    const tags = filterMap[category] || []
    const filtered = products.filter((product) => {
      return tags.length > 0 ? tags.some((t) => product.tags.join(" ").toLowerCase().includes(t.toLowerCase())) : true
    })

    filtered.sort((a, b) => {
      const priceA = parseFloat(a.variants.edges[0].node.price)
      const priceB = parseFloat(b.variants.edges[0].node.price)
      return sort === "low-to-high" ? priceB - priceA : priceA - priceB
    })

    setFilteredProducts(filtered.sort((a) => (a.status === "ACTIVE" ? -1 : 1)))
  }, [category, sort, products])

  return filteredProducts
}

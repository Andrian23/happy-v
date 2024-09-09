"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { getAllProducts } from "@/actions/productsShopify"
import Loader from "@/components/Loader"
import PageTopic from "@/components/PageTopic"
import { ProductsLayout } from "@/components/ProductTable"
import { Tabs } from "@/components/Tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/Select"
import { type View, ViewSwitch } from "@/components/ViewSwitch"
import type { CartItem } from "@/interfaces/cart"
import type { Product } from "@/models/product"

interface ProductsState {
  products: Product[]
}

const tabs = ["All", "Vaginal Health", "Gut Health", "Everyday Wellness", "Accessories"]

const ProductsPage = () => {
  const [view, setView] = useState<View>("grid")
  const [sort, setSort] = useState("low-to-high")
  const [products, setProducts] = useState<ProductsState>({ products: [] })
  const [activeItem, setActiveItem] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartCount, setCartCount] = useState(0)

  const getFilteredProducts = useCallback(() => {
    switch (activeItem) {
      case 0:
        return products.products
      case 1:
        return products.products.filter((product) => product.tags.includes("Vaginal health"))
      case 2:
        return products.products.filter((product) => product.tags.includes("Gut health"))
      case 3:
        return products.products.filter(
          (product) => product.tags.includes("Vaginal health") || product.tags.includes("Gut health")
        )
      case 4:
        return products.products.filter((product) => product.tags.includes("Accessories"))
      default:
        return products.products
    }
  }, [activeItem, products])

  const filteredProducts = useMemo(() => getFilteredProducts(), [getFilteredProducts])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await getAllProducts()
      setProducts(data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts]
    let sorted = []

    if (sort === "low-to-high") {
      sorted = productsToSort.sort((a, b) => {
        if (a.status === "active" && b.status !== "active") {
          return -1
        } else if (a.status !== "active" && b.status === "active") {
          return 1
        }
        return a.price - b.price
      })
    } else if (sort === "high-to-low") {
      sorted = productsToSort.sort((a, b) => {
        if (a.status === "active" && b.status !== "active") {
          return -1
        } else if (a.status !== "active" && b.status === "active") {
          return 1
        }
        return b.price - a.price
      })
    } else {
      sorted = productsToSort.sort((a) => (a.status === "active" ? -1 : 1))
    }
    return sorted
  }, [sort, filteredProducts])

  const updateCartCount = () => {
    const cartData = localStorage.getItem("cart")
    const cartItems: CartItem[] = cartData ? JSON.parse(cartData) : []
    const totalItems = cartItems.reduce((total, item) => total + item.count, 0)
    setCartCount(totalItems)
  }

  useEffect(() => {
    updateCartCount()
  }, [])

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="Wholesale products" description="Buy all available products at wholesale prices" sticky />

      <div className="main-products mt-5">
        <div className="flex w-full items-center justify-between max-md:block">
          <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

          <div className="lg:z-1 relative flex max-lg:z-[-4] max-md:block">
            <ViewSwitch onChange={setView} state={view} className="max-w-[74px]" />

            <div className="ml-3 max-lg:mt-2 max-md:ml-0">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="min-w-44 rounded-xl max-lg:w-full lg:max-w-44">
                  Price: {sort === "low-to-high" ? "Low to High" : "High to Low"}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="low-to-high">Low to High</SelectItem>
                    <SelectItem value="high-to-low">High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <Loader />}

      {!isLoading && <ProductsLayout products={sortedProducts} view={view} />}
    </div>
  )
}

export default ProductsPage

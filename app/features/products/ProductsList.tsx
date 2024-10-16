"use client"

import React, { useState } from "react"

import PageTopic from "@/components/PageTopic"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/Select"
import { Tabs } from "@/components/ui/Tabs"
import { type View, ViewSwitch } from "@/components/ViewSwitch"
import useDraggableScroll from "@/hooks/useDraggableScroll"
import { useProductFilters } from "@/hooks/useProductFilters"
import type { Product } from "@/models/product"

import { ProductsLayout } from "../../../components/products/ProductsLayout"

type ProductsProps = {
  products: Product[]
}

const tabs = [
  { label: "All", value: "all", tags: [] },
  { label: "Vaginal Health", value: "vaginal", tags: ["vaginal health"] },
  { label: "Gut Health", value: "gut", tags: ["gut health"] },
  { label: "Everyday Wellness", value: "wellness", tags: ["vaginal health", "gut health"] },
  { label: "Accessories", value: "accessories", tags: ["accessories"] },
]

export const ProductsList: React.FC<ProductsProps> = ({ products }) => {
  const [view, setView] = useState<View>("grid")
  const [sort, setSort] = useState("low-to-high")
  const [category, setCategory] = useState("all")
  const filteredProducts = useProductFilters(products, { category, sort })
  const { scrollRef, handleMouseDown } = useDraggableScroll()

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic name="Wholesale products" description="Buy all available products at wholesale prices" sticky />

      <div className="mt-5">
        <div className="flex w-full items-center justify-between gap-3 max-lg:flex-wrap">
          <div
            ref={scrollRef}
            style={{ scrollbarWidth: "none" }}
            className="hide-scrollbar cursor-grab overflow-x-auto whitespace-nowrap"
            onMouseDown={handleMouseDown}
          >
            <Tabs tabs={tabs} activeTab={category} onChange={setCategory} />
          </div>

          <ViewSwitch onChange={setView} state={view} className="ml-auto max-lg:hidden" />

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

      <ProductsLayout products={filteredProducts} view={view} />
    </div>
  )
}

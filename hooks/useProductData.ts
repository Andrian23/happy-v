import { useEffect, useState } from "react"

import { getProductById } from "@/actions/productsShopify"
import type { CartItem } from "@/interfaces/cart"
import { Product } from "@/models/product"

const useProductData = (listProductsId: number[], cart?: CartItem[]) => {
  const [productData, setProductData] = useState<Product[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (listProductsId.length > 0) {
        const productsData = await Promise.all(listProductsId.map((id) => getProductById(id)))
        const formattedData = productsData.map((item, index) =>
          cart
            ? {
                ...item.product,
                count: cart.length > 0 ? cart[index].count : 0,
              }
            : item.product
        )
        setProductData(formattedData)
      }
    }
    fetchData()
  }, [listProductsId, cart])

  return [productData, setProductData] as const
}

export default useProductData

import { getAllProducts } from "@/actions/productsShopify"
import { ProductsList } from "@/components/products/ProductsList"

export default async function ProductsPage() {
  const { products } = await getAllProducts()

  return <ProductsList products={products} />
}

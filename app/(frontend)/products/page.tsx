import { getAllProducts } from "@/actions/productsShopify"
import { ProductsList } from "@/app/features/products/ProductsList"

export default async function ProductsPage() {
  const { products } = await getAllProducts()

  return <ProductsList products={products} />
}

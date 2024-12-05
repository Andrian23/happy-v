import { getProducts } from "@/actions/product"
import { ProductsList } from "@/app/features/products/ProductsList"

export default async function ProductsPage() {
  const products = await getProducts()

  return <ProductsList products={products} />
}

import { getProductById, getProductIngredients } from "@/actions/product"
import { ProductDetails } from "@/app/features/products/ProductDetails"

export default async function ProductDetailsPage({ params }: { params: Promise<{ productId: number }> }) {
  const productId = (await params).productId
  const product = await getProductById(productId)
  const ingredients = await getProductIngredients(product)

  return <ProductDetails product={product} ingredients={ingredients} />
}

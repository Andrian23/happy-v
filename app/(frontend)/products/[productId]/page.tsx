import { getProductById, getProductIngredients } from "@/actions/product"
import { ProductDetails } from "@/app/features/products/ProductDetails"

type Params = {
  params: { productId: number }
}

export default async function ProductDetailsPage({ params }: Params) {
  const product = await getProductById(params.productId)
  const ingredients = await getProductIngredients(product)

  return <ProductDetails product={product} ingredients={ingredients} />
}

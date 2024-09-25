import { getProductById } from "@/actions/productsShopify"
import { ProductDetails } from "@/components/products/ProductDetails"

type Params = {
  params: { productId: number }
}

export default async function ProductDetailsPage({ params }: Params) {
  const { product } = await getProductById(params.productId)

  return <ProductDetails product={product} />
}

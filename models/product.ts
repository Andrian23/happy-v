interface ProductImage {
  src: string
}

interface ProductVariant {
  sku: string
  price: string
  inventory_quantity: number
  grams: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  image: ProductImage
  images: ProductImage[]
  name: string
  variants: ProductVariant[]
  count: number
  status: "active"
  body_html: string
  tags: string[]
}

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
  image: ProductImage
  images: ProductImage[]
  name: string
  variants: ProductVariant[]
  amount: number
  status: "active" | "archived" | "draft"
  body_html: string
  tags: string
}

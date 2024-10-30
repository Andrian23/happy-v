export interface ShopifyProduct {
  id: string
  title: string
  descriptionHtml: string
  tags: string[]
  status: "ACTIVE" | "ARCHIVED" | "DRAFT"
  images: {
    edges: ImageEdge[]
  }
  variants: {
    edges: VariantEdge[]
  }
}

export interface ImageEdge {
  node: {
    src: string
    altText: string | null
  }
}

export interface VariantEdge {
  node: {
    sku: string
    price: string
    inventoryQuantity: number
  }
}

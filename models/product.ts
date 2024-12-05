export interface MetafieldEdge {
  node: {
    key: string
    value: string
  }
}

export interface ShopifyProduct {
  id: string
  title: string
  descriptionHtml: string
  tags: string[]
  status: "ACTIVE" | "ARCHIVED" | "DRAFT"
  metafields: {
    edges: MetafieldEdge[]
  }
  images: {
    edges: ImageEdge[]
  }
  variants: {
    edges: VariantEdge[]
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
}

export interface ImageEdge {
  node: {
    src: string
    altText: string | null
  }
}

export interface SellingPlanGroupEdge {
  node: {
    name: string
    sellingPlans: {
      edges: {
        node: {
          id: string
          pricingPolicies: {
            adjustmentType: string
            adjustmentValue: {
              amount: string
              currencyCode: string
              percentage: number
            }
          }[]
        }
      }[]
    }
  }
}

export interface VariantEdge {
  node: {
    sku: string
    price: string
    compareAtPrice: string
    inventoryQuantity: number
    id: string
    title: string
    merchandise: {
      image: {
        url: string
        altText: string | null
      }
      product: {
        title: string
      }
    }
    cost: {
      amountPerQuantity: {
        amount: string
        currencyCode: string
      }
      subtotalAmount: {
        amount: string
        currencyCode: string
      }
      totalAmount: {
        amount: string
        currencyCode: string
      }
    }
    quantity: number
    image: {
      altText: string | null
      src: string
    }
    sellingPlanGroups: {
      edges: SellingPlanGroupEdge[]
    }
  }
}

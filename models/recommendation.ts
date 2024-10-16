import type { Product } from "./product"

interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface Recommendation {
  id: string
  userId: string
  basicInfo: {
    recommendationName: string
    recommendationDetails: string
  }
  clients: Client[]
  created: string
  discount: number
  selectedProducts: Array<Omit<Product, "amount"> & { amount: string; frequency: string; details: string }>
  status: "ordered" | "not-ordered"
}

export type Template = Recommendation

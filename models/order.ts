import { BillingAddress } from "@/models/billing"

import type { ShopifyProduct } from "./product"
import type { ShippingAddress, ShippingMethod } from "./shipping"

interface Fulfillments {
  tracking_url: string
  tracking_company: string
  tracking_number: string
}

export interface Order {
  id: number
  userId: string
  email: string
  products: ShopifyProduct[]
  createdAt: Date
  totalPrice: number
  shippingMethod: ShippingMethod
  shippingAddress: ShippingAddress
  billingAddress: BillingAddress
  paymentMethod: string
  financialStatus?: "paid"
  fulfillmentStatus?: string | null
  fulfillments?: Fulfillments[]
  fulfillment_status?: string | null
  financial_status?: "paid"
}

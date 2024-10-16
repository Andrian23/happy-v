import type { Product } from "./product"
import type { ShippingAddress, ShippingMethod } from "./shipping"

interface Fulfillments {
  tracking_url: string
  tracking_company: string
  tracking_number: string
}

export interface Order {
  id: number
  products?: Product[]
  createdAt: Date
  totalPrice: string
  shippingMethod: ShippingMethod
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  paymentMethod: "creditCard" | "shopPay" | "paypal" | "amazonPay"
  financialStatus?: "paid"
  fulfillmentStatus?: string | null
  fulfillments?: Fulfillments[]
  fulfillment_status?: string | null
  financial_status?: "paid"
}

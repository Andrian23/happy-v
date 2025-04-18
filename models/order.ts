import type { ShopifyProduct } from "./product"

interface Money {
  amount: string
  currencyCode: string
}

interface PriceSet {
  shopMoney: Money
  presentmentMoney?: Money
}

interface AmountSet {
  shopMoney: Money
}

export interface Address {
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  zip: string
  phone: string
}

interface Transaction {
  kind: string
  status: string
  amountSet: AmountSet
}

interface ShippingLine {
  title: string
  priceSet: PriceSet
}

interface Payment {
  amount: string
  paymentMethod: string
}

interface LineItemEdgeNode {
  title: string
  quantity: number
  product: ShopifyProduct
}

interface LineItem {
  variantId: string
  quantity: number
  edges?: { node: LineItemEdgeNode }[]
}

interface Fulfillment {
  trackingInfo: {
    company: number
    number: string
    url: string
  }
}

interface ShippingLineDetails extends ShippingLine {
  originalPriceSet: PriceSet
}

export interface Order {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  lineItems: LineItem
  shippingAddress: Address
  billingAddress: Address
  totalPrice: number
  status: string
  displayFinancialStatus: string
  displayFulfillmentStatus: string
  fulfillments: Fulfillment[]
  currentSubtotalPriceSet: {
    shopMoney: Money
  }
  currentTaxLines?: {
    priceSet: {
      shopMoney: Money
    }
  }[]
  customAttributes?: { key: string; value: string }[]
  transactions: Transaction[]
  shippingLines: ShippingLine[]
  shippingLine: ShippingLineDetails
  payment: Payment
}

export interface OrderInput {
  lineItems: { variantId: string; quantity: number }[]
  shippingAddress: Address
  billingAddress: Address
  transactions: Transaction[]
  shippingLines: {
    title: string
    source: string
    code: string
    taxLines: {
      title: string
      rate: string
      priceSet: PriceSet
    }
    priceSet: PriceSet
  }[]
  payment: Payment
}

interface OrderEdge {
  node: Order
  cursor: string
}

export interface CustomerOrdersResponse {
  customer: {
    orders: {
      edges: OrderEdge[]
      pageInfo: {
        hasNextPage: boolean
        hasPreviousPage: boolean
        endCursor: string | null
        startCursor: string | null
      }
    }
  }
}

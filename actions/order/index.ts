"use server"

import { auth } from "@/auth"
import { Customer } from "@/models/customer"
import { Address, Order, OrderInput } from "@/models/order"
import { ShopifyProduct } from "@/models/product"

import { createPaymentIntent, PaymentInfo } from "../paymentIntent"

function formatAddress(address: Address) {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    province: address.province,
    country: address.country,
    zip: address.zip,
    phone: address.phone,
  }
}

function formatShippingLine(line: {
  title: string
  source: string
  code: string
  taxLines: {
    title: string
    rate: string
    priceSet: {
      shopMoney: {
        amount: string
        currencyCode: string
      }
    }
  }
  priceSet: {
    shopMoney: {
      amount: string
      currencyCode: string
    }
    presentmentMoney?: {
      amount: string
      currencyCode: string
    }
  }
}) {
  return {
    title: line.title,
    source: line.source,
    code: line.code,
    taxLines: {
      title: line.taxLines.title,
      rate: line.taxLines.rate,
      priceSet: {
        shopMoney: {
          amount: line.taxLines.priceSet.shopMoney.amount,
          currencyCode: line.taxLines.priceSet.shopMoney.currencyCode,
        },
      },
    },
    priceSet: {
      shopMoney: {
        amount: line.priceSet.shopMoney.amount,
        currencyCode: line.priceSet.shopMoney.currencyCode,
      },
      presentmentMoney: {
        amount: line.priceSet.presentmentMoney?.amount || "",
        currencyCode: line.priceSet.presentmentMoney?.currencyCode || "",
      },
    },
  }
}

import { CardPaginationData } from "@/interfaces/pagination"

import {
  mutationCreateCustomer,
  mutationCreateOrder,
  queryCustomerByEmail,
  queryCustomerOrders,
  queryCustomerOrdersWithPagination,
  queryOrderById,
} from "./graphqlQueries"

async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://happy-v.myshopify.com/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  })

  const result = await response.json()

  if (result.errors) {
    console.error("GraphQL errors:", result.errors)
  }

  return result.data
}

export async function getOrderByOrderId(orderId: string): Promise<Order> {
  const query = queryOrderById(`gid://shopify/Order/${orderId}`)
  const { order } = await fetchGraphQL<{ order: Order }>(query)

  return order
}

async function findCustomerByEmail(email: string): Promise<Customer | null> {
  const query = queryCustomerByEmail(email)
  const result = await fetchGraphQL<{ customers: { edges: { node: Customer }[] } }>(query)

  return result?.customers.edges.length > 0 ? result.customers.edges[0].node : null
}

export async function createCustomer(input: { email: string; phone: string; firstName: string }): Promise<Customer> {
  const result = await fetchGraphQL<{
    customerCreate: { customer: Customer; userErrors: { message: string }[] }
  }>(mutationCreateCustomer, { input })

  const { customer, userErrors } = result.customerCreate
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(", "))
  }

  return customer
}

async function getOrCreateCustomer(email: string, phone: string, firstName: string): Promise<Customer> {
  let customer = await findCustomerByEmail(email)
  if (!customer) {
    customer = await createCustomer({ email, phone, firstName })
  }

  return customer
}

export async function getOrderByUserId(): Promise<Order[]> {
  const session = await auth()
  const { email } = session?.user ?? {}

  if (!email) throw new Error("User not found")

  const customer = await findCustomerByEmail(email)
  if (!customer) return []

  const result = await fetchGraphQL<{ customer: { orders: { edges: { node: Order }[] } } }>(queryCustomerOrders, {
    customerId: customer.id,
  })

  return result.customer.orders.edges
    .map((edge) => edge.node)
    .filter((order) => {
      return order.customAttributes?.some((attr) => attr.key === "source" && attr.value === "DEAP")
    })
}

export async function getOrdersByUserId(
  page: number = 1,
  pageSize: number = 10
): Promise<{ orders: Order[]; pagination: CardPaginationData }> {
  const session = await auth()
  const { email } = session?.user ?? {}

  if (!email) throw new Error("User not found")

  const customer = await findCustomerByEmail(email)
  if (!customer) return { orders: [] }

  const result = await fetchGraphQL<{
    customer: {
      orders: {
        edges: { node: Order }[]
        pageInfo: {
          hasNextPage: boolean
          hasPreviousPage: boolean
          startCursor: string
          endCursor: string
        }
      }
    }
  }>(queryCustomerOrdersWithPagination, {
    customerId: customer.id,
    first: pageSize,
    after: page > 1 ? btoa(`cursor-${(page - 1) * pageSize}`) : null,
  })

  const orders = result.customer.orders.edges
    .map((edge) => edge.node)
    .filter((order) => {
      return order.customAttributes?.some((attr) => attr.key === "source" && attr.value === "DEAP")
    })

  const hasNextPage = result.customer.orders.pageInfo.hasNextPage

  const totalPages = hasNextPage ? Math.max(page + 1, 5) : page

  const pagination: CardPaginationData = {
    currentPage: page,
    totalPages,
  }

  return {
    orders,
    pagination,
  }
}

export async function getTopOrderedProducts(): Promise<{ product: ShopifyProduct; quantity: number }[]> {
  const orders = await getOrderByUserId()
  if (!orders.length) return []

  const productCountMap: Record<string, { product: ShopifyProduct; quantity: number }> = {}
  orders.forEach((order) =>
    order.lineItems?.edges?.forEach(({ node: { product, quantity } }) => {
      if (productCountMap[product.id]) {
        productCountMap[product.id].quantity += quantity
      } else {
        productCountMap[product.id] = { product, quantity }
      }
    })
  )

  return Object.values(productCountMap).sort((a, b) => b.quantity - a.quantity)
}

export async function createOrderShopify(orderData: OrderInput): Promise<{
  order: Order
  status: string
}> {
  const session = await auth()
  const { id: userId, email, name } = session?.user ?? {}

  if (!userId || !email) {
    throw new Error("User not found")
  }

  const customer = await getOrCreateCustomer(email, orderData.shippingAddress.phone, name || "")
  if (!customer) {
    throw new Error("Failed to retrieve or create customer")
  }

  let payment: PaymentInfo

  try {
    payment = await createPaymentIntent({
      paymentMethodId: orderData.payment.paymentMethod,
      amount: Math.round(parseFloat(orderData.payment.amount) * 100) / 100,
    })
  } catch (error) {
    console.error("Payment intent creation failed", error)
    throw new Error("Failed to create payment intent")
  }

  const shopifyPaymentStatus = mapPaymentStatus(payment.status)

  if (shopifyPaymentStatus !== "SUCCESS") {
    throw new Error("Payment was not successful, cannot create order")
  }

  const requestBody = createOrderRequestBody(orderData, customer.id, shopifyPaymentStatus, payment)

  const response = await fetch(`https://happy-v.myshopify.com/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string,
    },
    body: JSON.stringify(requestBody),
  })

  const result = await response.json()

  if (result.errors || result.data?.orderCreate?.userErrors?.length > 0) {
    console.error("Error creating order:", result.errors || result.data.orderCreate.userErrors)
    throw new Error("Failed to create order.")
  }

  return { order: result.data.orderCreate.order, status: shopifyPaymentStatus }
}

function mapPaymentStatus(status: string): string {
  switch (status) {
    case "succeeded":
      return "SUCCESS"
    case "failed":
      return "FAILURE"
    case "pending":
      return "PENDING"
    case "error":
      return "ERROR"
    default:
      return "UNKNOWN"
  }
}

function createOrderRequestBody(
  orderData: OrderInput,
  customerId: string,
  shopifyPaymentStatus: string,
  payment: PaymentInfo
) {
  return {
    query: mutationCreateOrder,
    variables: {
      order: {
        test: true,
        customerId,
        tags: ["DEAP"],
        lineItems: orderData.lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          requiresShipping: true,
        })),
        shippingAddress: formatAddress(orderData.shippingAddress),
        billingAddress: formatAddress(orderData.billingAddress),
        shippingLines: orderData.shippingLines.map(formatShippingLine),
        transactions: [
          {
            kind: "SALE",
            status: shopifyPaymentStatus,
            gateway: "stripe",
            amountSet: {
              shopMoney: {
                amount: Math.round(parseFloat(orderData.payment.amount) * 100) / 100,
                currencyCode: "UAH",
              },
            },
            authorizationCode: payment.id,
            processedAt: new Date().toISOString(),
            receiptJson: {
              stripePaymentId: payment.id,
              paymentMethod: payment.payment_method_details.card.paymentMethod,
              cardBrand: payment.payment_method_details.card?.brand,
              cardLast4: payment.payment_method_details.card?.last4,
            },
          },
        ],
        customAttributes: [
          { key: "stripe_payment_id", value: payment.id },
          { key: "stripe_payment_status", value: payment.status },
          { key: "stripe_card_brand", value: payment.payment_method_details.card?.brand || "unknown" },
          { key: "stripe_card_last4", value: payment.payment_method_details.card?.last4 || "unknown" },
        ],
        sourceName: "stripe_checkout",
        sourceIdentifier: payment.id,
      },
      options: {
        inventoryBehaviour: "DECREMENT_OBEYING_POLICY",
      },
    },
  }
}

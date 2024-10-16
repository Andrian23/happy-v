"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Order } from "@/models/order"

import { createPaymentIntent } from "./paymentIntent"

export const getOrderByOrderId = async (orderId: string): Promise<Order> => {
  const order = await db.cartOrder.findUnique({
    where: {
      id: Number(orderId),
    },
  })
  return order as unknown as Order
}

export const getOrderByUserId = async (): Promise<Order[]> => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    console.log("No user id")
    return []
  }

  const order = await db.cartOrder.findMany({
    where: {
      userId: userId,
    },
  })

  return order as unknown as Order[]
}

export const createOrder = async (order: Omit<Order, "id" | "createdAt">): Promise<Order> => {
  const newOrder = await db.cartOrder.create({
    data: {
      userId: order.userId,
      email: order.email,
      products: JSON.stringify(order.products),
      shippingAddress: JSON.stringify(order.shippingAddress),
      billingAddress: JSON.stringify(order.shippingAddress),
      paymentMethod: order.paymentMethod,
      shippingMethod: JSON.stringify(order.shippingMethod),
      totalPrice: Math.round(order.totalPrice * 100) / 100,
      status: "pending",
    },
  })

  return newOrder as unknown as Order
}

export const placeOrder = async (
  order: Omit<Order, "id" | "userId" | "email" | "status" | "createdAt">
): Promise<Order> => {
  const session = await auth()
  const { id: userId, email } = session?.user ?? {}

  if (!userId || !email) {
    throw new Error("User not found")
  }

  await createPaymentIntent({
    paymentMethodId: order.paymentMethod,
    amount: Math.round(order.totalPrice * 100) / 100,
  })

  return createOrder({ ...order, userId, email })
}

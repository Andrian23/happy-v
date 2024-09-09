"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Order } from "@/models/order"

export const getOrderByOrderId = async (orderId: number): Promise<Order> => {
  // Change orderId type to number
  const order = await db.cartOrder.findUnique({
    where: {
      id: orderId, // Directly use orderId as a number
    },
  })
  return order as unknown as Order
}

export const getOrderByUserId = async (): Promise<Order[]> => {
  const session = await auth()
  const userId = session?.user?.email

  if (!userId) {
    console.log("No user id")
    return []
  }

  const order = await db.cartOrder.findMany({
    where: {
      email: userId,
    },
  })
  return order as unknown as Order[]
}

"use server"

import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  const { email, shippingAddress, billingAddress, paymentMethod, products, totalPrice, status, shippingMethod } =
    await req.json()

  if (!email) {
    return NextResponse.json({ message: "Email is required!" }, { status: 400 })
  }
  if (!shippingAddress) {
    return NextResponse.json({ message: "Shipping address is required!" }, { status: 400 })
  }
  if (!billingAddress) {
    return NextResponse.json({ message: "Billing address is required!" }, { status: 400 })
  }
  if (!paymentMethod) {
    return NextResponse.json({ message: "Payment method is required!" }, { status: 400 })
  }
  if (!products) {
    return NextResponse.json({ message: "Products are required!" }, { status: 400 })
  }
  if (!totalPrice) {
    return NextResponse.json({ message: "Total price is required!" }, { status: 400 })
  }
  if (!status) {
    return NextResponse.json({ message: "Status is required!" }, { status: 400 })
  }
  if (!shippingMethod) {
    return NextResponse.json({ message: "Shipping method is required!" }, { status: 400 })
  }

  try {
    const newOrder = await db.cartOrder.create({
      data: {
        userId: session?.user.id as string,
        email,
        shippingAddress,
        billingAddress,
        paymentMethod,
        products,
        totalPrice,
        status,
        shippingMethod,
      },
    })

    return NextResponse.json({ newOrder }, { status: 200 })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

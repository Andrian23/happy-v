"use server"

import Stripe from "stripe"

import type { PaymentMethod } from "@stripe/stripe-js"

import type { User } from "@/models/user"

import { findUserById, updateUser } from "./user"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export type PaymentMethodResponse = {
  defaultPaymentMethod: string | null
  paymentMethods: PaymentMethod[]
}

export const createPaymentIntent = async ({ paymentMethodId, amount }: { paymentMethodId: string; amount: number }) => {
  const user = await findUserById()

  if (!user) {
    throw new Error("User not found")
  }

  const customerId = await getCustomerId(user)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    customer: customerId,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
  })

  return paymentIntent.status
}

export const setupIntent = async () => {
  const user = await findUserById()

  if (!user) {
    throw new Error("User not found")
  }

  const customerId = await getCustomerId(user)

  const setupIntents = await stripe.setupIntents.create({
    customer: customerId,
  })

  return {
    clientSecret: setupIntents.client_secret ?? undefined,
  }
}

const getCustomerId = async (user: User) => {
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.name} ${user.lastName}`,
    })

    updateUser({ stripeCustomerId: customer.id })
    return customer.id
  }

  return user.stripeCustomerId
}

export const getPaymentMethods = async (): Promise<PaymentMethodResponse> => {
  const user = await findUserById()

  if (!user) {
    throw new Error("User not found")
  }

  if (!user.stripeCustomerId) {
    return {
      defaultPaymentMethod: null,
      paymentMethods: [],
    }
  }

  const customer = await stripe.customers.retrieve(user.stripeCustomerId)
  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: "card",
  })

  return {
    defaultPaymentMethod: customer.deleted ? null : (customer.invoice_settings.default_payment_method as string),
    paymentMethods: paymentMethods.data as PaymentMethod[],
  }
}

export const setDefaultPaymentMethod = async (paymentMethodId: string) => {
  const user = await findUserById()

  if (!user) {
    throw new Error("User not found")
  }

  if (!user.stripeCustomerId) {
    throw new Error("User has no stripeCustomerId")
  }

  await stripe.customers.update(user.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

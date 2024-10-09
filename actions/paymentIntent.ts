"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const createPaymentIntent = async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
  })

  return {
    clientSecret: paymentIntent.client_secret ?? undefined,
  }
}

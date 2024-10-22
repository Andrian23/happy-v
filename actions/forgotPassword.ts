"use server"

import * as z from "zod"

import { sendPasswordResetEmail } from "@/actions/emailEvents"
import { getUserByEmail } from "@/data/user"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/schemas"

export const forgotPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid email!" }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { error: "email does not found!" }
  }

  const passwordResetToken = await generatePasswordResetToken(email)

  await sendPasswordResetEmail({
    email: passwordResetToken.email,
    token: passwordResetToken.token,
  })

  return { success: "Reset email sent" }
}

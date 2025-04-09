"use server"

import bcrypt from "bcryptjs"
import * as z from "zod"

import { sendVerificationEmail } from "@/actions/emailEvents"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { generateVerificationToken } from "@/lib/tokens"
import { RegisterSchema } from "@/schemas"

export const signUp = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: "Invalid Fields" }
    }

    const { email, password, name, lastName, telephone } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return { error: "Email is already in use!" }
    }

    await db.user.create({
      data: {
        name,
        lastName,
        email,
        telephone,
        password: hashedPassword,
        verificationStatus: "PENDING_REVIEW",
        verificationDate: new Date(),
        partnerStatus: "NOT_APPLIED",
      },
    })

    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
      name,
      lastName,
      telephone,
    })

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: "Confirmation email sent" }
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "An error occurred during signup." }
  }
}

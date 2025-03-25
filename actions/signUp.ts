"use server"

import bcrypt from "bcryptjs"
import * as z from "zod"

import { sendVerificationEmail } from "@/actions/emailEvents"
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

    const { email, password, name, lastName, telephone, place_work, type_proffesion } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return { error: "Email is already in use!" }
    }

    // if (password !== confirmPassword) {
    //   return { error: "Passwords do not match" }
    // }

    await db.user.create({
      data: {
        name,
        lastName,
        email,
        telephone,
        place_work,
        type_proffesion,
        password: hashedPassword,
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

    return { success: "Confirmation email sent" }
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "An error occurred during signup." }
  }
}

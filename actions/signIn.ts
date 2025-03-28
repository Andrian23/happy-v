"use server"

import { AuthError } from "next-auth"
import * as z from "zod"

import { signIn as nextAuthSignIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { ADMIN_LOGIN_REDIRECT, DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"

export const signIn = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid Fields" }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser?.password) {
    return { error: "Email does not exist!" }
  }

  try {
    const redirectTo = existingUser.role === "ADMIN" ? ADMIN_LOGIN_REDIRECT : DEFAULT_LOGIN_REDIRECT

    await nextAuthSignIn("credentials", {
      email,
      password,
      redirectTo,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }

    throw error
  }
}

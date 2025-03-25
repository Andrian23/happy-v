"use server"

import bcrypt from "bcryptjs"
import * as z from "zod"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ResetPasswordSettings } from "@/schemas"

export const resetPasswordSettings = async (values: z.infer<typeof ResetPasswordSettings>) => {
  try {
    const session = await auth() // Get the session
    if (!session || !session.user) {
      return { error: "User not authenticated" }
    }

    const validatedFields = ResetPasswordSettings.safeParse(values)
    if (!validatedFields.success) {
      return { error: "Invalid Fields" }
    }

    const { currentPassword, newPassword, confirmPassword } = validatedFields.data
    if (newPassword !== confirmPassword) {
      return { error: "Passwords don’t match. Please double-check and try again" }
    }

    const userId = session.user.id
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return { error: "User not found" }
    }
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return { error: "Current password is incorrect" }
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { success: "Password updated successfully" }
  } catch (error) {
    console.error("Password reset error:", error)
    return { error: "An error occurred during password reset." }
  }
}

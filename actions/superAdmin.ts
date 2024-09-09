"use server"

import { auth } from "@/auth"

export const getSuperAdmin = async () => {
  const session = await auth() // Get the session
  if (!session || !session.user) {
    throw new Error("User not authenticated")
  }

  const userEmail = session.user.email

  const superAdminEmails = [
    "hans@happyv.com",
    "daniella@happyv.com",
    "maria@happyv.com",
    "lydia@happyv.com",
    "tati@happyv.com",
    "lenia.lopez@happyv.com",
  ]

  const isSuperAdmin = superAdminEmails.includes(userEmail ?? "")

  return isSuperAdmin
}

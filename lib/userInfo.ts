"use server"

import { auth } from "@/auth"

export async function getUserInfo() {
  const session = await auth()

  return {
    email: session?.user.email ?? null,
    telephone: session?.user.telephone ?? null,
  }
}

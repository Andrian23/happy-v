"use server"

import { auth } from "@/auth"
import type { User } from "@/models/user"

import { db } from "../lib/db" // Імпортуємо db з db.ts

export async function getUserById(userId: string): Promise<User | null> {
  return (await db.user.findUnique({
    where: {
      id: userId,
    },
  })) as unknown as User
}

export async function findUserById(): Promise<User | null> {
  const session = await auth()

  return (await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
  })) as unknown as User
}

export async function getUsers(): Promise<User[]> {
  return (await db.user.findMany()) as unknown as User[]
}

export async function updateUser(data: Partial<User>): Promise<User> {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    throw new Error("User not found")
  }

  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeCustomerId: data.stripeCustomerId,
    },
  }) as unknown as User
}

"use server"

import { auth } from "@/auth"
import type { User } from "@/models/user"

import { db } from "../lib/db" // Імпортуємо db з db.ts

export async function getUserById(userId: string): Promise<User | null> {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
  })
}

export async function findUserById(): Promise<User | null> {
  const session = await auth()

  return await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
  })
}

export async function getUsers(): Promise<User[]> {
  return await db.user.findMany()
}

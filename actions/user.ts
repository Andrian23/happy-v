"use server"

import { auth } from "@/auth"
import type { User } from "@/models/user"

import { db } from "../lib/db"

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

export async function updateUserStripeCustomerId(data: Partial<User>): Promise<User> {
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

export async function updateUser(data: Partial<User>) {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    throw new Error("User not found")
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        telephone: data.telephone,
        type_proffesion: data.type_proffesion,
        place_work: data.place_work,
        practical_size: data.practical_size,
        signUpStep3Completed: data.signUpStep3Completed,
        signUpStep4Completed: data.signUpStep4Completed,
      },
    })

    return { success: "User updated successfully", data: updatedUser }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { error: "An error occurred during update user data." }
  }
}

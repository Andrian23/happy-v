"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ShippingAddress } from "@/models/shipping"

export const addShippingAddress = async (
  addressData: Omit<ShippingAddress, "id" | "userId">,
  isDefault?: boolean
): Promise<ShippingAddress> => {
  const session = await auth()

  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User is not authenticated. Cannot add shipping address.")
  }

  const newAddress = await db.shippingAddress.create({
    data: {
      ...addressData,
      userId,
    },
  })

  if (isDefault) {
    await db.user.update({
      where: { id: userId },
      data: { defaultShippingAddress: newAddress.id },
    })
  }

  return newAddress as unknown as ShippingAddress
}

export const editShippingAddress = async (
  addressId: number,
  addressData: Omit<ShippingAddress, "id" | "userId">,
  isDefault?: boolean
): Promise<ShippingAddress> => {
  const session = await auth()

  const userId = session?.user?.id

  if (!userId) {
    throw new Error("User is not authenticated. Cannot edit shipping address.")
  }

  const updatedAddress = await db.shippingAddress.update({
    where: { id: addressId },
    data: {
      ...addressData,
      userId,
    },
  })

  if (isDefault) {
    await db.user.update({
      where: { id: userId },
      data: { defaultShippingAddress: updatedAddress.id },
    })
  }

  return updatedAddress as unknown as ShippingAddress
}

export const getShippingAddresses = async (): Promise<ShippingAddress[]> => {
  const session = await auth()

  const userId = session?.user?.id

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      defaultShippingAddress: true,
    },
  })

  const addresses = await db.shippingAddress.findMany({
    where: {
      userId,
    },
  })

  if (user?.defaultShippingAddress) {
    addresses.sort((a, b) => {
      if (a.id === user.defaultShippingAddress) return -1
      if (b.id === user.defaultShippingAddress) return 1
      return 0
    })
  }

  return addresses as ShippingAddress[]
}

export const deleteShippingAddress = async (addressId: number): Promise<void> => {
  const session = await auth()
  const userId = session?.user?.id

  const existingAddress = await db.shippingAddress.findUnique({
    where: { id: addressId },
  })

  if (!existingAddress || existingAddress.userId !== userId) {
    throw new Error("Address not found or does not belong to the user")
  }

  await db.shippingAddress.delete({
    where: { id: addressId },
  })
}

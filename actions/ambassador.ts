"use server"

import { db } from "@/lib/db"
import { Ambassador } from "@/models/ambassador"

export const getAmbassadors = async (): Promise<Ambassador[]> => {
  const ambassadors = await db.ambassador.findMany()
  return ambassadors as unknown as Ambassador[]
}

export const getAmbassadorById = async (id: string): Promise<Ambassador> => {
  const ambassador = await db.ambassador.findUnique({
    where: {
      id: id,
    },
  })
  return ambassador as unknown as Ambassador
}

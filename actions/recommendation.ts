"use server"

import { Prisma } from "@prisma/client"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { Recommendation, Template } from "@/models/recommendation"

export const getRecommendationByUser = async (): Promise<Recommendation[]> => {
  const session = await auth()

  const recommendations = await db.recommendation.findMany({
    where: {
      userId: session?.user.id,
    },
  })

  return recommendations as unknown as Recommendation[]
}

export const getRecommendationById = async (id: string): Promise<Recommendation> => {
  const recommendation = await db.recommendation.findUnique({
    where: {
      id,
    },
  })

  return recommendation as unknown as Recommendation
}

export const getTemplateByUser = async (): Promise<Template[]> => {
  const session = await auth()

  const templates = await db.template.findMany({
    where: {
      userId: session?.user.id,
    },
  })

  return templates as unknown as Template[]
}

export const getAllTemplates = async (): Promise<Template[]> => {
  const templates = await db.template.findMany()

  return templates as unknown as Template[]
}

export const getTemplateById = async (id: string): Promise<Template> => {
  const template = await db.template.findUnique({
    where: {
      id,
    },
  })

  return template as unknown as Template
}

export const deleteRecommendation = async (id: string): Promise<void> => {
  try {
    await db.recommendation.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Error deleting recommendation:", error)
    throw new Error("Failed to delete recommendation")
  }
}

export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    await db.template.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Error deleting template:", error)
    throw new Error("Failed to delete template")
  }
}

export const updateRecommendation = async (
  id: string,
  data: Prisma.RecommendationUpdateInput
): Promise<Recommendation> => {
  try {
    const updatedRecommendation = await db.recommendation.update({
      where: { id },
      data,
    })

    return updatedRecommendation as unknown as Recommendation
  } catch (error) {
    console.error("Error updating recommendation:", error)
    throw new Error("Failed to update recommendation")
  }
}

export const updateTemplate = async (id: string, data: Prisma.TemplateUpdateInput): Promise<Template> => {
  try {
    const updatedTemplate = await db.template.update({
      where: { id },
      data,
    })

    return updatedTemplate as unknown as Template
  } catch (error) {
    console.error("Error updating template:", error)
    throw new Error("Failed to update template")
  }
}

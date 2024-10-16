import { useCallback } from "react"

import { deleteRecommendation } from "@/actions/recommendation"

export const useDeleteRecommendation = () => {
  const handleDeleteRecommendation = useCallback(async (id: string) => {
    try {
      await deleteRecommendation(id)
    } catch (error) {
      console.error("Failed to delete recommendation:", error)
    }
  }, [])

  return { handleDeleteRecommendation }
}

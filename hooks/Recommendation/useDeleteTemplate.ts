import { useCallback } from "react"

import { deleteTemplate } from "@/actions/recommendation"

export const useDeleteTemplate = () => {
  const handleDeleteTemplate = useCallback(async (id: string) => {
    try {
      await deleteTemplate(id)
    } catch (error) {
      console.error("Failed to delete template:", error)
    }
  }, [])

  return { handleDeleteTemplate }
}

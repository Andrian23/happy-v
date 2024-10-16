import { useCallback, useEffect, useState } from "react"

import { getRecommendationByUser, getTemplateByUser } from "@/actions/recommendation"
import type { Recommendation, Template } from "@/models/recommendation"

const useFetchRecommendationsAndTemplates = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [templates, setTemplates] = useState<Template[]>([])

  const fetchRecommendations = async () => {
    const recommendations = await getRecommendationByUser()
    setRecommendations(recommendations)
  }

  const fetchTemplates = async () => {
    const templates = await getTemplateByUser()
    setTemplates(templates)
  }

  const refetchData = useCallback(() => {
    fetchRecommendations()
    fetchTemplates()
  }, [])

  useEffect(() => {
    refetchData()
  }, [refetchData])

  return { recommendations, templates, refetchData }
}

export default useFetchRecommendationsAndTemplates

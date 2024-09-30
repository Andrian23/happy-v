import { useEffect, useState } from "react"

import { getRecommendationByUser, getTemplateByUser } from "@/actions/recommendation"
import type { Recommendation, Template } from "@/models/recommendation"

const useFetchRecommendationsAndTemplates = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendations = await getRecommendationByUser()
      setRecommendations(recommendations)
    }

    const fetchTemplates = async () => {
      const templates = await getTemplateByUser()
      setTemplates(templates)
    }

    fetchRecommendations()
    fetchTemplates()
  }, [])

  return { recommendations, templates }
}

export default useFetchRecommendationsAndTemplates

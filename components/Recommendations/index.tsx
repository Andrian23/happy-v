"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import CustomSearchInput from "@/components/CustomSearchInput"
import PageTopic from "@/components/PageTopic"
import EmptyShowcase from "@/components/Recommendations/components/EmptyShowcase"
import { Tabs } from "@/components/Tabs"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { useDeleteRecommendation } from "@/hooks/Recommendation/useDeleteRecommendation"
import { useDeleteTemplate } from "@/hooks/Recommendation/useDeleteTemplate"
import useFetchRecommendationsAndTemplates from "@/hooks/Recommendation/useFetchRecommendationsAndTemplates"
import useSort, { SortKey } from "@/hooks/useSort"
import type { Recommendation, Template } from "@/models/recommendation"
import emptyRecommendations from "@/public/empty-recommendations.png"
import templatesItemImage from "@/public/TemplatesItem.svg"
import { useTemplateStore } from "@/stores/template"

import RecommendationsAndTemplatesTab from "./components/RecommendationsAndTemplatesTab"

const tabs = ["Sent Recommendations", "Templates"]

const toggleOptions = [
  { label: "Ordered", value: true },
  { label: "Not Ordered", value: false },
]

const Recommendations = () => {
  const [recommendationTypeTemplate, setRecommendationTypeTemplate] = useState(false)
  const [select, setSelect] = useState("last-updated-newest")
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)
  const [showProductName, setShowProductName] = useState<string | null>(null)
  const [contextMenuIndex, setContextMenuIndex] = useState<number | null>(null)
  const [isOrdered, setIsOrdered] = useState(false)
  const [deletingRecommendationId, setDeletingRecommendationId] = useState<string | number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const router = useRouter()
  const { handleDeleteRecommendation } = useDeleteRecommendation()
  const { handleDeleteTemplate } = useDeleteTemplate()
  const { recommendations, templates, refetchData } = useFetchRecommendationsAndTemplates()
  const { clearTemplate } = useTemplateStore()

  const sortedRecommendations = useSort(
    recommendations,
    select as SortKey,
    (item) => item.clients[0].firstName,
    (item) => new Date(item.created)
  )
  const sortedTemplates = useSort(
    templates,
    select as SortKey,
    (item) => item.basicInfo.recommendationName,
    (item) => new Date(item.created)
  )

  const handleNavigate = () => {
    if (!recommendationTypeTemplate) {
      clearTemplate()
    }

    const path = recommendationTypeTemplate ? "/recommendations/templates/new" : "/recommendations/new"
    router.push(path)
  }

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo)
  }

  const handleShowProductName = (id: string | null) => {
    setShowProductName(id)
  }

  const handleOpenDeletingRecommendationModal = (clientId: string | null) => {
    setDeletingRecommendationId(clientId)
    setContextMenuIndex(null)
  }

  const handleDeleteRecommendationClick = async (recommendationId: string) => {
    await handleDeleteRecommendation(recommendationId)
    refetchData()
  }

  const handleDeleteTemplateClick = async (templateId: string) => {
    await handleDeleteTemplate(templateId)
    refetchData()
  }

  /* Search */

  const filterRecommendations = (recommendations: Recommendation[], query: string) => {
    if (!query) return recommendations

    return recommendations.filter((recommendation) => {
      const { clients, basicInfo, selectedProducts } = recommendation
      const queryLower = query.toLowerCase()

      const clientsMatch = clients.some(
        (client) =>
          client.firstName.toLowerCase().includes(queryLower) ||
          client.lastName.toLowerCase().includes(queryLower) ||
          client.email.toLowerCase().includes(queryLower)
      )

      const basicInfoMatch =
        basicInfo.recommendationName.toLowerCase().includes(queryLower) ||
        basicInfo.recommendationDetails.toLowerCase().includes(queryLower)

      const selectedProductsMatch = selectedProducts.some((product) => product.title.toLowerCase().includes(queryLower))

      return clientsMatch || basicInfoMatch || selectedProductsMatch
    })
  }

  const filterTemplates = (templates: Template[], query: string) => {
    if (!query) return templates

    return templates.filter((template) => {
      const { basicInfo, selectedProducts } = template
      const queryLower = query.toLowerCase()

      const basicInfoMatch =
        basicInfo.recommendationName.toLowerCase().includes(queryLower) ||
        basicInfo.recommendationDetails.toLowerCase().includes(queryLower)

      const selectedProductsMatch = selectedProducts.some((product) => product.title.toLowerCase().includes(queryLower))

      return basicInfoMatch || selectedProductsMatch
    })
  }

  /* Status filter */
  const filteredRecommendations = filterRecommendations(
    sortedRecommendations.filter((recommendation) =>
      isOrdered ? recommendation.status === "ordered" : recommendation.status === "not-ordered"
    ),
    searchQuery
  )

  const filteredTemplates = filterTemplates(
    sortedTemplates.filter((template) =>
      isOrdered ? template.status === "ordered" : template.status === "not-ordered"
    ),
    searchQuery
  )

  useEffect(() => {
    if (deletingRecommendationId) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }

    // Clean up function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("no-scroll")
    }
  }, [deletingRecommendationId])

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic
        name="Recommendations"
        description="Easily create recommendations with your chosen Happy V products and send to your clients"
      />

      <div className="main-recommendations mt-5">
        <div className="mb-4 flex w-full items-center justify-between max-md:block">
          <Tabs
            tabs={tabs}
            activeTab={recommendationTypeTemplate ? 1 : 0}
            onTabChange={(tab) => setRecommendationTypeTemplate(Boolean(tab))}
          />

          <Button variant="primary" size="md" onClick={handleNavigate}>
            {recommendationTypeTemplate ? "Create template" : "New recommendation"}
          </Button>
        </div>
      </div>
      <div className="mb-6 grid w-full grid-cols-[minmax(0,580px)_auto] items-center justify-between gap-2.5 max-md:block">
        <CustomSearchInput
          className="w-full max-w-145"
          value={searchQuery}
          placeholder="Search by keywords"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-[repeat(2,auto)] items-center gap-3">
          {!recommendationTypeTemplate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-primary-900">
                  Status
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <h3 className="text-sm font-semibold text-primary-900">Status</h3>
                <div className="grid grid-cols-[repeat(2,auto)] items-center gap-6">
                  {toggleOptions.map(({ label, value }) => (
                    <label key={label} className="flex cursor-pointer items-center gap-2">
                      <Checkbox checked={isOrdered === value} onCheckedChange={() => setIsOrdered(!isOrdered)} />
                      <span className="w-max text-sm font-normal leading-normal text-primary-900">{label}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Select onValueChange={setSelect}>
            <SelectTrigger className="h-9 w-48 rounded-xl max-md:w-full">
              <SelectValue placeholder="Last Updated: Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
                <SelectItem value="last-updated-newest">Last Updated: Newest</SelectItem>
                <SelectItem value="last-updated-oldest">Last Updated: Oldest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {recommendationTypeTemplate ? (
        filteredTemplates && filteredTemplates.length > 0 ? (
          filteredTemplates.map((template, index) => (
            <RecommendationsAndTemplatesTab
              key={template.id}
              data={template}
              index={index}
              showProductName={showProductName as string}
              handleShowProductName={handleShowProductName}
              toggleMoreInfo={toggleMoreInfo}
              showMoreInfo={showMoreInfo}
              contextMenuIndex={contextMenuIndex as number}
              handleOpenDeletingRecommendationModal={handleOpenDeletingRecommendationModal}
              handleDeleteClick={() => handleDeleteTemplateClick(template.id)}
              deletingRecommendationId={deletingRecommendationId}
              isTemplate
            />
          ))
        ) : (
          <EmptyShowcase
            image={templatesItemImage}
            title="It's still empty here"
            message="Create your own templates for different needs and send them to your customers"
            isTemplate
            onButtonClick={handleNavigate}
          />
        )
      ) : filteredRecommendations && filteredRecommendations.length > 0 ? (
        filteredRecommendations.map((recommendation, index) => (
          <RecommendationsAndTemplatesTab
            key={recommendation.id}
            data={recommendation}
            index={index}
            showProductName={showProductName as string}
            handleShowProductName={handleShowProductName}
            toggleMoreInfo={toggleMoreInfo}
            showMoreInfo={showMoreInfo}
            contextMenuIndex={contextMenuIndex as number}
            handleOpenDeletingRecommendationModal={handleOpenDeletingRecommendationModal}
            handleDeleteClick={() => handleDeleteRecommendationClick(recommendation.id)}
            deletingRecommendationId={deletingRecommendationId}
          />
        ))
      ) : (
        <EmptyShowcase
          image={emptyRecommendations}
          title="It's still empty here"
          message="Create your first recommendation and send it to your client"
          onButtonClick={handleNavigate}
        />
      )}
    </div>
  )
}

export default Recommendations

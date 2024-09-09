"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { getAllTemplates, getRecommendationByUser } from "@/actions/recommendation"
import CustomSearchInput from "@/components/CustomSearchInput"
import PageTopic from "@/components/PageTopic"
import { Tabs } from "@/components/Tabs"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { CheckboxCheckedIcon, CheckboxIcon, ContextMenuIcon, StatusIcon, TriangleDownIcon } from "@/icons"
import { cn } from "@/lib/utils"
import type { Recommendation, Template } from "@/models/recommendation"
import emptyRecommendations from "@/public/empty-recommendations.png"
import templatesItemImage from "@/public/TemplatesItem.svg"

const tabs = ["Sent recommendations", "Templates"]

const RecommendationsPage = () => {
  const router = useRouter()
  const [recommendationTypeTemplate, setRecommendationTypeTemplate] = useState(false)
  const [select, setSelect] = useState("")
  const [sortedRecommendations, setSortedRecommendations] = useState<Recommendation[]>([])
  const [sortedTemplates, setSortedTemplates] = useState<Template[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)
  const [showProductName, setShowProductName] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const modalContextMenuRef = useRef(null)
  const [isModalStatus, setIsModalStatus] = useState(false)
  const [contextMenuIndex, setContextMenuIndex] = useState<number | null>(null)
  const [isOrdered, setIsOrdered] = useState(false)
  const [deletingRecommendationId, setDeletingRecommendationId] = useState<string | number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const contextMenuRef = useRef<HTMLDivElement>(null)

  const handleRecommendationTypeTemplate = (typeBoolean: boolean) => {
    setRecommendationTypeTemplate(typeBoolean)
  }

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo)
  }

  const handleShowProductName = (id: string | null) => {
    setShowProductName(id)
  }

  const handleModalStatus = () => {
    setIsModalStatus(!isModalStatus)
  }

  const handleContextMenuStatus = (index: number | null) => {
    setContextMenuIndex(index === contextMenuIndex ? null : index)
  }

  const handleIsOrdered = () => {
    setIsOrdered(!isOrdered)
  }

  const handleOpenDeletingRecommendationModal = (clientId: string) => {
    setDeletingRecommendationId(clientId)
    setContextMenuIndex(null)
  }

  const handleCloseDeletingRecommendationModal = () => {
    setDeletingRecommendationId(null)
    setContextMenuIndex(null)
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendations = await getRecommendationByUser()
      setRecommendations(recommendations)
    }

    const fetchTemplates = async () => {
      const templates = await getAllTemplates()
      setTemplates(templates)
    }

    fetchRecommendations()
    fetchTemplates()
  }, [])

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef?.current && !modalRef.current?.contains(event.target as Node)) {
        setIsModalStatus(false)
      }
    }

    if (isModalStatus) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isModalStatus])

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
    sortedRecommendations?.filter((recommendation) =>
      isOrdered ? recommendation?.status === "ordered" : recommendation?.status === "not-ordered"
    ),
    searchQuery
  )

  const filteredTemplates = filterTemplates(
    sortedTemplates?.filter((template) =>
      isOrdered ? template?.status === "ordered" : template?.status === "not-ordered"
    ),
    searchQuery
  )

  const handleEditClick = (id: string) => {
    router.push(`/recommendations/edit?id=${id}`)
  }

  const handleDeleteClick = (id: string | number) => {
    if (!recommendations.length) return

    const updatedRecommendations = recommendations.filter((recommendation) => recommendation.id !== id)
    setRecommendations(updatedRecommendations)
    setSortedRecommendations(updatedRecommendations)
    localStorage.setItem("recommendations", JSON.stringify(updatedRecommendations))
    setContextMenuIndex(null) // Close the context menu after deletion
    setDeletingRecommendationId(null) // Close deleting modal
  }

  useEffect(() => {
    if (!recommendations) return

    const recommendationsToSort = [...recommendations]

    if (select === "a-z") {
      recommendationsToSort.sort((a, b) => a.clients[0].firstName.localeCompare(b.clients[0].firstName))
    } else if (select === "z-a") {
      recommendationsToSort.sort((a, b) => b.clients[0].firstName.localeCompare(a.clients[0].firstName))
    } else if (select === "last-updated-newest") {
      recommendationsToSort.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    } else if (select === "last-updated-oldest") {
      recommendationsToSort.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    }

    setSortedRecommendations(recommendationsToSort)
  }, [select, recommendations])

  useEffect(() => {
    if (!templates) return

    const templatesToSort = [...templates]

    if (select === "a-z") {
      templatesToSort.sort((a, b) => a.basicInfo.recommendationName.localeCompare(b.basicInfo.recommendationName))
    } else if (select === "z-a") {
      templatesToSort.sort((a, b) => b.basicInfo.recommendationName.localeCompare(a.basicInfo.recommendationName))
    } else if (select === "last-updated-newest") {
      templatesToSort.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    } else if (select === "last-updated-oldest") {
      templatesToSort.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    }

    setSortedTemplates(templatesToSort)
  }, [select, templates])

  const handleCloseContextMenu = () => {
    setContextMenuIndex(null)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        handleCloseContextMenu()
      }
    }

    if (contextMenuIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [contextMenuIndex])

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
            onTabChange={(tab) => handleRecommendationTypeTemplate(Boolean(tab))}
          />

          <Button
            variant="primary"
            onClick={() =>
              router.push(recommendationTypeTemplate ? "/recommendations/templates/new" : "/recommendations/new")
            }
          >
            {recommendationTypeTemplate ? "Create template" : "New recommendation"}
          </Button>
        </div>
      </div>

      <div className="mb-6 grid w-full grid-cols-[minmax(0,580px)_auto] items-center justify-between gap-2.5 max-md:block">
        <CustomSearchInput
          inputStyle={{ maxWidth: "580px", width: "100%" }}
          value={searchQuery}
          placeholder="Search by keywords"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-[repeat(2,auto)] items-center">
          {!recommendationTypeTemplate && (
            <div className="relative">
              <button
                className="flex flex-col items-start gap-2.5 rounded-xl border border-grey-400 px-3 py-2 text-sm font-medium text-primary-900"
                onClick={handleModalStatus}
              >
                Status
              </button>

              {isModalStatus && (
                <div
                  ref={modalRef}
                  className="absolute right-0 top-12 z-[3] inline-flex flex-col items-start gap-2.5 rounded-lg bg-white p-4 shadow-[0_8px_24px_0_rgba(42,50,52,0.08)]"
                >
                  <h3 className="text-sm font-semibold text-primary-900">Status</h3>

                  <div className="grid grid-cols-[repeat(2,auto)] items-center gap-6">
                    <button className="grid grid-cols-[repeat(2,auto)] items-center gap-2">
                      {isOrdered ? (
                        <CheckboxCheckedIcon onClick={handleIsOrdered} />
                      ) : (
                        <CheckboxIcon onClick={handleIsOrdered} />
                      )}

                      <span className="w-max text-sm font-normal leading-normal text-primary-900">Ordered</span>
                    </button>

                    <button className="grid grid-cols-[repeat(2,auto)] items-center gap-2">
                      {isOrdered ? (
                        <CheckboxIcon onClick={handleIsOrdered} />
                      ) : (
                        <CheckboxCheckedIcon onClick={handleIsOrdered} />
                      )}
                      <span className="w-max text-sm font-normal leading-normal text-primary-900">Not Ordered</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="ml-2 max-md:ml-0">
            <Select onValueChange={setSelect}>
              <SelectTrigger className="w-[210px] rounded-xl max-md:w-full">
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
      </div>

      {recommendationTypeTemplate ? (
        filteredTemplates && filteredTemplates.length > 0 ? (
          filteredTemplates.map((template, index) => (
            <div
              className="mb-4 grid w-full grid-cols-[0.9fr_1fr_0.6fr_auto] content-between items-center justify-between rounded-xl bg-grey-200 p-4 last-of-type:mb-0"
              key={index}
            >
              <div>
                <h3 className="text-sm font-medium text-primary-900">{template?.basicInfo.recommendationName}</h3>
                <p className="text-sm font-medium text-grey-800">
                  Created: {new Date(template?.created).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-3">
                {template?.selectedProducts.slice(0, 4).map((product, idx) => (
                  <div className="relative" key={idx}>
                    <div
                      className={cn(
                        "pointer-events-none absolute left-1/2 top-1/2 z-[2] w-max max-w-[168px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/[.56] p-[5px] text-center text-sm font-medium text-primary-900 opacity-0 transition-opacity duration-300",
                        showProductName === `${index}-${product.id}-${idx}` && "opacity-80"
                      )}
                    >
                      {product?.title}
                    </div>
                    <div>
                      {product?.images
                        .slice(0, 1)
                        .map((image, imageIdx) => (
                          <Image
                            key={imageIdx}
                            onMouseOver={() => handleShowProductName(`${index}-${product.id}-${idx}`)}
                            onMouseOut={() => handleShowProductName(null)}
                            src={image.src}
                            alt={`Product Image ${imageIdx}`}
                            width={40}
                            height={40}
                          />
                        ))}
                    </div>
                  </div>
                ))}
                {template?.selectedProducts.length > 4 && (
                  <div
                    className="group relative flex w-[75px] cursor-pointer items-center justify-center rounded-md border border-grey-400 px-2.5 py-2 text-sm font-semibold text-primary-900 hover:bg-grey-200"
                    onMouseEnter={toggleMoreInfo}
                    onMouseLeave={toggleMoreInfo}
                  >
                    +{template.selectedProducts.length - 4} more
                    {showMoreInfo && (
                      <div className="relative">
                        <div className="absolute bottom-[34px] hidden w-[167px] -translate-x-[65%] translate-y-0 flex-col items-start gap-1.5 rounded-lg bg-white p-3 text-sm font-medium text-primary-900 group-hover:flex">
                          {template.selectedProducts.slice(4).map((product, idx) => (
                            <p key={idx}>{product?.title}</p>
                          ))}
                        </div>
                        <TriangleDownIcon className="absolute bottom-[18px] left-0 -translate-x-[180%] -translate-y-[60%] group-hover:block" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative flex items-center">
                <div className="ml-auto mr-[12px] cursor-pointer rounded-full bg-primary-500 px-[16px] py-[6px] text-sm font-normal text-white">
                  Send to client
                </div>
                {contextMenuIndex === index && (
                  <div className="absolute right-0 top-[45px] z-[5] flex w-[157px] flex-col items-start rounded-lg bg-white shadow-[0_8px_24px_0_rgba(42,50,52,0.08)]">
                    <Link
                      href={`/recommendations/templates//edit?tempId=${template?.id}`}
                      className="flex h-12 cursor-pointer items-center self-stretch rounded-t-lg px-4 py-0 pb-2 pt-4 text-sm font-normal text-primary-900 hover:bg-[rgba(220,221,222,0.43)]"
                    >
                      Edit
                    </Link>
                    <button
                      className="flex h-12 cursor-pointer items-center self-stretch rounded-b-lg px-4 py-0 pb-4 pt-2 text-sm font-normal text-[#eb5757] hover:bg-[rgba(220,221,222,0.43)]"
                      onClick={() => handleOpenDeletingRecommendationModal(template?.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {deletingRecommendationId === template?.id && (
                  <div className="fixed left-0 top-0 z-[2] h-screen w-screen bg-black/50">
                    <div className="relative left-1/2 top-1/2 z-[1] inline-flex h-[15%] w-full max-w-[383px] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-5 rounded-xl border-b border-grey-400 bg-white p-6">
                      <p>Are you sure you want to delete this template?</p>

                      <div className="flex items-start gap-2 self-stretch">
                        <button
                          className="flex h-9 shrink-0 grow basis-0 items-center justify-center gap-2 rounded-[98px] border border-grey-400 px-4 py-2 text-sm font-semibold text-primary-900"
                          onClick={handleCloseDeletingRecommendationModal}
                        >
                          Cancel
                        </button>
                        <button
                          className="flex h-9 shrink-0 grow basis-0 flex-col items-center justify-center gap-2.5 rounded-[45px] bg-[#ff3c3c] px-4 py-2 text-sm font-semibold text-white"
                          onClick={() => handleDeleteClick(template?.clients[0].id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div
                      className="absolute left-0 top-0 h-full w-full"
                      onClick={handleCloseDeletingRecommendationModal}
                    ></div>
                  </div>
                )}

                <ContextMenuIcon
                  className="m-1.5 cursor-pointer"
                  ref={modalContextMenuRef}
                  onClick={() => handleContextMenuStatus(index)}
                  contextMenuIndex={contextMenuIndex}
                  index={index}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="grid h-[60vh] content-center items-center justify-center justify-items-center">
            <Image src={templatesItemImage} alt="empty-templates" className="h-[74px] w-[74px]" />
            <h3 className="pt-4 text-base font-bold text-primary-900">It&apos;s still empty here</h3>
            <p className="px-0 py-2 text-sm font-medium text-[rgba(37,66,93,0.6)]">
              Create your own templates for different needs and send them to your customers
            </p>
            <Button
              variant="primary"
              onClick={() =>
                router.push(recommendationTypeTemplate ? "/recommendations/templates/new" : "/recommendations/new")
              }
            >
              {recommendationTypeTemplate ? "Create template" : "New recommendation"}
            </Button>
          </div>
        )
      ) : filteredRecommendations && filteredRecommendations.length > 0 ? (
        filteredRecommendations.map((recommendation, index) => (
          <div
            className="mb-4 grid w-full grid-cols-[0.9fr_1fr_0.6fr_auto] content-between items-center justify-between rounded-xl bg-grey-200 p-4 last-of-type:mb-0"
            key={index}
          >
            {/*<div>{JSON.stringify(recommendations, null, 2)}</div>*/}
            <div>
              <h3 className="text-sm font-medium text-primary-900">
                {recommendation?.clients[0].firstName} {recommendation?.clients[0].lastName}
              </h3>
              <p className="text-sm font-medium text-grey-800">
                Created: {new Date(recommendation.created).toLocaleDateString("en-GB")}
              </p>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-3">
              {recommendation?.selectedProducts.slice(0, 4).map((product, idx) => (
                <div className="relative" key={idx}>
                  <div
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-1/2 z-[2] w-max max-w-[168px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/[.56] p-[5px] text-center text-sm font-medium text-primary-900 opacity-0 transition-opacity duration-300",
                      showProductName === `${index}-${product.id}-${idx}` && "opacity-80"
                    )}
                  >
                    {product?.title}
                  </div>
                  <div>
                    {product?.images
                      .slice(0, 1)
                      .map((image, imageIdx) => (
                        <Image
                          key={imageIdx}
                          onMouseOver={() => handleShowProductName(`${index}-${product.id}-${idx}`)}
                          onMouseOut={() => handleShowProductName(null)}
                          src={image.src}
                          alt={`Product Image ${imageIdx}`}
                          width={40}
                          height={40}
                        />
                      ))}
                  </div>
                </div>
              ))}
              {recommendation?.selectedProducts.length > 4 && (
                <div
                  className="group relative flex w-[75px] cursor-pointer items-center justify-center rounded-md border border-grey-400 px-2.5 py-2 text-sm font-semibold text-primary-900 hover:bg-grey-200"
                  onMouseEnter={toggleMoreInfo}
                  onMouseLeave={toggleMoreInfo}
                >
                  +{recommendation.selectedProducts.length - 4} more
                  {showMoreInfo && (
                    <div className="relative">
                      <div className="absolute bottom-[34px] hidden w-[167px] -translate-x-[65%] translate-y-0 flex-col items-start gap-1.5 rounded-lg bg-white p-3 text-sm font-medium text-primary-900 group-hover:flex">
                        {recommendation.selectedProducts.slice(4).map((product, idx) => (
                          <p key={idx}>{product?.title}</p>
                        ))}
                      </div>
                      <TriangleDownIcon className="absolute bottom-[18px] left-0 -translate-x-[180%] -translate-y-[60%] group-hover:block" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon isActive={recommendation?.status === "ordered"} />
              <p className="text-sm font-medium text-primary-900">
                {recommendation?.status === "ordered" ? "Ordered" : "Not Ordered"}
              </p>
            </div>

            <div className="relative">
              {contextMenuIndex === index && (
                <div className="absolute right-0 top-[45px] z-[5] flex w-[157px] flex-col items-start rounded-lg bg-white shadow-[0_8px_24px_0_rgba(42,50,52,0.08)]">
                  <button
                    className="flex h-12 cursor-pointer items-center self-stretch rounded-t-lg px-4 py-0 pb-2 pt-4 text-sm font-normal text-primary-900 hover:bg-[rgba(220,221,222,0.43)]"
                    onClick={() => handleEditClick(recommendation?.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex h-12 cursor-pointer items-center self-stretch rounded-b-lg px-4 py-0 pb-4 pt-2 text-sm font-normal text-[#eb5757] hover:bg-[rgba(220,221,222,0.43)]"
                    onClick={() => handleOpenDeletingRecommendationModal(recommendation?.id)}
                  >
                    Delete
                  </button>
                </div>
              )}

              {deletingRecommendationId === recommendation?.clients[0].id && (
                <div className="fixed left-0 top-0 z-[2] h-screen w-screen bg-black/50">
                  <div className="relative left-1/2 top-1/2 z-[1] inline-flex h-[15%] w-full max-w-[383px] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-5 rounded-xl border-b border-grey-400 bg-white p-6">
                    <p className="text-sm font-medium text-primary-900">
                      Are you sure you want to delete this template?
                    </p>

                    <div>
                      <button
                        className="flex h-9 shrink-0 grow basis-0 items-center justify-center gap-2 rounded-[98px] border border-grey-400 px-4 py-2 text-sm font-semibold text-primary-900"
                        onClick={handleCloseDeletingRecommendationModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-9 shrink-0 grow basis-0 flex-col items-center justify-center gap-2.5 rounded-[45px] bg-[#ff3c3c] px-4 py-2 text-sm font-semibold text-white"
                        onClick={() => handleDeleteClick(recommendation?.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div
                    className="absolute left-0 top-0 h-full w-full"
                    onClick={handleCloseDeletingRecommendationModal}
                  ></div>
                </div>
              )}

              <ContextMenuIcon
                className="m-1.5 cursor-pointer"
                ref={modalContextMenuRef}
                onClick={() => handleContextMenuStatus(index)}
                contextMenuIndex={contextMenuIndex}
                index={index}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="grid h-[60vh] content-center items-center justify-center justify-items-center">
          <Image src={emptyRecommendations} alt="empty-recommendations" width={74} height={74} />
          <h3 className="pt-4 text-base font-bold text-primary-900">It&apos;s still empty here</h3>
          <p className="px-0 py-2 text-sm font-medium text-[rgba(37,66,93,0.6)]">
            Create your first recommendation and send it to your client
          </p>
          <Link href="/recommendations/new">
            <div className="text-md my-2 cursor-pointer rounded-3xl border border-primary-500 bg-primary-500 p-2 px-4 py-2 text-sm font-semibold text-white">
              New recommendation
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

export default RecommendationsPage

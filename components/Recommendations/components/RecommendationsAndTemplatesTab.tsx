import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { ContextMenuIcon, StatusIcon, TriangleDownIcon } from "@/icons"
import { cn } from "@/lib/utils"
import { Recommendation, Template } from "@/models/recommendation"
import { useTemplateStore } from "@/stores/template"

import ConfirmationModal from "./ConfirmationModal"

interface RecommendationsAndTemplatesTabProps {
  data: Recommendation
  index: number
  showProductName: string
  handleShowProductName: (value: string | null) => void
  toggleMoreInfo: () => void
  showMoreInfo: boolean
  contextMenuIndex: number
  handleOpenDeletingRecommendationModal: (value: string | null) => void
  handleDeleteClick: () => Promise<void>
  deletingRecommendationId: string | number | null
  isTemplate?: boolean
}

const RecommendationsAndTemplatesTab: React.FC<RecommendationsAndTemplatesTabProps> = ({
  data,
  index,
  showProductName,
  handleShowProductName,
  toggleMoreInfo,
  showMoreInfo,
  contextMenuIndex,
  handleOpenDeletingRecommendationModal,
  handleDeleteClick,
  deletingRecommendationId,
  isTemplate = false,
}) => {
  const router = useRouter()

  const { setTemplate } = useTemplateStore()

  const handleUseTemplate = (template: Template) => {
    setTemplate(template)

    router.push(`/recommendations/new`)
  }

  return (
    <div className="bg-grey-200 mb-4 grid w-full grid-cols-[0.9fr_1fr_0.6fr_auto] content-between items-center justify-between rounded-xl p-4 last-of-type:mb-0">
      <div>
        <h3 className="text-primary-900 text-sm font-medium">
          {isTemplate
            ? data?.basicInfo.recommendationName
            : `${data?.clients[0].firstName} ${data?.clients[0].lastName}`}
        </h3>
        <p className="text-grey-800 text-sm font-medium">
          Created: {new Date(data?.created).toLocaleDateString("en-GB")}
        </p>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-3">
        {data?.selectedProducts.slice(0, 4).map((product, idx) => (
          <div className="relative" key={idx}>
            <div
              className={cn(
                "text-primary-900 pointer-events-none absolute top-1/2 left-1/2 z-2 w-max max-w-[168px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/[.56] p-[5px] text-center text-sm font-medium opacity-0 transition-opacity duration-300",
                showProductName === `${index}-${product.id}-${idx}` && "opacity-80"
              )}
            >
              {product?.title}
            </div>
            <div>
              {product?.images.edges
                .slice(0, 1)
                .map(
                  (image, imageIdx) =>
                    image?.node?.src && (
                      <Image
                        key={imageIdx}
                        onMouseOver={() => handleShowProductName(`${index}-${product.id}-${idx}`)}
                        onMouseOut={() => handleShowProductName(null)}
                        src={image.node.src}
                        alt={image.node.altText ?? ""}
                        width={40}
                        height={40}
                      />
                    )
                )}
            </div>
          </div>
        ))}
        {data?.selectedProducts.length > 4 && (
          <div
            className="group border-grey-400 text-primary-900 hover:bg-grey-200 relative flex w-[75px] cursor-pointer items-center justify-center rounded-md border px-2.5 py-2 text-sm font-semibold"
            onMouseEnter={toggleMoreInfo}
            onMouseLeave={toggleMoreInfo}
          >
            +{data.selectedProducts.length - 4} more
            {showMoreInfo && (
              <div className="relative">
                <div className="text-primary-900 absolute bottom-[34px] hidden w-[167px] -translate-x-[65%] translate-y-0 flex-col items-start gap-1.5 rounded-lg bg-white p-3 text-sm font-medium group-hover:flex">
                  {data.selectedProducts.slice(4).map((product, idx) => (
                    <p key={idx}>{product?.title}</p>
                  ))}
                </div>
                <TriangleDownIcon className="absolute bottom-[18px] left-0 -translate-x-[180%] -translate-y-[60%] group-hover:block" />
              </div>
            )}
          </div>
        )}
      </div>
      {!isTemplate && (
        <div className="flex items-center gap-2">
          <StatusIcon isActive={data?.status === "ordered"} />
          <p className="text-primary-900 text-sm font-medium">
            {data?.status === "ordered" ? "Ordered" : "Not Ordered"}
          </p>
        </div>
      )}
      {isTemplate && (
        <div
          className="bg-primary-500 mr-[12px] ml-auto cursor-pointer rounded-full px-[16px] py-[6px] text-sm font-normal text-white"
          onClick={() => handleUseTemplate(data)}
        >
          Send to client
        </div>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <ContextMenuIcon className="m-1.5 cursor-pointer" contextMenuIndex={contextMenuIndex} index={index} />
        </PopoverTrigger>
        <PopoverContent className="w- w-39 gap-0 p-0">
          <button
            className="text-primary-900 flex h-12 cursor-pointer items-center self-stretch rounded-t-lg px-4 py-0 pt-4 pb-2 text-sm font-normal ring-transparent hover:bg-[rgba(220,221,222,0.43)] focus:outline-hidden"
            onClick={() =>
              isTemplate
                ? router.push(`/recommendations/templates//edit?tempId=${data?.id}`)
                : router.push(`/recommendations/edit?id=${data?.id}`)
            }
          >
            Edit
          </button>
          <button
            className="flex h-12 cursor-pointer items-center self-stretch rounded-b-lg px-4 py-0 pt-2 pb-4 text-sm font-normal text-[#eb5757] hover:bg-[rgba(220,221,222,0.43)] focus:outline-hidden"
            onClick={() => handleOpenDeletingRecommendationModal(data?.id)}
          >
            Delete
          </button>
        </PopoverContent>
      </Popover>
      <ConfirmationModal
        isOpen={deletingRecommendationId === data?.id}
        onClose={() => handleOpenDeletingRecommendationModal(null)}
        onConfirm={handleDeleteClick}
        message="Are you sure you want to delete this template?"
      />
    </div>
  )
}

export default RecommendationsAndTemplatesTab

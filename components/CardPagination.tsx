import React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { CardPaginationData } from "@/interfaces/pagination"

interface CardPaginationProps {
  pagination?: CardPaginationData
  onPageChange: (page: number) => void
}

export const CardPagination: React.FC<CardPaginationProps> = ({ pagination, onPageChange }) => {
  if (!pagination) return

  return (
    <div className="mt-4 flex w-full items-center justify-between">
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
        onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
        disabled={pagination.currentPage <= 1}
      >
        <ArrowLeft size={16} className={pagination.currentPage <= 1 ? "text-blue-550" : "text-primary-900"} />
      </button>

      <div className="text-primary-900 text-sm font-medium">
        Page {pagination.currentPage} of {pagination.totalPages}
      </div>

      <button
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
        onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
        disabled={pagination.currentPage >= pagination.totalPages}
      >
        <ArrowRight
          size={16}
          className={pagination.currentPage >= pagination.totalPages ? "text-blue-550" : "text-primary-900"}
        />
      </button>
    </div>
  )
}

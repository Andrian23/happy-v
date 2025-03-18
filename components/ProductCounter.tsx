import React, { useCallback, useEffect, useState } from "react"

import { Minus } from "@/icons/Minus"
import Plus from "@/icons/Plus"

interface ProductCounterProps {
  onCountChange: (count: number) => void
  defaultCount?: number
  idDisabled?: boolean
}

export const ProductCounter: React.FC<ProductCounterProps> = ({
  onCountChange,
  defaultCount = 1,
  idDisabled = false,
}) => {
  const [count, setCount] = useState(defaultCount)

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  const handleDecrement = useCallback(() => {
    setCount((prev) => (prev === 1 ? prev : prev - 1))
  }, [])

  useEffect(() => {
    onCountChange(count)
  }, [count, onCountChange])

  return (
    <div
      className={`rounded-6xl border-grey-400 text-primary-900 flex h-9 items-center gap-4 border px-3 py-2 font-semibold ${idDisabled ? "cursor-not-allowed opacity-50" : ""} `}
    >
      <span
        role="button"
        aria-disabled={count === 1}
        onClick={handleDecrement}
        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </span>
      <span className="select-none">{count}</span>
      <span
        role="button"
        onClick={handleIncrement}
        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
      >
        <Plus className="h-3 w-3" />
      </span>
    </div>
  )
}

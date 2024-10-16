import { useEffect, useState } from "react"

export type SortKey = "a-z" | "z-a" | "last-updated-newest" | "last-updated-oldest"

const useSort = <T>(
  data: T[] | null,
  select: SortKey,
  getValue: (item: T) => string,
  getDate?: (item: T) => Date
): T[] => {
  const [sortedData, setSortedData] = useState<T[]>([])

  const sortData = (dataToSort: T[]) => {
    switch (select) {
      case "a-z":
        return dataToSort.sort((a, b) => getValue(a)?.localeCompare(getValue(b)))

      case "z-a":
        return dataToSort.sort((a, b) => getValue(b)?.localeCompare(getValue(a)))

      case "last-updated-newest":
        if (getDate) {
          return dataToSort.sort((a, b) => getDate(b).getTime() - getDate(a).getTime())
        }
        break

      case "last-updated-oldest":
        if (getDate) {
          return dataToSort.sort((a, b) => getDate(a).getTime() - getDate(b).getTime())
        }
        break

      default:
        return dataToSort
    }
  }

  useEffect(() => {
    if (!data) return

    const dataToSort = [...(data || [])]
    const sorted = sortData(dataToSort)
    setSortedData(sorted as T[])
  }, [data, select])

  return sortedData
}

export default useSort

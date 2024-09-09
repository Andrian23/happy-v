import { useEffect } from "react"

const useHandleStorageChange = (handler: () => void, initialCalculation: boolean = false) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (initialCalculation) {
        handler()
      }

      window.addEventListener("storage", handler)

      return () => {
        window.removeEventListener("storage", handler)
      }
    }
  }, [handler, initialCalculation])
}

export default useHandleStorageChange

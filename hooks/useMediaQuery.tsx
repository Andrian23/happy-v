"use client"

import { useCallback, useSyncExternalStore } from "react"

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query)

      matchMedia.addEventListener("change", callback)
      return () => {
        matchMedia.removeEventListener("change", callback)
      }
    },
    [query]
  )

  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  const getServerSnapshot = () => true

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

import { Dispatch, SetStateAction, useEffect, useState } from "react"

const useLocalStorage = <T>(item: string, initialValue: T, key?: string): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(item)
      if (storedValue) {
        const parsedValue = JSON.parse(storedValue)
        setValue(key ? parsedValue[key] : parsedValue)
      }
    }
  }, [item, key])

  return [value, setValue]
}

export default useLocalStorage

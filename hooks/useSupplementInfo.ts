import { useEffect, useState } from "react"

import { MetafieldEdge } from "@/models/product"
import { ShopifyProduct } from "@/models/product"

type SupplementNotes = {
  dvNote: string
  percentDailyValue: string
}

interface SupplementInfo {
  servingSize: string
  servingsNumber: string
  bottleSize: string
  supplementFacts: string
  otherIngredients: string
  bottleSizeFirst: string
  bottleSizeSecond: string
  notes: SupplementNotes
}

const extractMetafieldValue = (metafields: MetafieldEdge[], key: string): string => {
  return metafields.find((edge) => edge.node.key === key)?.node.value || ""
}

const decodeHtmlText = (text: string): string => {
  const element = document.createElement("div")
  element.innerHTML = text
  return element.textContent || ""
}

const extractServingInfoFromElement = (
  elements: NodeListOf<Element>
): { servingSize: string; servingsNumber: string } => {
  let servingSize = ""
  let servingsNumber = ""

  elements.forEach((element) => {
    const parentText = element.parentElement?.textContent || ""

    if (element.textContent?.includes("Serving Size:")) {
      servingSize = decodeHtmlText(parentText.replace("Serving Size:", "").split("Servings Per Container:")[0].trim())
    }
    if (element.textContent?.includes("Servings Per Container:")) {
      servingsNumber = decodeHtmlText(
        parentText
          .split("Servings Per Container:")[1]
          ?.split(/[^0-9]/)[0]
          ?.trim() || ""
      )
    }
  })

  return { servingSize, servingsNumber }
}

const extractServingInfoFromText = (htmlText: string): { servingSize: string; servingsNumber: string } => {
  const decodedHtml = decodeHtmlText(htmlText)
  const servingSizeMatch = decodedHtml.match(/Serving Size:.*?([^:<]*?)(?:<br|<\/p|Servings Per)/)
  const servingsMatch = decodedHtml.match(/Servings Per Container:.*?(\d+)/)

  return {
    servingSize: servingSizeMatch?.[1]?.trim() || "",
    servingsNumber: servingsMatch?.[1]?.trim() || "",
  }
}

const extractNotes = (doc: Document): SupplementNotes => {
  const smallElements = doc.getElementsByClassName("small")
  let dvNote = ""
  let percentDailyValue = ""

  Array.from(smallElements).forEach((element) => {
    const text = decodeHtmlText(element.textContent?.trim() || "")
    if (text.includes("%DV based on") || text.includes("calorie diet")) {
      dvNote = text
    } else if (text.includes("Daily Value not established") || text.includes("Percent Daily Value")) {
      percentDailyValue = text
    }
  })

  return { dvNote, percentDailyValue }
}

const parseSupplementFacts = (supplementFactsHtml: string) => {
  if (!supplementFactsHtml) {
    return {
      servingSize: "",
      servingsNumber: "",
      notes: { dvNote: "", percentDailyValue: "" },
    }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(supplementFactsHtml, "text/html")

  const strongElements = doc.querySelectorAll("strong")
  let { servingSize, servingsNumber } = extractServingInfoFromElement(strongElements)

  if (!servingSize || !servingsNumber) {
    const fallbackInfo = extractServingInfoFromText(supplementFactsHtml)
    servingSize = servingSize || fallbackInfo.servingSize
    servingsNumber = servingsNumber || fallbackInfo.servingsNumber
  }

  const notes = extractNotes(doc)

  return { servingSize, servingsNumber, notes }
}

const createEmptySupplementInfo = (): SupplementInfo => ({
  servingSize: "",
  servingsNumber: "",
  bottleSize: "",
  supplementFacts: "",
  otherIngredients: "",
  bottleSizeFirst: "",
  bottleSizeSecond: "",
  notes: {
    dvNote: "",
    percentDailyValue: "",
  },
})

export function useSupplementInfo(product: ShopifyProduct) {
  const [supplementInfo, setSupplementInfo] = useState<SupplementInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const metafields = product.metafields.edges
      const supplementFactsHtml = extractMetafieldValue(metafields, "p_suppfacts")

      if (!supplementFactsHtml) {
        setSupplementInfo(createEmptySupplementInfo())
        return
      }

      const parsedInfo = parseSupplementFacts(supplementFactsHtml)
      setSupplementInfo({
        ...parsedInfo,
        bottleSize: extractMetafieldValue(metafields, "product_bottle_size"),
        supplementFacts: supplementFactsHtml,
        otherIngredients: extractMetafieldValue(metafields, "p_suppfacts_bottom"),
        bottleSizeFirst: extractMetafieldValue(metafields, "product_bottle_size_2"),
        bottleSizeSecond: extractMetafieldValue(metafields, "p_serving"),
        notes: parsedInfo.notes,
      })
    } catch (error) {
      console.error("Error extracting supplement info:", error)
      setSupplementInfo(null)
    } finally {
      setIsLoading(false)
    }
  }, [product])

  return { supplementInfo, isLoading }
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractShopifyProductId(gid: string): string | null {
  const match = gid.match(/^gid:\/\/shopify\/Product\/(\d+)$/)
  return match ? match[1] : null
}

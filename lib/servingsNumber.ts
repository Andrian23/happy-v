export const servingsNumber = (text?: string) => {
  if (!text) return null

  const match = text.match(/\d+/g)
  return match ? match[match.length - 1] : ""
}

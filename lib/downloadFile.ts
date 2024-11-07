export const downloadFile = (fileUrl: string, fileName?: string) => {
  const link = document.createElement("a")
  link.href = fileUrl
  link.download = fileName || fileUrl.split("/").pop() || "download"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

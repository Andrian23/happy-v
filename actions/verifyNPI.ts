"use server"

export async function verifyNPI(npiNumber: string, firstName?: string, lastName?: string) {
  if (!npiNumber || !/^\d{10}$/.test(npiNumber)) {
    return {
      isVerified: false,
      error: "Invalid NPI format. Must be 10 digits.",
    }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`https://npiregistry.cms.hhs.gov/api/?number=${npiNumber}&version=2.1`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      const status = response.status
      if (status === 429) {
        return { isVerified: false, error: "Rate limit exceeded. Try again later." }
      }

      return { isVerified: false, error: `API returned ${status}` }
    }

    const data = await response.json()

    if (!data || typeof data.result_count !== "number") {
      return { isVerified: false, error: "Invalid API response format" }
    }

    if (data.result_count === 0) {
      return { isVerified: false, error: "NPI not found" }
    }

    const providerData = data.results[0]

    if (providerData.basic?.status !== "A") {
      return {
        isVerified: false,
        error: "NPI is not active",
      }
    }

    if (firstName && lastName) {
      const registryFirstName = (providerData.basic?.first_name || "").toLowerCase()
      const registryLastName = (providerData.basic?.last_name || "").toLowerCase()

      if (firstName.toLowerCase() !== registryFirstName || lastName.toLowerCase() !== registryLastName) {
        return {
          isVerified: false,
          error: "Name doesn't match NPI registry records",
        }
      }
    }

    return {
      isVerified: true,
      providerData: providerData,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { isVerified: false, error: "Verification request timed out" }
      }
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return { isVerified: false, error: "Network error. Please check your connection." }
      }

      return {
        isVerified: false,
        error: error.message,
      }
    }

    return {
      isVerified: false,
      error: "Verification failed",
    }
  }
}

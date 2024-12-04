"use server"

type StorefrontConfig = {
  readonly storefrontAccessToken: string
}

type GraphQLErrorLocation = {
  line: number
  column: number
}

type GraphQLError = {
  message: string
  locations?: GraphQLErrorLocation[]
  path?: string[]
  extensions?: Record<string, unknown>
}

type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}

type StorefrontError = {
  message: string
  response: GraphQLResponse<unknown> | null
  statusCode?: number
}

const SHOPIFY_CONFIG: StorefrontConfig = {
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
} as const

const getStorefrontApiUrl = (): string => {
  return `https://happy-v.myshopify.com/api/2024-10/graphql.json`
}

const isGraphQLResponse = <T>(json: unknown): json is GraphQLResponse<T> => {
  return typeof json === "object" && json !== null && ("data" in json || "errors" in json)
}

const validateConfig = (config: StorefrontConfig): void => {
  if (!config.storefrontAccessToken) {
    throw createStorefrontError("Shopify Storefront access token is required", null)
  }
}

const createStorefrontError = (
  message: string,
  response: GraphQLResponse<unknown> | null,
  statusCode?: number
): Error & StorefrontError => {
  return {
    name: "StorefrontError",
    message,
    response,
    statusCode,
  }
}

const handleGraphQLErrors = (response: GraphQLResponse<unknown>): void => {
  if (response.errors) {
    const nonSellingPlanErrors = response.errors.filter(
      (error) => !error.message.includes("unauthenticated_read_selling_plans")
    )

    if (nonSellingPlanErrors.length > 0) {
      throw createStorefrontError(`GraphQL Error: ${nonSellingPlanErrors[0].message}`, response)
    }
  }

  if (!response.data) {
    throw createStorefrontError("No data returned from query", response)
  }
}

export async function fetchShopifyStorefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  try {
    validateConfig(SHOPIFY_CONFIG)

    const response = await fetch(getStorefrontApiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    })

    const json = await response.json()

    if (!response.ok) {
      throw createStorefrontError(
        `HTTP error! status: ${response.status}`,
        isGraphQLResponse(json) ? json : null,
        response.status
      )
    }

    if (!isGraphQLResponse<T>(json)) {
      throw createStorefrontError("Invalid response format", null)
    }

    handleGraphQLErrors(json)

    return json.data as T
  } catch (error) {
    if (isStorefrontError(error)) {
      throw error
    }
    throw createStorefrontError(error instanceof Error ? error.message : "Unknown error occurred", null)
  }
}

const isStorefrontError = (error: unknown): error is Error & StorefrontError => {
  return error instanceof Error && "response" in error
}

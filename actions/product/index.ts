"use server"

import { ShopifyProduct } from "@/models/product"

import { queryCollections, queryProductById, queryProductsByCollectionId } from "./graphqlQueries"

interface GraphQLResponse<T> {
  data: T
  errors?: { message: string }[]
}

interface Collection {
  id: string
  title: string
}

interface CollectionResponse {
  collections: {
    edges: { node: Collection }[]
  }
}

interface ProductsResponse {
  collection: {
    products: {
      edges: { node: ShopifyProduct }[]
    }
  }
}

interface ProductResponse {
  product: ShopifyProduct
}

interface Metaobject {
  id: string
  type: string
  fields: { key: string; value: string }[]
}

async function fetchGraphQL<T>(query: string, variables: object = {}): Promise<T> {
  const response = await fetch(`https://happy-v.myshopify.com/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  })

  const result: GraphQLResponse<T> = await response.json()

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors.map((e) => e.message).join(", ")}`)
  }

  return result.data
}

async function getCollections(): Promise<Collection[]> {
  const data = await fetchGraphQL<CollectionResponse>(queryCollections)
  return data.collections.edges.map((edge) => edge.node)
}

async function getCollectionId(): Promise<string | null> {
  const collections = await getCollections()
  const deapCollection = collections.find((collection) => collection.title === "DEAP")

  if (!deapCollection) {
    console.error("Collection 'DEAP' not found")
    return null
  }

  return deapCollection.id
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  const collectionId = await getCollectionId()

  if (!collectionId) {
    return []
  }

  const query = queryProductsByCollectionId(collectionId)
  const data = await fetchGraphQL<ProductsResponse>(query)

  return data.collection.products.edges.map((edge) => edge.node)
}

export async function getProductById(productId: number): Promise<ShopifyProduct> {
  const variables = { id: `gid://shopify/Product/${productId}` }
  const data = await fetchGraphQL<ProductResponse>(queryProductById, variables)

  return data.product
}

interface IngredientDetail {
  name: string
  subName?: string
  amount: string
  dv?: string
  metaobject?: Metaobject
}

function parseSupplementFacts(html: string): IngredientDetail[] {
  const facts: IngredientDetail[] = []
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/g

  let match
  while ((match = rowPattern.exec(html)) !== null) {
    const row = match[1]
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g)

    if (!cells || cells.length < 2) continue

    const nameCell = cells[0].replace(/<td[^>]*>/g, "").replace(/<\/td>/g, "")
    const amountCell = cells[1].replace(/<td[^>]*>/g, "").replace(/<\/td>/g, "")

    const mainPart = nameCell.replace(/<span>.*?<\/span>/g, "").split(/<br\s*\/?>/)[0]
    const subPart = nameCell.match(/<span>\((.*?)\)<\/span>/)?.[1] || nameCell.split(/<br\s*\/?>/)[1]

    const name = mainPart
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim()
    const subName = subPart
      ?.replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim()

    const amount = amountCell
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim()

    facts.push({
      name,
      subName: subName || undefined,
      amount,
      dv: cells[2]
        ? cells[2]
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/[*]/g, "")
            .trim()
        : undefined,
    })
  }

  return facts
}

export async function getProductIngredients(product: ShopifyProduct): Promise<IngredientDetail[]> {
  const suppFactsEdge = product.metafields.edges.find((edge) => edge.node.key === "p_suppfacts")

  if (!suppFactsEdge) {
    console.error("No p_suppfacts found")
    return []
  }

  return parseSupplementFacts(suppFactsEdge.node.value)
}

export const queryCollections = /* GraphQL */ `
  query {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
          updatedAt
          sortOrder
        }
      }
    }
  }
`

export const queryProductsByCollectionId = (collectionId: string) => /* GraphQL */ `
  query {
    collection(id: "${collectionId}") {
      products(first: 100) {
        edges {
          node {
            id
            title
            status
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
            variants(first: 2) {
              edges {
                node {
                  id
                  sku
                  price
                  compareAtPrice
                  inventoryQuantity
                  sellingPlanGroups(first: 10) {
                    edges {
                      node {
                        id
                        name
                        options
                        sellingPlans(first: 10) {
                          edges {
                            node {
                              id
                              name
                              pricingPolicies {
                                ... on SellingPlanFixedPricingPolicy {
                                  adjustmentType
                                  adjustmentValue {
                                    ... on MoneyV2 {
                                      amount
                                      currencyCode
                                    }
                                    ... on SellingPlanPricingPolicyPercentageValue {
                                      percentage
                                    }
                                  }
                                }
                                ... on SellingPlanRecurringPricingPolicy {
                                  afterCycle
                                  adjustmentValue {
                                    ... on MoneyV2 {
                                      amount
                                      currencyCode
                                    }
                                    ... on SellingPlanPricingPolicyPercentageValue {
                                      percentage
                                    }
                                  }
                                  adjustmentType
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            metafields(namespace: "custom_fields", first: 100) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`

export const queryProductById = /* GraphQL */ `
  query getProductById($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      status
      images(first: 1) {
        edges {
          node {
            src
            altText
          }
        }
      }
      variants(first: 5) {
        edges {
          node {
            id
            title
            sku
            price
            inventoryQuantity
            compareAtPrice
            image {
              altText
              src
            }
            sellingPlanGroups(first: 10) {
              edges {
                node {
                  id
                  name
                  options
                  sellingPlans(first: 10) {
                    edges {
                      node {
                        id
                        name
                        pricingPolicies {
                          ... on SellingPlanFixedPricingPolicy {
                            adjustmentType
                            adjustmentValue {
                              ... on MoneyV2 {
                                __typename
                                amount
                                currencyCode
                              }
                              ... on SellingPlanPricingPolicyPercentageValue {
                                __typename
                                percentage
                              }
                            }
                          }
                          ... on SellingPlanRecurringPricingPolicy {
                            afterCycle
                            adjustmentValue {
                              ... on MoneyV2 {
                                __typename
                                amount
                                currencyCode
                              }
                              ... on SellingPlanPricingPolicyPercentageValue {
                                __typename
                                percentage
                              }
                            }
                            adjustmentType
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      metafields(first: 150) {
        edges {
          node {
            namespace
            key
            value
          }
        }
      }
    }
  }
`

export const queryMetaobjects = /* GraphQL */ `
  query getMetaobjects($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Metaobject {
        id
        type
        fields {
          key
          value
        }
      }
    }
  }
`

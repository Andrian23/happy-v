export const mutationCreateCart = /* GraphQL */ `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
        id
        attributes {
          key
          value
        }
        lines(first: 10) {
          edges {
            node {
              sellingPlanAllocation {
                sellingPlan {
                  options {
                    name
                    value
                  }
                  id
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    variants(first: 10) {
                      edges {
                        node {
                          id
                          title
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
      userErrors {
        field
        message
      }
    }
  }
`

export const mutationUpdateShippingAddress = /* GraphQL */ `
  mutation updateCartBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        buyerIdentity {
          email
          deliveryAddressPreferences {
            ... on MailingAddress {
              address1
              address2
              city
              country
              firstName
              lastName
              phone
              province
              zip
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const queryGetShippingMethods = /* GraphQL */ `
  query ($cartId: ID!) {
    cart(id: $cartId) {
      id
      availableShippingMethods {
        shippingMethod {
          id
          title
          priceV2 {
            amount
            currencyCode
          }
        }
      }
    }
  }
`

export const queryGetShippingRates = /* GraphQL */ `
  query getShippingRates($cartId: ID!) {
    cart(id: $cartId) {
      id
      cost {
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      deliveryGroups(first: 10) {
        edges {
          node {
            id
            deliveryOptions {
              code
              description
              handle
              title
              estimatedCost {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`

export const mutationUpdateSelectedShippingOption = /* GraphQL */ `
  mutation cartSelectedDeliveryOptionsUpdate(
    $cartId: ID!
    $selectedDeliveryOptions: [CartSelectedDeliveryOptionInput!]!
  ) {
    cartSelectedDeliveryOptionsUpdate(cartId: $cartId, selectedDeliveryOptions: $selectedDeliveryOptions) {
      cart {
        id
        deliveryGroups(first: 10) {
          edges {
            node {
              id
              selectedDeliveryOption {
                handle
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

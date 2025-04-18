export const queryOrderById = (orderId: string) => /* GraphQL */ `
  query {
    order(id: "${orderId}") {
      id
      name
      totalPrice
      createdAt
      tags
      displayFulfillmentStatus
      displayFinancialStatus
      currentSubtotalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      billingAddress {
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      fulfillments(first: 5) {
        trackingInfo {
          company
          number
          url
        }
      }
      customAttributes {
        key
        value
      }
      currentTaxLines {
        priceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      shippingLine {
        title
        originalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      lineItems(first: 5) {
        edges {
          node {
            quantity
            product {
              title
              variants(first: 5) {
                edges {
                  node {
                    sku
                    price
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const queryCustomerByEmail = (email: string) => /* GraphQL */ `
  query {
    customers(first: 1, query: "email:${email}") {
      edges {
        node {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`

export const mutationCreateCustomer = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        id
        email
        phone
        taxExempt
        firstName
      }
    }
  }
`

export const queryCustomerOrders = /* GraphQL */ `
  query CustomerOrders($customerId: ID!) {
    customer(id: $customerId) {
      id
      email
      numberOfOrders
      orders(first: 100, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            totalPrice
            createdAt
            tags
            displayFulfillmentStatus
            displayFinancialStatus
            fulfillments(first: 5) {
              trackingInfo {
                company
                number
                url
              }
            }
            lineItems(first: 5) {
              edges {
                node {
                  quantity
                  product {
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
                    variants(first: 1) {
                      edges {
                        node {
                          sku
                          price
                          inventoryQuantity
                        }
                      }
                    }
                  }
                }
              }
            }
            customAttributes {
              key
              value
            }
          }
        }
      }
    }
  }
`

export const mutationCreateOrder = `
  mutation OrderCreate($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
    orderCreate(order: $order, options: $options) {
      userErrors {
        field
        message
      }
      order {
        test
        id
        name
        tags
        sourceName
        sourceIdentifier
        customAttributes {
          key
          value
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        billingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        shippingLines(first: 10) {
          edges {
            node {
              title
              source
              code
              taxLines {
                title
                rate
                priceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              requiresShipping
              title
              quantity
              variant {
                id
              }
            }
          }
        }
        transactions {
          kind
          status
          gateway
          authorizationCode
          processedAt
          receiptJson
          amountSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

export const queryCustomerOrdersWithPagination = `
query GetCustomerOrders($customerId: ID!, $first: Int!, $after: String) {
  customer(id: $customerId) {
    orders(first: $first, after: $after) {
      edges {
        node {
          id
          name
          processedAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
              }
            }
          }
          customAttributes {
            key
            value
          }
          # Add any other order fields you need
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
`

export const CREATE_DISCOUNT_CODE = `
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 1) {
              nodes {
                code
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

export const GET_DISCOUNT_CODE_STATUS = `
  query getDiscountCode($code: String!) {
    codeDiscountNodeByCode(code: $code) {
      codeDiscount {
        ... on DiscountCodeBasic {
          status
          endsAt
          startsAt
        }
      }
    }
  }
`

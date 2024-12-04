export interface ShippingAddress {
  id: number
  userId: string
  firstName: string
  lastName: string
  address: string
  apartmentSuite?: string
  country: string
  stateProvince: string
  city: string
  postalZipCode: string
  phone: string
  email: string
}

export interface ShippingInfo {
  code: string
  title: string
  handle: string
  estimatedCost: { amount: string; currency: string }
  groupId: string
}

export interface TotalTaxAmount {
  amount: string
  currencyCode: string
}

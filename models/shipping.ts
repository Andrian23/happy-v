export interface ShippingMethod {
  type: string
  price: number
}

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

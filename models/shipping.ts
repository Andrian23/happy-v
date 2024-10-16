export interface ShippingMethod {
  type: string
  price: number
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
  email: string
}

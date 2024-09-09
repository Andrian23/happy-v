export interface ShippingMethod {
  type: string
  price: string
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

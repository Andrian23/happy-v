import { create } from "zustand"

import { BillingAddress } from "@/models/billing"
import { ShippingAddress } from "@/models/shipping"

type State = {
  shippingAddresses: ShippingAddress[]
  selectedShippingAddress: ShippingAddress | null
  billingAddress: BillingAddress | null
}

type Action = {
  setShippingAddresses: (addresses: ShippingAddress[]) => void
  setShippingAddress: (address: ShippingAddress) => void
  clearShippingAddress: () => void
  setBillingAddress: (address: BillingAddress) => void
  clearBillingAddress: () => void
}

export const useAddressStore = create<State & Action>((set) => ({
  shippingAddresses: [],
  selectedShippingAddress: null,
  billingAddress: null,
  setShippingAddresses: (addresses) => set({ shippingAddresses: addresses }),
  setShippingAddress: (address) => set({ selectedShippingAddress: address }),
  clearShippingAddress: () => set({ selectedShippingAddress: null }),
  setBillingAddress: (address) => set({ billingAddress: address }),
  clearBillingAddress: () => set({ billingAddress: null }),
}))

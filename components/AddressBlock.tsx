import { ShippingAddress } from "@/models/shipping"

const AddressBlock = ({ title, address }: { title: string; address: ShippingAddress }) => (
  <div className="h-auto rounded-2xl bg-white p-4 text-sm text-primary-900 max-lg:my-4 max-lg:w-full max-lg:text-xs">
    <div className="text-base font-semibold">{title}</div>
    <div className="my-2 text-sm font-medium">{`${address.firstName} ${address.lastName}`}</div>
    <div className="text-sm font-medium">{`${address.address}, Apartment ${address.apartmentSuite}, ${address.city}, ${address.stateProvince} ${address.postalZipCode}`}</div>
    <div className="my-2 text-sm font-medium">{address.country}</div>
    <div className="text-sm font-medium">{address.phone}</div>
  </div>
)

export default AddressBlock

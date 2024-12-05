import { Address } from "@/models/order"

const AddressBlock = ({ title, address }: { title: string; address: Address }) => (
  <div className="h-auto rounded-2xl bg-white p-4 text-sm text-primary-900 max-lg:my-4 max-lg:w-full max-lg:text-xs">
    <div className="text-base font-semibold">{title}</div>
    <div className="my-2 text-sm font-medium">{`${address.firstName} ${address.lastName}`}</div>
    <div className="text-sm font-medium">{`${address.address1}, Apartment ${address.address2}, ${address.city}, ${address.province} ${address.zip}`}</div>
    <div className="my-2 text-sm font-medium">{address.country}</div>
    <div className="text-sm font-medium">{address.phone}</div>
  </div>
)

export default AddressBlock

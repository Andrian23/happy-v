import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"

import type { UserCard } from "@/interfaces/payment"
import type { ShippingAddress } from "@/models/shipping"
import settingsPaymentIcon from "@/public/SettingsPayment.svg"
import visaLogo from "@/public/Visa.svg"

import SettingsPaymentEditModal from "./SettingsPaymentEditModal"
import SettingsPaymentModal from "./SettingsPaymentModal"

const SettingsPayment = () => {
  const [userCard, setUserCard] = useState<UserCard | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const card = localStorage.getItem("userCard")
    if (card) {
      setUserCard(JSON.parse(card))
    }

    const address = localStorage.getItem("shippingAddress")
    if (address) {
      setShippingAddress(JSON.parse(address))
    }
  }, [])

  const handleDelete = () => {
    localStorage.removeItem("userCard")
    window.location.reload()
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  return (
    <>
      {userCard ? (
        <div className="my-4 h-auto w-[60%] rounded-2xl bg-grey-200 p-4 max-lg:w-full">
          <div className="flex items-center justify-between text-sm">
            <Image src={visaLogo} alt="Visa" className="h-3 w-10" />
            <div className="rounded-full bg-primary-500 px-2 py-1 text-[12px] text-white">Default</div>
          </div>
          <div className="my-2 text-sm">**** **** **** {userCard.cardNumber.slice(-4)}</div>
          {shippingAddress && (
            <>
              <div className="mt-2 text-sm text-grey-800">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </div>
              <div className="mt-2 text-sm text-grey-800">
                {shippingAddress.address}, Apartment {shippingAddress.apartment}, {shippingAddress.city},{" "}
                {shippingAddress.province} {shippingAddress.postalCode}, {shippingAddress.country}
              </div>
            </>
          )}
          <div className="mt-2 flex items-center justify-start text-sm">
            <div
              className="cursor-pointer rounded-full border border-grey-400 px-3 py-2 text-primary-900"
              onClick={handleOpenEditModal}
            >
              Edit
            </div>
            <div
              className="ml-2 cursor-pointer rounded-full border border-grey-400 px-3 py-2 text-[#FF3C3C]"
              onClick={handleDelete}
            >
              Delete
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[80vh] w-full items-center justify-center">
          <div className="text-center">
            <div className="m-auto w-fit rounded-full bg-grey-200 p-4">
              <Image src={settingsPaymentIcon} alt="Cart" className="h-[42px] w-[42px]" />
            </div>
            <div className="mt-2 text-sm font-medium text-primary-900">It&apos;s still empty here</div>
            <div className="mt-2 text-sm text-grey-800">You have not added any payment method yet</div>
            <div className="flex items-center justify-center">
              <div
                className="mt-2 flex w-fit cursor-pointer items-center justify-center rounded-full bg-primary-500 px-4 py-2"
                onClick={handleOpenModal}
              >
                <Plus width={20} height={20} color="#fff" />
                <div className="ml-2 text-sm text-white">Add payment method</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && <SettingsPaymentEditModal onClose={handleCloseEditModal} />}
      {isModalOpen && <SettingsPaymentModal onClose={handleCloseModal} />}
    </>
  )
}

export default SettingsPayment

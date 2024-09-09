import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"

import type { ShippingAddress } from "@/models/shipping"
import settingCartIcon from "@/public/SettingsCart.svg"

import SettingsShippingEditModal from "./SettingsShippingEditModal"
import SettingsShippingModal from "./SettingsShippingModal"

const SettingsShipping: React.FC = () => {
  const [empty, setEmpty] = useState(false)
  const [shippingData, setShippingData] = useState<ShippingAddress | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    const shippingAddress = localStorage.getItem("shippingAddress")
    if (shippingAddress) {
      setEmpty(false)
      setShippingData(JSON.parse(shippingAddress))
    } else {
      setEmpty(true)
    }
  }, [])

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  const handleDeleteClick = () => {
    localStorage.removeItem("shippingAddress")
    window.location.reload()
  }

  const handleAddClick = () => {
    setShowModal(true)
  }

  return (
    <>
      {showModal && <SettingsShippingModal onClose={() => setShowModal(false)} />}
      {showEditModal && (
        <SettingsShippingEditModal shippingData={shippingData} onClose={() => setShowEditModal(false)} />
      )}
      {empty === true ? (
        <div className="flex h-[80vh] w-full items-center justify-center">
          <div className="text-center">
            <div className="m-auto w-fit rounded-full bg-grey-200 p-4">
              <Image src={settingCartIcon} alt="Cart" className="h-[42px] w-[42px]" />
            </div>
            <div className="mt-2 text-sm font-medium text-primary-900">It&apos;s still empty here</div>
            <div className="mt-2 text-sm text-grey-800">You have not added any address yet</div>
            <div className="flex items-center justify-center">
              <div
                className="mt-2 flex w-fit cursor-pointer items-center justify-center rounded-full bg-primary-500 px-4 py-2"
                onClick={handleAddClick}
              >
                <Plus width={20} height={20} color="#fff" />
                <div className="ml-2 text-sm text-white">Add address</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        shippingData && (
          <div className="my-4 h-auto w-[60%] rounded-2xl bg-grey-200 p-4 max-lg:w-full">
            <div className="flex items-center justify-between text-sm">
              <div>
                {shippingData.firstName} {shippingData.lastName}
              </div>
              <div className="rounded-full bg-primary-500 px-2 py-1 text-[12px] text-white">Default</div>
            </div>
            <div className="mt-2 text-sm">
              {shippingData.address}, Apartment {shippingData.apartment}, {shippingData.city}, {shippingData.province}{" "}
              {shippingData.postalCode}
            </div>
            <div className="mt-2 text-sm">{shippingData.country}</div>
            <div className="mt-2 text-sm">{shippingData.phone}</div>
            <div className="mt-2 flex items-center justify-start text-sm">
              <div
                className="cursor-pointer rounded-full border border-grey-400 px-3 py-2 text-primary-900"
                onClick={handleEditClick}
              >
                Edit
              </div>
              <div
                className="ml-2 cursor-pointer rounded-full border border-grey-400 px-3 py-2 text-[#FF3C3C]"
                onClick={handleDeleteClick}
              >
                Delete
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default SettingsShipping

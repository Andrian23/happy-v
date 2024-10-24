import React, { Dispatch, SetStateAction, useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"

import { deleteShippingAddress } from "@/actions/shippingAddress"
import type { ShippingAddress } from "@/models/shipping"
import settingCartIcon from "@/public/SettingsCart.svg"

import SettingsShippingModal from "./SettingsShippingModal"

interface SettingsShippingProps {
  defaultShippingAddressId?: number | null
  setShippingData: React.Dispatch<React.SetStateAction<ShippingAddress[]>>
  shippingData: ShippingAddress[]
  setIsProfileUpdated?: Dispatch<SetStateAction<boolean>>
}

const SettingsShipping: React.FC<SettingsShippingProps> = ({
  defaultShippingAddressId,
  setShippingData,
  shippingData,
  setIsProfileUpdated,
}) => {
  const [empty, setEmpty] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isShowModal, setIsShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEditAddress = (id: number) => {
    setSelectedAddressId(id)
    setShowEditModal(true)
  }

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteShippingAddress(id)
      setShippingData((prevData) => prevData.filter((address) => address.id !== id))

      if (shippingData.length === 0) {
        setEmpty(true)
      }

      if (setIsProfileUpdated) {
        setIsProfileUpdated(true)
      }
    } catch (error) {
      console.error("Failed to delete address:", error)
    }
  }

  const handleAddClick = () => {
    setIsShowModal(true)
  }

  return (
    <>
      {isShowModal && (
        <SettingsShippingModal
          onClose={() => setIsShowModal(false)}
          setShippingData={setShippingData}
          setIsProfileUpdated={setIsProfileUpdated}
        />
      )}
      {showEditModal && shippingData && (
        <SettingsShippingModal
          shippingData={shippingData.find((address) => address.id === selectedAddressId)}
          onClose={() => {
            setShowEditModal(false)
            setSelectedAddressId(null)
          }}
          setShippingData={setShippingData}
          setIsProfileUpdated={setIsProfileUpdated}
        />
      )}
      {empty || shippingData.length === 0 ? (
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
        shippingData.length > 0 &&
        shippingData.map(
          ({
            firstName,
            lastName,
            address,
            postalZipCode,
            apartmentSuite,
            country,
            city,
            stateProvince,
            phone,
            id,
          }) => (
            <div className="my-4 h-auto w-[60%] rounded-2xl bg-grey-200 p-4 max-lg:w-full" key={id}>
              <div className="flex items-center justify-between text-sm">
                <div>
                  {firstName} {lastName}
                </div>
                {defaultShippingAddressId === id && (
                  <div className="rounded-full bg-primary-500 px-2 py-1 text-[12px] text-white">Default</div>
                )}
              </div>
              <div className="mt-2 text-sm">
                {address}, Apartment {apartmentSuite}, {city}, {stateProvince} {postalZipCode}
              </div>
              <div className="mt-2 text-sm">{country}</div>
              <div className="mt-2 text-sm">{phone}</div>
              <div className="mt-2 flex items-center justify-start text-sm">
                <div
                  className="cursor-pointer rounded-full border border-grey-400 px-3 py-2 text-primary-900"
                  onClick={() => handleEditAddress(id)}
                >
                  Edit
                </div>
                <div
                  className="ml-2 cursor-pointer rounded-full border border-grey-400 px-3 py-2 text-[#FF3C3C]"
                  onClick={() => handleDeleteClick(id)}
                >
                  Delete
                </div>
              </div>
            </div>
          )
        )
      )}
    </>
  )
}

export default SettingsShipping

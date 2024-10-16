"use client"

import { FC, useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"

import { getShippingAddresses } from "@/actions/shippingAddress"
import { findUserById } from "@/actions/user"
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm"
import { ProfileForm, type ProfileFormData } from "@/components/forms/ProfileForm"
import PageTopic from "@/components/PageTopic"
import SettingsNotification from "@/components/SettingsNotification"
import SettingsPayment from "@/components/SettingsPayment"
import SettingsPaymentModal from "@/components/SettingsPaymentModal"
import SettingsShipping from "@/components/SettingsShipping"
import SettingsShippingModal from "@/components/SettingsShippingModal"
import { Tabs } from "@/components/Tabs"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/useToast"
import useDraggableScroll from "@/hooks/useDraggableScroll"
import type { ShippingAddress } from "@/models/shipping"
import { User } from "@/models/user"

const tabs = ["Basic Info", "Change Password", "Notifications", "Shipping Address", "Payment Method"]

const Settings: FC = () => {
  const [activeItem, setActiveItem] = useState(0)
  const [showShippingModal, setShippingShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [shippingData, setShippingData] = useState<ShippingAddress[]>([])

  const { toast } = useToast()

  const { data } = useSession()

  const { scrollRef, handleMouseDown } = useDraggableScroll()

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        const response = await fetch("api/upload_data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        await response.json()
        toast({ title: "Data updated successfully" })
      } catch (error) {
        console.error("Failed to upload data:", error)
        toast({ title: "Failed to update data" })
      }
    },
    [toast]
  )

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await findUserById()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchShippingAddresses = async () => {
      const addresses = await getShippingAddresses()

      setShippingData(addresses)
    }

    fetchShippingAddresses()
  }, [])

  return (
    <div className="mb-2.5 w-full lg:px-4">
      {showShippingModal && (
        <SettingsShippingModal onClose={() => setShippingShowModal(false)} setShippingData={setShippingData} />
      )}
      {showPaymentModal && <SettingsPaymentModal onClose={() => setShowPaymentModal(false)} />}
      <PageTopic name="Account Settings" description="Easy manage your Professional profile" />
      <div className="mt-5 h-auto w-full">
        <div className="flex items-center justify-between max-lg:block">
          <div
            ref={scrollRef}
            style={{ scrollbarWidth: "none" }}
            className="hide-scrollbar cursor-grab overflow-x-auto whitespace-nowrap"
            onMouseDown={handleMouseDown}
          >
            <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />
          </div>

          {activeItem === 3 && (
            <Button variant="primary" className="gap-2 max-lg:mt-2" onClick={() => setShippingShowModal(true)}>
              <Plus className="h-5 w-5" />
              Add address
            </Button>
          )}

          {activeItem === 4 && (
            <Button variant="primary" className="gap-2 max-lg:mt-2" onClick={() => setShowPaymentModal(true)}>
              <Plus className="h-5 w-5" />
              Add payment method
            </Button>
          )}
        </div>
        <div className="mt-8">
          {activeItem === 0 && user && (
            <ProfileForm
              defaultValues={{
                name: user.name ?? "",
                email: user.email ?? "",
                telephone: user.telephone ?? "",
                type_proffesion: user.type_proffesion ?? "",
                place_work: user.place_work ?? "",
                lastName: user.lastName ?? "",
                image: user.image ?? "",
              }}
              onSubmit={handleSubmit}
            />
          )}
          {activeItem === 1 && <ChangePasswordForm />}
          {activeItem === 2 && <SettingsNotification />}
          {activeItem === 3 && (
            <SettingsShipping
              setShippingData={setShippingData}
              shippingData={shippingData}
              defaultShippingAddressId={data?.user.defaultShippingAddress}
            />
          )}
          {activeItem === 4 && <SettingsPayment />}
        </div>
      </div>
    </div>
  )
}

export default Settings

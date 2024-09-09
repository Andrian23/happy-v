"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"

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
import { User } from "@/models/user"

const tabs = ["Basic Info", "Change Password", "Notifications", "Shipping Address", "Payment Method"]

export default function SettingsPage() {
  const [activeItem, setActiveItem] = useState(0)
  const [showShippingModal, setShippingShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()

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
      }
    },
    [toast]
  )

  return (
    <div className="mb-2.5 w-full lg:px-4">
      {showShippingModal && <SettingsShippingModal onClose={() => setShippingShowModal(false)} />}
      {showPaymentModal && <SettingsPaymentModal onClose={() => setShowPaymentModal(false)} />}
      <PageTopic name="Account Settings" description="Easy manage your Professional profile" />
      <div className="mt-5 h-auto w-full">
        <div className="flex items-center justify-between max-lg:block">
          <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

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
              }}
              onSubmit={handleSubmit}
            />
          )}
          {activeItem === 1 && <ChangePasswordForm />}
          {activeItem === 2 && <SettingsNotification />}
          {activeItem === 3 && <SettingsShipping />}
          {activeItem === 4 && <SettingsPayment />}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

import { findUserById } from "@/actions/user"
import { Switch } from "@/components/ui/Switch"
import type { User } from "@/models/user"

const SettingsNotification = () => {
  const [user, setUser] = useState<User | null>(null)

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

  return (
    <div className="mt-4">
      <div className="flex items-center text-sm text-primary-900">
        Notifications are sent to your current email: <div className="ml-2 font-semibold">{user?.email}</div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-start">
          <div className="">
            <Switch id="recommendation" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-primary-900">Recommendation</div>
            <div className="text-sm text-grey-800">
              Receive a notification when a customer buys a product recommended by you
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-start">
          <div className="">
            <Switch id="community" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-primary-900">Community</div>
            <div className="text-sm text-grey-800">
              Receive notification when someone left a comment in your community discussion
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-start">
          <div className="">
            <Switch id="order" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-primary-900">Order</div>
            <div className="text-sm text-grey-800">
              Receive a notification when the status of your wholesale order has changed
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsNotification

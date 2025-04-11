"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { getParticipants } from "@/actions/super-admin/participant"
import PageTopic from "@/components/PageTopic"
import UserApproveTable from "@/components/super-admin/UserApproveTable"
import { bindToEvent } from "@/lib/pusher-client"
import { PartnerStatus, PartnerStatusReverseMap } from "@/models/participants"
import { User } from "@/models/user"

const PartnersMainPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const userStatusQuery = searchParams.get("status") as keyof typeof PartnerStatus
  const activeTab = PartnerStatusReverseMap[userStatusQuery] || PartnerStatusReverseMap[PartnerStatus.PENDING_REVIEW]

  const fetchUsers = async (activeTab: PartnerStatus) => {
    setLoading(true)
    try {
      const data = await getParticipants({ partnerStatus: activeTab })
      setUsers(data.users as User[])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(activeTab)
  }, [activeTab])

  useEffect(() => {
    return bindToEvent("admin-dashboard", "counts-updated", () => fetchUsers(activeTab))
  }, [])

  return (
    <div className="m-2.5 w-[98%] max-md:m-0">
      <PageTopic name="Partners Hub" description="" />
      <div className="mt-3 border-b"></div>

      <UserApproveTable users={users} loading={loading} basePath="/super-admin/partners" />
    </div>
  )
}

export default PartnersMainPage

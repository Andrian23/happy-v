"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { getParticipants } from "@/actions/super-admin/participant"
import PageTopic from "@/components/PageTopic"
import UserApproveTable from "@/components/super-admin/UserApproveTable"
import { VerificationUserStatus, VerificationUserStatusReverseMap } from "@/models/participants"
import { User } from "@/models/user"

const AmbassadorMainPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const userStatusQuery = searchParams.get("status") as keyof typeof VerificationUserStatus
  const activeTab =
    VerificationUserStatusReverseMap[userStatusQuery] ||
    VerificationUserStatusReverseMap[VerificationUserStatus.PENDING_REVIEW]

  const fetchUsers = async (activeTab: VerificationUserStatus) => {
    setLoading(true)
    try {
      const data = await getParticipants({ verificationStatus: activeTab })
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

  return (
    <div className="m-2.5 w-[98%] max-md:m-0">
      <PageTopic name="Ambassadors Hub" description="" />
      <div className="mt-3 border-b"></div>

      <UserApproveTable users={users} loading={loading} basePath="/super-admin/ambassador" />
    </div>
  )
}

export default AmbassadorMainPage

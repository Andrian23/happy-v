"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { getUsersByStatus } from "@/actions/user"
import PageTopic from "@/components/PageTopic"
import UserApproveTable from "@/components/super-admin/UserApproveTable"
import { User } from "@/models/user"

const PartnersMainPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("status") || "pending"

  const fetchUsers = async (activeTab: string) => {
    try {
      const data = await getUsersByStatus(activeTab)
      setUsers(data)
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
      <PageTopic name="Partners Hub" description="" />
      <div className="mt-3 border-b"></div>

      <UserApproveTable users={users} loading={loading} basePath="/super-admin/partners" />
    </div>
  )
}

export default PartnersMainPage

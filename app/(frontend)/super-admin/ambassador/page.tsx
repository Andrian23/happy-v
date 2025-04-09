"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { BeatLoader } from "react-spinners"

import { getParticipants } from "@/actions/super-admin/participant"
import EmptyRequest from "@/components/EmptyRequest"
import PageTopic from "@/components/PageTopic"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Carret } from "@/icons/Carret"
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

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <BeatLoader size={10} speedMultiplier={0.8} />
      </div>
    )
  }

  return (
    <div className="m-2.5 w-[98%] max-md:m-0">
      <PageTopic name="Ambassadors Hub" description="" />
      <div className="mt-3 border-b"></div>

      <div className="mb-4 flex flex-col gap-4 bg-white">
        {users.length === 0 && <EmptyRequest />}
        {users.length > 0 && (
          <Table className="text-primary-900 mt-6 border-separate border-spacing-0 overflow-hidden rounded-2xl border">
            <TableHeader className="bg-grey-200 text-grey-800 text-xs uppercase">
              <TableRow className="[&>th]:border-b">
                <TableHead className="w-2xs px-5 py-3.5">FULL NAME</TableHead>
                <TableHead className="px-5 py-3.5">REQUEST DATE</TableHead>
                <TableHead className="px-5 py-3.5">TYPE OF PROFESSIONAL</TableHead>
                <TableHead className="px-5 py-3.5">PRACTICE SIZE</TableHead>
                <TableHead className="px-5 py-3.5">EMAIL</TableHead>
                <TableHead className="px-5 py-3.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(({ id, name, lastName, createdAt, type_proffesion, practical_size, email }) => (
                <TableRow
                  key={id}
                  className="cursor-pointer [&>td]:border-b last:[&>td]:border-0"
                  onClick={() => {
                    window.location.href = `/super-admin/ambassador/${id}`
                  }}
                >
                  <TableCell className="text-primary-900 w-2xs px-5 py-7 font-medium">
                    <Link href={`/super-admin/ambassador/${id}`} className="hover:underline">
                      {name} {lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-primary-800 px-5 py-7">
                    {createdAt ? format(createdAt, "MM/d/yyyy") : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-7 font-medium">{type_proffesion || "-"}</TableCell>
                  <TableCell className="px-5 py-7 font-medium">{practical_size || "-"}</TableCell>
                  <TableCell className="px-5 py-7 font-medium">{email || "-"}</TableCell>
                  <TableCell className="text-primary-900 px-5 py-7 font-medium">
                    <Link href={`/super-admin/ambassador/${id}`}>
                      <Carret />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default AmbassadorMainPage

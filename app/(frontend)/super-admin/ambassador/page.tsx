"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation" // Import useSearchParams
import { format } from "date-fns"
import { BeatLoader } from "react-spinners"

import { getUsersByStatus } from "@/actions/user"
import EmptyRequest from "@/components/EmptyRequest"
import PageTopic from "@/components/PageTopic"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Carret } from "@/icons/Carret"
import { User } from "@/models/user"

const AmbassadorMainPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("status") || "pending"

  const fetchUsers = async (activeTab: string) => {
    try {
      console.log(activeTab)
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

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <BeatLoader size={10} speedMultiplier={0.8} />
      </div>
    )
  }

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
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
              {users.map((user) => (
                <TableRow key={user.id} className="[&>td]:border-b last:[&>td]:border-0">
                  <TableCell className="text-primary-900 w-2xs px-5 py-7 font-medium">
                    <Link href={`/super-admin/ambassador/${user.id}`} className="hover:underline">
                      {user.name} {user.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-primary-800 px-5 py-7">
                    {user.createdAt ? format(user.createdAt, "MM/d/yyyy") : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-7 font-medium">{user.type_proffesion || "-"}</TableCell>
                  <TableCell className="px-5py-7 font-medium">{user.practical_size || "-"}</TableCell>
                  <TableCell className="px-5 py-7 font-medium">{user.email || "-"}</TableCell>
                  <TableCell className="text-primary-900 px-5 py-7 font-medium">
                    <Link href={`/super-admin/ambassador/${user.id}`}>
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

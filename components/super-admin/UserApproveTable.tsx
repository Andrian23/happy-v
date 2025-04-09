"use client"

import Link from "next/link"
import { format } from "date-fns"
import { BeatLoader } from "react-spinners"

import EmptyRequest from "@/components/EmptyRequest"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Carret } from "@/icons/Carret"
import { User } from "@/models/user"

interface UserApproveTableProps {
  users: User[]
  loading: boolean
  basePath: string
}

const UserApproveTable = ({ users, loading, basePath }: UserApproveTableProps) => {
  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <BeatLoader size={10} speedMultiplier={0.8} />
      </div>
    )
  }

  return (
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
                  window.location.href = `${basePath}/${id}`
                }}
              >
                <TableCell className="text-primary-900 w-2xs px-5 py-7 font-medium">
                  <Link href={`${basePath}/${id}`} className="hover:underline">
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
                  <Link href={`${basePath}/${id}`}>
                    <Carret />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default UserApproveTable

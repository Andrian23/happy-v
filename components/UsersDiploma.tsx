"use client"

import { useEffect, useState } from "react"
import Image from "next/image" // Ensure correct import
import Link from "next/link"
import { BeatLoader } from "react-spinners"

import { getUsers } from "@/actions/user"
import type { User } from "@/models/user"

const UsersDiploma = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <BeatLoader size={10} speedMultiplier={0.8} />
      </div>
    )
  }

  return (
    <div className="mb-4 mt-8 flex flex-col gap-4 bg-white p-4">
      {users.map((user) => (
        <Link
          className="flex h-full w-full items-center justify-between rounded-xl bg-grey-200 p-4"
          href={`/super-admin/user/${user.id}`}
          key={user.id}
        >
          <div className="w-[10%]">
            {user.image && <Image src={user.image} alt={user.name ?? ""} width={50} height={50} />}
          </div>
          <div className="text-primary-900">
            {user.name} {user.lastName}
          </div>
          <div className="w-[10%]">{user.type_proffesion}</div>
          <div className="w-[10%]">{user.email}</div>
          <div className="w-[10%]">{user.telephone}</div>
          <div className="w-[10%]">{user.place_work}</div>
          <div className="">{user.practical_size}</div>
          <div className="text-primary-900"></div>
        </Link>
      ))}
    </div>
  )
}

export default UsersDiploma

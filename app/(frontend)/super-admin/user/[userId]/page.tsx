"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { getUserById } from "@/actions/user"
import type { User } from "@/models/user"

const UserPage = () => {
  const pathname = usePathname()
  const id = pathname.split("/").pop()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        console.error("User ID is undefined")
        return
      }
      try {
        const response = await getUserById(id)
        setUser(response)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }

    fetchUser() // Remove the redundant check and call fetchUser directly
  }, [id])

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const handleApproveDiploma = async (id?: string) => {}

  return (
    <div>
      {user && (
        <div>
          <p>First Name: {user.name}</p>
          <p>Last Name: {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p className="flex items-center gap-2">
            Image: <Image src={user.image ?? ""} alt="User Image" width={100} height={100} />
          </p>
          <p>Telephone: {user.telephone}</p>
          <p>Type Profession: {user.type_proffesion}</p>
          <p>Place of Work: {user.place_work}</p>
          <p>Practical Size: {user.practical_size}</p>
          <p>Created At: {user.createdAt && new Date(user.createdAt).toLocaleString()}</p>
        </div>
      )}
      <div className="mt-4">
        <div
          className="ml-2 mt-1 w-fit cursor-pointer rounded-full bg-primary-500 px-3 py-2 text-sm text-white"
          onClick={() => handleApproveDiploma(user?.id)}
        >
          Approve Diploma
        </div>
      </div>
    </div>
  )
}

export default UserPage

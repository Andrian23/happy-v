"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { getAmbassadorById } from "@/actions/ambassador"
import { getUserById } from "@/actions/user"
import type { Ambassador } from "@/models/ambassador"
import type { User } from "@/models/user"
import facebookLogo from "@/public/Facebook.svg"
import globeLogo from "@/public/Globe.svg"
import instagramLogo from "@/public/Instagram.svg"
import xLogo from "@/public/X.svg"
import youtubeLogo from "@/public/Youtube.svg"

const iconMap: { [key in keyof Ambassador["ambassadorLinks"]]: string } = {
  twitterLink: xLogo,
  websiteLink: globeLogo,
  youtubeLink: youtubeLogo,
  facebookLink: facebookLogo,
  instagramLink: instagramLogo,
}

const AmbassadorItemPage = () => {
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null)
  const pathname = usePathname()
  const id = pathname.split("/").pop() as string
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchAmbassador = async () => {
      const data = await getAmbassadorById(id)
      setAmbassador(data)
      if (data?.userId) {
        const userData = await getUserById(data.userId)
        setUser(userData)
      }
    }
    fetchAmbassador()
  }, [id])

  const handleApproveAmbassador = async (id: string) => {
    const response = await fetch("/api/approve_amb", {
      method: "POST",
      body: JSON.stringify({ id }),
    })
    const data = await response.json()
    console.log(data)
    window.location.reload()
  }

  return (
    <div>
      {ambassador && (
        <div>
          {user && (
            <div>
              <p>User Information:</p>
              <p>Name: {user.name}</p>
              <p>Last Name: {user.lastName}</p>
              <p>Email: {user.email}</p>
              <p>
                Email Verified: {user.emailVerified ? new Date(user.emailVerified).toLocaleString() : "Not Verified"}
              </p>
              <p>
                Image: <Image src={user.image ?? ""} alt="User Image" width={100} height={100} />
              </p>
              <p>Telephone: {user.telephone}</p>
              <p>Type of Profession: {user.type_proffesion}</p>
              <p>Place of Work: {user.place_work}</p>
              <p>Practical Size: {user.practical_size}</p>
              <p>Role: {user.role}</p>
              <p>Created At: {user.createdAt && new Date(user.createdAt).toLocaleString()}</p>
              <p>Updated At: {user.updatedAt && new Date(user.updatedAt).toLocaleString()}</p>
              <p>Two Factor Enabled: {user.isTwoFactorEnable ? "Yes" : "No"}</p>
            </div>
          )}
          <div>
            <p>Selected Titles:</p>
            {ambassador.selectedTitles.map((title, index) => (
              <p key={index}>{title}</p>
            ))}
          </div>
          <div className="my-2">
            <p>Ambassador Links:</p>
            <ul>
              {Object.entries(ambassador.ambassadorLinks).map(([key, value]) => (
                <li key={key} className="flex items-center gap-2">
                  <Image src={iconMap[key as keyof Ambassador["ambassadorLinks"]]} alt={key} className="h-5 w-5" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
          <p>Requested At: {new Date(ambassador.createdAt).toLocaleString()}</p>
          <div className={`${ambassador.status === "no-active" ? "text-[#FF3C3C]" : "text-[#09BD30]"}`}>
            Status: {ambassador.status === "no-active" ? "No Active" : "Active"}
          </div>
          <div className="mt-4">
            <div
              className="ml-2 mt-1 w-fit cursor-pointer rounded-full bg-primary-500 px-3 py-2 text-sm text-white"
              onClick={() => handleApproveAmbassador(ambassador.id)}
            >
              Approve Ambassador
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmbassadorItemPage

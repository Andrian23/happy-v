"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BeatLoader } from "react-spinners"

import { getAmbassadors } from "@/actions/ambassador"
import type { Ambassador } from "@/models/ambassador"
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

const AmbassadorList = () => {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        const data = await getAmbassadors()
        setAmbassadors(data)
      } catch (error) {
        console.error("Failed to fetch ambassadors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAmbassadors()
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
      {ambassadors.map((ambassador) => (
        <Link
          className="flex h-full w-full items-center justify-between rounded-xl bg-grey-200 p-4"
          href={`/super-admin/${ambassador.id}`}
          key={ambassador.id}
        >
          <div className="w-[25%]">
            <ul>
              {Object.entries(ambassador.ambassadorLinks)
                .slice(0, 2)
                .map(([key, value]) => (
                  <li key={key} className="flex items-center gap-2">
                    <Image
                      src={iconMap[key as keyof Ambassador["ambassadorLinks"]]}
                      alt={key}
                      className="h-[18px] w-[18px]"
                    />
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary-900">
                      {value}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div className="text-primary-900">
            {ambassador.selectedTitles.slice(0, 2).join(", ")}
            {ambassador.selectedTitles.length > 2 && ", ..."}
          </div>
          <div className="">{new Date(ambassador.createdAt).toLocaleString()}</div>
          <div className={`${ambassador.status === "no-active" ? "text-[#FF3C3C]" : "text-[#09BD30]"}`}>
            {ambassador.status === "no-active" ? "No Active" : "Active"}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default AmbassadorList

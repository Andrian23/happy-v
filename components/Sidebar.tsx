"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { signOut } from "@/actions/signOut"
import { getSuperAdmin } from "@/actions/superAdmin"
import ambassadorIcon from "@/public/Ambassador.svg"
import communityIcon from "@/public/Community.svg"
import dialogIcon from "@/public/Dialog.svg"
import faqIcon from "@/public/FAQ.svg"
import likeIcon from "@/public/Like.svg"
import linkIcon from "@/public/Link.svg"
import listIcon from "@/public/List.svg"
import logOutIcon from "@/public/Log_out.svg"
import logo from "@/public/Logo.svg"
import megaphoneIcon from "@/public/Megaphone.svg"
import pillIcon from "@/public/Pill.svg"
import serviceIcon from "@/public/Service.svg"
import settingsIcon from "@/public/Settings.svg"
import statsIcon from "@/public/Stats.svg"

const Sidebar = () => {
  const currentPath = usePathname()

  const linksProducts = [
    {
      name: "Dashboard",
      icon: statsIcon,
      link: "/dashboard",
    },
    {
      name: "Wholesale products",
      icon: pillIcon,
      link: "/products",
    },
    {
      name: "My orders",
      icon: listIcon,
      link: "/orders",
    },
    {
      name: "Affiliate links",
      icon: linkIcon,
      link: "/affiliate",
    },
    {
      name: "Recommendations",
      icon: dialogIcon,
      link: "/recommendations",
    },
  ]

  const linksMedia = [
    {
      name: "Marketing & Education assets",
      icon: megaphoneIcon,
      link: "/marketing",
    },
    {
      name: "Social media assets",
      icon: likeIcon,
      link: "/social",
    },
    {
      name: "Community forum",
      icon: communityIcon,
      link: "/community",
    },
    {
      name: "Become an Ambassador",
      icon: ambassadorIcon,
      link: "/ambassador",
    },
  ]

  const linksSettings = [
    {
      name: "Account settings",
      icon: settingsIcon,
      link: "/settings",
    },
    {
      name: "FAQs",
      icon: faqIcon,
      link: "/faqs",
    },
    {
      name: "Contact us",
      icon: serviceIcon,
      link: "/contact",
    },
  ]

  const getLinkClass = (link: string) => {
    return currentPath === link
      ? "mb-[10px] p-[0.5rem] rounded-[0.5rem] flex items-center cursor-pointer bg-white/15 text-sm"
      : "mb-[10px] p-[0.5rem] rounded-[0.5rem] flex items-center cursor-pointer hover:bg-white/15 text-sm"
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    getSuperAdmin().then((isSuperAdmin) => setIsSuperAdmin(isSuperAdmin))
  }, [])

  return (
    <div className="h-full w-full rounded-[1.125rem] bg-primary-900 text-white">
      <div className="h-full w-full items-center">
        <div className="logo flex justify-center border-b border-white/15 p-[10px] text-center">
          <Link href="/dashboard">
            <Image src={logo} className="my-[0.5rem] h-[30px] w-[120px] object-contain" alt="Logo" />
          </Link>
        </div>

        <div className="flex h-[95%] flex-col justify-between">
          <div className="">
            <div className="another-links m-[10px] border-b border-white/15">
              <div className="affiliate-links pb-[10px] text-xs">
                {linksProducts.map((item) => (
                  <Link href={item.link} className={getLinkClass(item.link)} key={item.name}>
                    <Image src={item.icon} className="mr-[0.4rem] h-[18px] w-[18px]" alt="Dollar Icon" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="another-links m-[10px]">
              <div className="affiliate-links pb-[10px] text-xs">
                {linksMedia.map((item) => (
                  <Link href={item.link} className={getLinkClass(item.link)} key={item.name}>
                    <Image src={item.icon} className="mr-[0.4rem] h-[18px] w-[18px]" alt="Dollar Icon" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="another-links m-[10px]">
            <div className="affiliate-links pb-[20px] text-xs">
              {linksSettings.map((item) => (
                <Link href={item.link} className={getLinkClass(item.link)} key={item.name}>
                  <Image src={item.icon} className="mr-[0.4rem] h-[18px] w-[18px]" alt="Dollar Icon" />
                  {item.name}
                </Link>
              ))}
              <form action={signOut}>
                <button
                  className="mb-[10px] flex w-[100%] cursor-pointer items-center rounded-[0.5rem] p-[0.5rem] text-sm hover:bg-white/15"
                  key="Log out"
                >
                  <Image src={logOutIcon} className="mr-[0.4rem] h-[18px] w-[18px]" alt="Dollar Icon" />
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

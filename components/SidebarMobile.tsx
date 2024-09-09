"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

import { signOut } from "@/actions/signOut"
import communityIcon from "@/public/Community-mobile.svg"
import dialogIcon from "@/public/Dialog-mobile.svg"
import faqIcon from "@/public/FAQ-mobile.svg"
import likeIcon from "@/public/Like-mobile.svg"
import linkIcon from "@/public/Link-mobile.svg"
import listIcon from "@/public/List-mobile.svg"
import logOutIcon from "@/public/Log_out-mobile.svg"
import megaphoneIcon from "@/public/Megaphone-mobile.svg"
import pillIcon from "@/public/Pill-mobile.svg"
import serviceIcon from "@/public/Service-mobile.svg"
import settingsIcon from "@/public/Settings-mobile.svg"
import statsIcon from "@/public/Stats-mobile.svg"

const SidebarMobile: React.FC = () => {
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

  return (
    <div className="h-full w-full rounded-[1.125rem] bg-white text-black">
      <div className="h-full w-full items-center">
        <div className="flex h-[95%] flex-col justify-between">
          <div className="">
            <div className="another-links m-[10px] border-b border-white/15">
              <div className="affiliate-links pb-[10px]">
                {linksProducts.map((item) => (
                  <Link
                    href={item.link}
                    className="mb-[10px] flex cursor-pointer items-center rounded-[0.5rem] p-[0.5rem] hover:bg-white/15"
                    key={item.name}
                  >
                    <Image src={item.icon} className="mr-[0.4rem] h-[18px] w-[18px]" alt="Dollar Icon" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="another-links m-[10px]">
              <div className="affiliate-links pb-[10px]">
                {linksMedia.map((item) => (
                  <Link
                    href={item.link}
                    className="mb-[10px] flex cursor-pointer items-center rounded-[0.5rem] p-[0.5rem] hover:bg-white/15"
                    key={item.name}
                  >
                    <Image src={item.icon} className="mr-[0.4rem] h-[18px] w-[18px]" alt="Dollar Icon" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="another-links m-[10px]">
            <div className="affiliate-links pb-[20px]">
              {linksSettings.map((item) => (
                <Link
                  href={item.link}
                  className="mb-[10px] flex cursor-pointer items-center rounded-[0.5rem] p-[0.5rem] hover:bg-white/15"
                  key={item.name}
                >
                  <Image src={item.icon} className="mr-[0.4rem] h-[18px] w-[18px]" alt="Dollar Icon" />
                  {item.name}
                </Link>
              ))}
              <form action={signOut}>
                <button
                  className="mb-[10px] flex cursor-pointer items-center rounded-[0.5rem] p-[0.5rem] hover:bg-white/15"
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

export default SidebarMobile

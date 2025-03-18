"use client"

import React from "react"
import Image from "next/image"

import socialImage from "@/public/Social_desktop.png"
import socialImageMobile from "@/public/Social_mobile.png"

const SocialCalendar: React.FC = () => {
  return (
    <div className="bg-grey-200 mt-4 h-auto rounded-3xl px-[32px] py-[20px]">
      <div className="relative block max-lg:hidden">
        <Image src={socialImage} alt="Calendar" className="w-full" />
        <div className="absolute bottom-0 left-0 h-1/3 w-full bg-linear-to-t from-white/80 to-transparent"></div>
      </div>
      <div className="relative hidden max-lg:block">
        <Image src={socialImageMobile} alt="Calendar" className="w-full" />
        <div className="absolute bottom-0 left-0 h-1/3 w-full bg-linear-to-t from-white/80 to-transparent"></div>
      </div>
      <div className="w-[50%]">
        <div className="text-primary-900 mt-[20px] text-[20px] font-semibold">
          Manage all Social Media Efforts in One Place
        </div>
        <div className="text-grey-800 mt-[8px] text-sm">
          This template helps you plan and keep an overview of your content creation activities across platforms
        </div>
        <div className="text-grey-800 mt-[8px] text-sm">
          You will be able to adjust this template exactly to your needs, for this you only need to download a copy of
          the template, and adjust it for your tasks, voila, and everything is ready!
        </div>
      </div>
      <div className="bg-primary-500 mt-[20px] w-fit cursor-pointer rounded-full px-4 py-2 text-sm text-white">
        Download template
      </div>
    </div>
  )
}

export default SocialCalendar

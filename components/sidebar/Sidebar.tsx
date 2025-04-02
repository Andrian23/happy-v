"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

import { logOut } from "@/actions/signOut"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { Button } from "@/components/ui/Button"
import Logout from "@/icons/Logout"
import { adminNavigation, linksMedia, linksProducts, linksSettings } from "@/mock-data/navigation"
import logo from "@/public/Logo.svg"

import SidebarLink from "./SidebarLink"

interface SidebarProps {
  isAdmin?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => (
  <div className="md:bg-primary-900 h-full w-full rounded-[1.125rem] bg-white text-black md:text-white">
    <div className="h-full w-full items-center">
      <div className="logo hidden justify-center border-b border-white/15 p-2.5 text-center md:flex md:flex-col md:items-center">
        <Link href="/dashboard">
          <Image src={logo} className="my-2 h-7.5 w-30" alt="Logo" />
        </Link>
        {isAdmin && <h2 className="text-xs font-medium">Super Admin</h2>}
      </div>

      <div className="flex h-[95%] flex-col justify-between">
        {isAdmin ? (
          <>
            <div className="mt-4 flex flex-col">
              <div className="flex flex-col gap-2">
                {adminNavigation.dropdownMenu.map((item) => (
                  <Accordion type="single" collapsible className="flex flex-col gap-3 lg:gap-5" key={item.name}>
                    <AccordionItem value="ambassadors" className="mx-4 rounded-lg">
                      <AccordionTrigger className="md:[&>svg]:stroke-light-grey md:text-light-grey cursor-pointer px-2.5 py-2 text-sm text-black [&>svg]:h-5 [&>svg]:w-5 [&>svg]:stroke-black">
                        <div className="relative flex items-center gap-2 md:gap-2.5">
                          {item.hasNotification && (
                            <div className="bg-notified absolute top-0 -right-3 aspect-square w-1.5 rounded-full" />
                          )}
                          {item.icon}
                          {item.name}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="w-full pb-0 text-sm">
                        {item.subLinks.map(({ name, icon, link }) => (
                          <SidebarLink
                            key={link}
                            link={link}
                            icon={icon}
                            name={name}
                            className="mb-2 justify-between rounded-xl pr-2.5 pl-7"
                            isBadged
                            isNotified
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>

              <div className="mt-2 px-4">
                {adminNavigation.links.map(({ name, link, icon }) => (
                  <SidebarLink key={link} link={link} icon={icon} name={name} className="mb-2 rounded-xl px-2.5" />
                ))}
              </div>
            </div>

            <div className="m-4">
              <div className="pb-2 md:pb-7">
                <Button
                  variant="destructive-ghost"
                  size="2sm"
                  onClick={() => logOut()}
                  className="mb-2.5 justify-start gap-2 px-2.5 md:gap-2.5"
                >
                  <Logout className="md:stroke-light-grey stroke-black" />
                  Log out
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="m-2.5 border-b border-white/15">
                <div className="pb-2.5">
                  {linksProducts.map(({ link, icon, name }) => (
                    <SidebarLink key={link} link={link} icon={icon} name={name} />
                  ))}
                </div>
              </div>

              <div className="m-2.5">
                <div className="pb-2.5">
                  {linksMedia.map(({ link, icon, name }) => (
                    <SidebarLink key={link} link={link} icon={icon} name={name} />
                  ))}
                </div>
              </div>
            </div>

            <div className="m-2.5">
              <div className="pb-5">
                {linksSettings.map(({ link, icon, name }) => (
                  <SidebarLink key={link} link={link} icon={icon} name={name} />
                ))}
                <Button
                  variant="destructive-ghost"
                  size="2sm"
                  onClick={() => logOut()}
                  className="mb-2.5 justify-start gap-2 md:gap-2.5"
                >
                  <Logout className="md:stroke-light-grey stroke-black" />
                  Log out
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)

export default Sidebar

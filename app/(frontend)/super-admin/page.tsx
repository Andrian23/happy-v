"use client"

import { useState } from "react"

import AmbassadorList from "@/components/AmbassadorList"
import EMAssetsAdd from "@/components/EMAssetsAdd"
import PageTopic from "@/components/PageTopic"
import SocialMediaAdd from "@/components/SocialMediaAdd"
import { Tabs } from "@/components/Tabs"
import UsersDiploma from "@/components/UsersDiploma"

const tabs = ["User's Diploma", "Become an Ambassador Requested", "Marketing & Education Assets", "Social Media Assets"]

const SuperAdmin = () => {
  const [activeItem, setActiveItem] = useState(0)

  return (
    <div className="m-[10px] w-[98%] max-md:m-0">
      <PageTopic name="Super Admin Panel" description="" />
      <div className="mt-8 h-auto w-full">
        <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

        <div className="mt-4">
          {activeItem === 0 ? (
            <UsersDiploma />
          ) : activeItem === 1 ? (
            <AmbassadorList /> // rename page to Partners
          ) : activeItem === 2 ? (
            <EMAssetsAdd />
          ) : activeItem === 3 ? (
            <SocialMediaAdd />
          ) : (
            <div className="">Nothing</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuperAdmin

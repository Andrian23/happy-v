"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import PageTopicSecond from "@/components/PageTopicSecond"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useLocalStorage } from "@/hooks"
import type { AmbassadorLinks } from "@/models/ambassador"
import { User } from "@/models/user"
import documentIcon from "@/public/Document.svg"
import facebookIcon from "@/public/Facebook.svg"
import globeIcon from "@/public/Globe.svg"
import instagramIcon from "@/public/Instagram.svg"
import xIcon from "@/public/X.svg"
import youtubeIcon from "@/public/Youtube.svg"

type SocialLink = {
  key: keyof AmbassadorLinks
  label: string
  placeholder: string
  alt: string
  icon: string
}

type ProfessionalInfo = {
  key: keyof Pick<User, "name" | "email" | "lastName" | "type_proffesion" | "place_work" | "telephone">
  label: string
}

const socialLinks: SocialLink[] = [
  {
    key: "websiteLink",
    label: "Website link",
    placeholder: "Paste the link to your website",
    alt: "Globe",
    icon: globeIcon,
  },
  {
    key: "facebookLink",
    label: "Facebook link",
    placeholder: "Paste the link to your Facebook page",
    alt: "Document",
    icon: facebookIcon,
  },
  {
    key: "instagramLink",
    label: "Instagram link",
    placeholder: "Paste the link to your Instagram page",
    alt: "Document",
    icon: instagramIcon,
  },
  {
    key: "twitterLink",
    label: "X link (Twitter)",
    placeholder: "Paste the link to your X (Twitter) page",
    alt: "Document",
    icon: xIcon,
  },
  {
    key: "youtubeLink",
    label: "YouTube link",
    placeholder: "Paste the link to your YouTube channel",
    alt: "Document",
    icon: youtubeIcon,
  },
]

const professionalInfo: ProfessionalInfo[] = [
  {
    key: "name",
    label: "First Name",
  },
  {
    key: "lastName",
    label: "Last Name",
  },
  {
    key: "type_proffesion",
    label: "Type of professional",
  },
  {
    key: "place_work",
    label: "Place of Work",
  },
  {
    key: "email",
    label: "Email Address",
  },
  {
    key: "telephone",
    label: "Phone Number",
  },
]

const SetPage = () => {
  const [showDetails, setShowDetails] = useState(false)
  const [user, setUser] = useState<{ user: User } | null>(null)
  const router = useRouter()
  const [selectedTitles] = useLocalStorage<string[]>("selectedTitles", [])
  const [fileName, setFileName] = useState("")
  const [socialMediaLinks, setSocialMediaLinks] = useState<AmbassadorLinks>({
    websiteLink: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
    youtubeLink: "",
  })

  useEffect(() => {
    const storedFileName = localStorage.getItem("fileName")
    if (storedFileName) {
      setFileName(storedFileName)
    }
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("api/user_info", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }

    fetchUser()
  }, [])

  const handleSocialMediaChange = (key: keyof AmbassadorLinks, value: string) => {
    setSocialMediaLinks((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async () => {
    const selectedTitles = JSON.parse(localStorage.getItem("selectedTitles") || "[]")

    try {
      const response = await fetch("/api/ambassador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedTitles,
          ambassadorLinks: socialMediaLinks,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      console.log("Success:", result)
      localStorage.setItem("AmbassadorRequest", "true")
      router.push("/ambassador")
    } catch (error) {
      console.error("Failed to submit data:", error)
      localStorage.setItem("AmbassadorRequest", "false")
    }
  }

  return (
    <div className="my-2.5 w-full lg:px-4">
      <div className="">
        <PageTopicSecond name="Back" link="/ambassador_form" enable={false} />

        <div className="text-[28px] font-bold text-primary-900">Fill Out Personal Information</div>
        <div className="mt-[32px] flex items-start justify-between max-lg:block">
          <div className="w-[60%] max-lg:mt-[32px] max-lg:w-[100%]">
            <div className="text-[20px] font-semibold text-primary-900">Professional Info</div>

            <div
              className={`mt-[14px] rounded-2xl border border-grey-400 p-[12px] ${showDetails ? "max-lg:block" : "flex items-center justify-between"}`}
            >
              <div className="transition duration-300">
                {showDetails ? (
                  <div className="flex max-h-full flex-col gap-5 transition-all duration-700">
                    <div className="flex flex-col gap-5 lg:flex-row">
                      {professionalInfo.slice(0, 2).map(({ key, label }) => (
                        <div key={key} className="w-full">
                          <Label>{label}</Label>
                          <Input
                            value={user ? user.user[key] || "" : "Loading..."}
                            className="mt-1.5 cursor-pointer rounded-xl border px-3 py-2 text-left text-sm text-primary-800"
                            readOnly
                          />
                        </div>
                      ))}
                    </div>
                    {professionalInfo.slice(2).map(({ key, label }) => (
                      <div key={key} className="w-full">
                        <Label>{label}</Label>
                        <Input
                          value={user ? user.user[key] || "" : "Loading..."}
                          className="mt-1.5 cursor-pointer rounded-xl border px-3 py-2 text-left text-sm text-primary-800"
                          readOnly
                        />
                      </div>
                    ))}
                    <div className="mb-[20px] mt-2 transition duration-300">
                      <Label htmlFor="current_password" className="text-sm text-[#25425D]">
                        Professional credentials
                      </Label>
                      <div className="flex w-fit items-center justify-between rounded-[12px] border-2 border-gray-100 bg-grey-100 p-4 text-sm text-grey-800">
                        <div className="flex items-center justify-start">
                          <Image src={documentIcon} alt="Document" className="h-[18px] w-[18px]" />
                          <div className="ml-2 text-sm">{fileName}</div>
                        </div>
                        <div className="ml-4 rounded-full bg-[#09BD301A] px-2 py-1 text-sm text-[#09BD30]">
                          Approved
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="transition duration-300">
                    <div className="text-sm font-normal text-primary-900">
                      {user ? user.user.name : "Loading..."} {user ? user.user.lastName : ""}
                    </div>
                    <div className="text-sm font-normal text-primary-800">
                      {user ? user.user.type_proffesion : "Loading..."}
                    </div>
                  </div>
                )}
              </div>
              <Button variant="secondary" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "Hide details" : "Show details"}
              </Button>
            </div>

            <div className="mt-[32px]">
              <div className="text-[20px] font-semibold text-primary-900">Social Media Pages</div>
              <div className="w-[80%] text-sm font-normal text-grey-800">
                Providing links to your social media will help us better understand your activity and presence in these
                networks. It will also help us understand your communication style and the content you create.
              </div>
            </div>
            {socialLinks.map(({ key, label, icon, alt, placeholder }) => (
              <div key={key} className="mt-5 flex flex-col gap-1.5">
                <Label>{label}</Label>
                <Input
                  placeholder={placeholder}
                  icon={<Image src={icon} alt={alt} className="h-5 w-5" />}
                  onChange={(e) => handleSocialMediaChange(key, e.target.value)}
                />
              </div>
            ))}
            <Button variant="primary" className="mt-5 w-full" onClick={handleSubmit}>
              Submit
            </Button>
          </div>

          <div className="w-[35%] max-lg:mt-[32px] max-lg:w-[100%]">
            <div className="text-[20px] font-semibold text-primary-900">Selected areas of cooperation</div>
            <div className="mt-[14px] rounded-2xl border border-grey-400 bg-grey-100 p-[20px]">
              {selectedTitles.map((title, index) => (
                <div key={index} className="mb-[20px] flex items-center justify-start">
                  <Checkbox defaultChecked disabled />
                  <div className="ml-[12px] text-sm font-normal text-grey-800">{title}</div>
                </div>
              ))}

              <Button variant="secondary" className="mt-6 w-full" onClick={() => router.push("/ambassador_form")}>
                Change
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetPage

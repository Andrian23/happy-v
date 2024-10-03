"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import PageTopicSecond from "@/components/PageTopicSecond"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import type { AmbassadorLinks } from "@/models/ambassador"
import { User } from "@/models/user"
import documentIcon from "@/public/Document.svg"
import facebookIcon from "@/public/Facebook.svg"
import globeIcon from "@/public/Globe.svg"
import instagramIcon from "@/public/Instagram.svg"
import xIcon from "@/public/X.svg"
import youtubeIcon from "@/public/Youtube.svg"
import { useCooperationStore } from "@/stores/cooperation"

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

const SetPageComponent = () => {
  const [showDetails, setShowDetails] = useState(false)
  const [user, setUser] = useState<{ user: User } | null>(null)
  const router = useRouter()
  const [fileName, setFileName] = useState("")

  const { selectedTitles } = useCooperationStore()

  useEffect(() => {
    const storedFileName = localStorage.getItem("fileName")
    if (storedFileName) {
      setFileName(storedFileName)
    }
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user_info", {
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

  const form = useForm({
    defaultValues: {
      selectedTitles: selectedTitles,
      ambassadorLinks: {
        websiteLink: "",
        facebookLink: "",
        instagramLink: "",
        twitterLink: "",
        youtubeLink: "",
      },
    },
  })

  const onSubmit = async () => {
    try {
      const response = await fetch("/api/ambassador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedTitles,
          ambassadorLinks: form.getValues("ambassadorLinks"),
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

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
        <div className="mt-8 flex items-start justify-between max-lg:block">
          <div className="w-3/5 max-lg:mt-8 max-lg:w-full">
            <div className="text-[20px] font-semibold text-primary-900">Professional Info</div>
            <div
              className={`mt-3.5 rounded-2xl border border-grey-400 p-3 ${showDetails ? "max-lg:block" : "flex items-center justify-between"}`}
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
                    <div className="mb-5 mt-2 transition duration-300">
                      <Label htmlFor="current_password" className="text-sm text-[#25425D]">
                        Professional credentials
                      </Label>
                      <div className="flex w-fit items-center justify-between rounded-xl border-2 border-gray-100 bg-grey-100 p-4 text-sm text-grey-800">
                        <div className="flex items-center justify-start">
                          <Image src={documentIcon} alt="Document" className="h-4.5 w-4.5" />
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mt-8">
                  <div className="text-[20px] font-semibold text-primary-900">Social Media Pages</div>
                  <div className="w-4/5 text-sm font-normal text-grey-800">
                    Providing links to your social media will help us better understand your activity and presence in
                    these networks. It will also help us understand your communication style and the content you create.
                  </div>
                </div>
                {socialLinks.map(({ key, label, icon, alt, placeholder }) => (
                  <div key={key} className="mt-5 flex flex-col gap-1.5">
                    <FormField
                      control={form.control}
                      name={`ambassadorLinks.${key}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={placeholder}
                              icon={<Image src={icon} alt={alt} className="h-5 w-5" />}
                              type="text"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button type="submit" variant="primary" className="mt-5 w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>

          <div className="w-[35%] max-lg:mt-8 max-lg:w-full">
            <div className="text-[20px] font-semibold text-primary-900">Selected areas of cooperation</div>
            <div className="mt-3.5 rounded-2xl border border-grey-400 bg-grey-100 p-5">
              {selectedTitles.map((title, index) => (
                <div key={index} className="mb-5 flex items-center justify-start">
                  <Checkbox defaultChecked disabled />
                  <div className="ml-3 text-sm font-normal text-grey-800">{title}</div>
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

export default SetPageComponent

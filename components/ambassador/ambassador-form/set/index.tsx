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
import { professionalInfo } from "@/constants/professionalInfo"
import { socialLinks } from "@/constants/socialLinks"
import { User } from "@/models/user"
import documentIcon from "@/public/Document.svg"
import { useCooperationStore } from "@/stores/cooperation"

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

        <div className="text-primary-900 text-[28px] font-bold">Fill Out Personal Information</div>
        <div className="mt-8 flex items-start justify-between max-lg:block">
          <div className="w-3/5 max-lg:mt-8 max-lg:w-full">
            <div className="text-primary-900 text-[20px] font-semibold">Professional Info</div>
            <div
              className={`border-grey-400 mt-3.5 rounded-2xl border p-3 ${showDetails ? "max-lg:block" : "flex items-center justify-between"}`}
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
                            className="text-primary-800 mt-1.5 cursor-pointer rounded-xl border px-3 py-2 text-left text-sm"
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
                          className="text-primary-800 mt-1.5 cursor-pointer rounded-xl border px-3 py-2 text-left text-sm"
                          readOnly
                        />
                      </div>
                    ))}
                    <div className="mt-2 mb-5 transition duration-300">
                      <Label htmlFor="current_password" className="text-sm text-[#25425D]">
                        Professional credentials
                      </Label>
                      <div className="bg-grey-100 text-grey-800 flex w-fit items-center justify-between rounded-xl border-2 border-gray-100 p-4 text-sm">
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
                    <div className="text-primary-900 text-sm font-normal">
                      {user ? user.user.name : "Loading..."} {user ? user.user.lastName : ""}
                    </div>
                    <div className="text-primary-800 text-sm font-normal">
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
                  <div className="text-primary-900 text-[20px] font-semibold">Social Media Pages</div>
                  <div className="text-grey-800 w-4/5 text-sm font-normal">
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
            <div className="text-primary-900 text-[20px] font-semibold">Selected areas of cooperation</div>
            <div className="border-grey-400 bg-grey-100 mt-3.5 rounded-2xl border p-5">
              {selectedTitles.map((title, index) => (
                <div key={index} className="mb-5 flex items-center justify-start">
                  <Checkbox defaultChecked disabled />
                  <div className="text-grey-800 ml-3 text-sm font-normal">{title}</div>
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

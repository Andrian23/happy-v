"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useToast } from "@/components/ui/useToast"
import documentIcon from "@/public/Document.svg"

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/Form"

interface ProfileFormProps {
  defaultValues: ProfileFormData
  onSubmit: (data: ProfileFormData) => void
}

export const schema = z.object({
  name: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  type_proffesion: z.string().min(1, { message: "Phone number is required" }),
  place_work: z.string().min(1, { message: "Subject is required" }),
  telephone: z.string().min(1, { message: "Message is required" }),
  email: z.string().email({ message: "Email is required" }),
  image: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof schema>

export const ProfileForm: React.FC<ProfileFormProps> = ({ defaultValues, onSubmit }) => {
  const form = useForm<ProfileFormData>({ resolver: zodResolver(schema), defaultValues })
  const [fileName, setFileName] = useState("")
  const [profileImage, setProfileImage] = useState(defaultValues.image)

  const { toast } = useToast()

  useEffect(() => {
    const storedFileName = localStorage.getItem("fileName")
    if (storedFileName) {
      setFileName(storedFileName)
    }
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }

    const formData = new FormData()
    formData.append("file", file as File)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      )

      console.log(response)
      const imageUrl = response.data.secure_url
      form.setValue("image", imageUrl)
      toast({ title: "Image uploaded successfully" })
    } catch (error) {
      console.error("Failed to upload image:", error)
    }
  }

  return (
    <div className="mt-4 w-[60%] max-lg:w-full">
      <div className="mt-2 flex items-center justify-start gap-3">
        {defaultValues.image ? (
          <Image
            src={profileImage || ""}
            alt="Profile Picture"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-grey-200">
            <div className="text-3xl text-grey-800">{defaultValues.name.charAt(0) ?? ""}</div>
          </div>
        )}
        <div>
          <Label className="flex cursor-pointer flex-col" htmlFor="image-upload">
            <span className="text-sm font-semibold text-primary-500">Upload profile picture</span>
            <span className="text-xs font-medium text-grey-800">PNG, JPG max size of 5MB</span>
          </Label>
          <Input
            id="image-upload"
            type="file"
            className="-z-1 absolute h-0 w-0 opacity-0"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type_proffesion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of professional</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your type of profession" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="place_work"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place of Work</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your place of work" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="current_password" className="text-sm text-primary-900">
                Professional credentials
              </Label>
              <div className="flex w-fit items-center justify-between rounded-xl border-2 border-gray-100 p-4 text-sm text-grey-800">
                <div className="flex items-center justify-start">
                  <Image src={documentIcon} alt="Document" className="h-[18px] w-[18px]" />
                  <div className="ml-2 text-sm">{fileName}</div>
                </div>
                <div className="ml-4 rounded-full bg-[rgba(9,189,48,0.1)] px-2 py-1 text-sm text-[rgb(9,189,48)]">
                  Approved
                </div>
              </div>
            </div>

            <Button variant="primary" type="submit" className="lg:mr-auto lg:w-auto">
              Apply Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

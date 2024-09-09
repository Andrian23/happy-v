"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { RegisterFirstSchema } from "@/schemas"

const professions = [
  "Certified Nutritionist",
  "Clinical Nutritionist",
  "Health Coach",
  "Holistic Practitioner",
  "Medial Doctor",
  "OBGYN",
  "Physician's Assistant",
  "Registered Dietician",
  "Registered Nurse",
]

const practiceSizes = ["<50 patients", "50-100 patients", "100-500 patients", "500-1000 patients", "1000+ patients"]

const SignUpPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof RegisterFirstSchema>>({
    resolver: zodResolver(RegisterFirstSchema),
    defaultValues: {
      name: "",
      lastName: "",
      telephone: "",
      type_proffesion: "",
      place_work: "",
      practical_size: "", // Added new field
    },
  })

  const onSubmitStorage = (values: z.infer<typeof RegisterFirstSchema>) => {
    localStorage.setItem("formData", JSON.stringify(values))
  }

  const onSubmit = (values: z.infer<typeof RegisterFirstSchema>) => {
    setError("")
    setSuccess("")

    onSubmitStorage(values) // Save form data to localStorage

    router.push("/sign-up-2")
  }

  return (
    <SignUpLayout currentStep={0}>
      <div className="text-center text-[32px] font-bold text-primary-900">Create professional account</div>
      <div className="mt-[8px] text-sm text-grey-800">Tell us a bit about yourself</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[32px] w-full">
          <div className="my-1 mb-[20px] flex items-center justify-between">
            <div className="w-[49%]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-primary-900">First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your first name"
                        type="text"
                        className="rounded-[12px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[49%]">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-primary-900">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your last name"
                        type="text"
                        className="rounded-[12px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="type_proffesion"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel className="text-sm text-primary-900">Type of professional</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-[12px]">
                      <SelectValue placeholder="Select your type of professional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professions.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="practical_size"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel className="text-sm text-primary-900">Practice size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-[12px]">
                      <SelectValue placeholder="Select your practice size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {practiceSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="place_work"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel className="text-sm text-primary-900">Place of work</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter place of work"
                    type="text"
                    className="rounded-[12px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel className="text-sm text-primary-900">Telephone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="+3214123123"
                    type="text"
                    className="rounded-[12px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button type="submit" disabled={isPending} variant="primary" className="mt-4 w-full">
            Continue to Sign up method
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpPage

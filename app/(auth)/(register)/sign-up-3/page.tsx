"use client"

import { startTransition, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { updateUser } from "@/actions/user"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { User } from "@/models/user"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { RegisterSchema, RegisterThirdSchema } from "@/schemas"

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

const SignUpSecondPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const nextStepRoute = "/sign-up-4"
  const { data: sessionData, update } = useSession()

  const form = useForm<z.infer<typeof RegisterThirdSchema>>({
    resolver: zodResolver(RegisterThirdSchema),
    defaultValues: {
      type_proffesion: "",
      practical_size: "",
      place_work: "",
    },
  })

  const handleResponse = (data: { user?: User; error?: string; success?: string }) => {
    setError(data.error)
    setSuccess(data.success)
    if (data.success && sessionData && sessionData.user) {
      update({
        data: {
          ...sessionData,
          user: { ...sessionData?.user, signUpStep3Completed: true },
        },
      }).then(() => router.push(data.user?.signUpStep4Completed ? DEFAULT_LOGIN_REDIRECT : nextStepRoute))
    }
  }

  const onSubmit = (values: z.infer<typeof RegisterThirdSchema>) => {
    setError("")
    setSuccess("")

    const savedData = localStorage.getItem("formData")
    const fullForm: z.infer<typeof RegisterSchema> = savedData
      ? {
          ...JSON.parse(savedData),
          ...values,
          signUpStep3Completed: true,
        }
      : {}
    localStorage.setItem("formData", JSON.stringify(fullForm))

    startTransition(async () => {
      await updateUser({ ...values, signUpStep3Completed: true }).then((data) =>
        handleResponse(data as { user?: User; error?: string; success?: string })
      )
    })
  }

  return (
    <SignUpLayout currentStep={2}>
      <div className="text-primary-900 text-center text-[32px] font-bold">Tell Us About Your Practice</div>
      <div className="text-grey-800 mt-[8px] text-center text-sm">
        Let us know more about your professional background so we can provide a tailored experience for you.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[32px] w-full">
          <FormField
            control={form.control}
            name="type_proffesion"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel className="text-primary-900 text-sm">Type of professional</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-lg">
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
                <FormLabel className="text-primary-900 text-sm">Practice size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-lg">
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
                <FormLabel>Place of Work</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your place of work" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormSuccess message={success} />
          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending}
            variant="primary"
            className="bg-primary-900 hover:bg-primary-900/80 mb-4 w-full"
          >
            Next: Upload credentials
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpSecondPage

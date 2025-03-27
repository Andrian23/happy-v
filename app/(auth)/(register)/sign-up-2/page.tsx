"use client"

import { startTransition, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FcGoogle } from "react-icons/fc"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { signUp } from "@/actions/signUp"
import Divider from "@/components/Divider"
import { FormError } from "@/components/FormError"
import PasswordInput from "@/components/PasswordInput"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { RegisterSecondSchema } from "@/schemas"

const SignUpSecondPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState<string | undefined>("")

  const formData = useMemo(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("formData")
      return storedData ? JSON.parse(storedData) : {}
    }
    return {}
  }, [])

  const form = useForm<z.infer<typeof RegisterSecondSchema>>({
    resolver: zodResolver(RegisterSecondSchema),
    defaultValues: {
      ...formData,
      email: "",
      password: "",
    },
  })

  const onSubmitStorage = (values: z.infer<typeof RegisterSecondSchema>) => {
    const savedData = localStorage.getItem("formData")
    const savedForm = savedData ? JSON.parse(savedData) : {}
    localStorage.setItem("formData", JSON.stringify({ ...savedForm, ...values }))
    return { ...savedForm, ...values }
  }

  const handleResponse = (data: { error: string; success?: undefined } | { success: string; error?: undefined }) => {
    setError(data.error)
    setSuccess(data.success)
    if (data.success) {
      router.push("/sign-up-3")
    }
  }

  const onSubmitValues = (values: z.infer<typeof RegisterSecondSchema>) => {
    setError("")
    setSuccess("")

    const registrationData = onSubmitStorage(values)

    startTransition(() => {
      signUp(registrationData).then((data) => handleResponse(data))
    })
  }

  const onClickGoogle = async (provider: "google") => {
    const DEFAULT_LOGIN_REDIRECT = "/dashboard"
    try {
      await signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
      })
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  return (
    <SignUpLayout currentStep={1}>
      <div className="text-primary-900 text-center text-[32px] font-bold">Choose Your Sign-Up Method</div>
      <div className="text-grey-800 mt-[8px] text-center text-sm">
        To make things faster and easier, select how you’d like to sign up.
      </div>

      <div
        className="text-primary-900 hover:bg-primary-500 hover:bg-opacity-[4%] mt-[32px] flex w-full cursor-pointer items-center justify-center rounded-3xl border py-2 text-center text-sm"
        onClick={() => onClickGoogle("google")}
      >
        <FcGoogle className="mr-2 h-5 w-5" /> Continue with Google
      </div>

      <div className="mt-[20px] w-full">
        <div className="flex">
          <Divider />
          <div className="text-grey-800 mx-[12px] text-sm">OR</div>
          <Divider />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitValues)} className="mt-[20px] w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel>
                  Email<span className="text-error-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter your email address"
                    type="email"
                    className="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel>
                  Password<span className="text-error-500">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} disabled={isPending} placeholder="Enter password" className="rounded-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending}
            variant="primary"
            className="bg-primary-900 hover:bg-primary-900/80 mt-4 w-full"
          >
            Next: Tell us about your practice
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpSecondPage

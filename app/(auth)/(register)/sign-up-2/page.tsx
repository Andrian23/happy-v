"use client"

import { startTransition, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FcGoogle } from "react-icons/fc"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { signUp } from "@/actions/signUp"
import { FormError } from "@/components/FormError"
import PasswordInput from "@/components/PasswordInput"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { RegisterSchema } from "@/schemas"

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

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      ...formData,
      email: "",
      password: "",
      confirmPassword: "",
      name: formData.name,
      lastName: formData.lastName,
      telephone: formData.telephone,
      type_proffesion: formData.type_proffesion,
      place_work: formData.place_work,
      practical_size: formData.practical_size,
    },
  })

  const onSubmitValues = (values: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      signUp(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
        // Перенаправлення після успішної обробки форми
        router.push("/sign-up-3")
      })
    })
  }

  const onClickGoogle = async (provider: "google") => {
    const DEFAULT_LOGIN_REDIRECT = "/dashboard" // Define the missing constant
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
      <div className="text-center text-[32px] font-bold text-primary-900">Choose your sign up method</div>
      <div className="mt-[8px] text-sm text-grey-800">Choose the most convenient option for you</div>

      <div
        className="mt-[32px] flex w-full cursor-pointer items-center justify-center rounded-3xl border py-2 text-center text-sm text-primary-900 hover:bg-primary-500 hover:bg-opacity-[4%]"
        onClick={() => onClickGoogle("google")}
      >
        <FcGoogle className="mr-2 h-5 w-5" /> Sign up with Google
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitValues)} className="mt-[20px] w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter your email address"
                    type="email"
                    className="rounded-[12px]"
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
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    disabled={isPending}
                    placeholder="Enter your password"
                    className="rounded-[12px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat * </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    disabled={isPending}
                    placeholder="Repeat password"
                    className="rounded-[12px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <Button type="submit" disabled={isPending} variant="primary" className="mt-4 w-full">
            Continue to Professional Credentials
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpSecondPage

"use client"

import { startTransition, useState, useTransition } from "react"
import Link from "next/link"
import { signIn as nextAuthSignIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FcGoogle } from "react-icons/fc"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { signIn } from "@/actions/signIn"
import Divider from "@/components/Divider"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import PasswordInput from "@/components/PasswordInput"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"

const SignInPage = () => {
  const onClickGoogle = async (provider: "google") => {
    try {
      await nextAuthSignIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
      })
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      signIn(values).then((data) => {
        setError(data?.error)
      })
    })
  }

  return (
    <div className="form-container m-auto w-[35%] max-lg:mt-12 max-lg:w-[100%]">
      <div className="flex flex-col items-center justify-center max-md:mt-2">
        <div className="text-center text-[32px] font-semibold text-primary-900">Sign in to your account</div>
        <div className="mt-2 text-sm text-grey-800">
          Don&apos;t have account yet?{" "}
          <Link className="text-primary-500" href="/sign-up">
            Sign up
          </Link>
        </div>
        <div
          className="mt-[32px] flex w-full cursor-pointer items-center justify-center rounded-3xl border py-2 text-center text-sm hover:bg-primary-500 hover:bg-opacity-[4%]"
          onClick={() => onClickGoogle("google")}
        >
          <FcGoogle className="mr-2 h-5 w-5" /> Continue with Google
        </div>

        <div className="mt-[20px] flex w-full">
          <Divider />
          <div className="mx-[12px] text-sm text-grey-800">OR</div>
          <Divider />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[20px] w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="text-sm text-primary-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your email address"
                      type="email"
                      className="mb-[20px] mt-[6px] rounded-[12px]"
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
                <FormItem>
                  <FormLabel className="text-sm text-primary-900">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your password"
                      className="mt-[6px] rounded-[12px]"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="mt-[20px] flex items-center justify-between">
                    <div className="flex items-center justify-start">
                      <Checkbox />
                      <div className="ml-2 text-sm text-primary-900">Remember this device</div>
                    </div>
                    <Button variant="link" asChild className="px-0 font-normal text-primary-500">
                      <Link href="/forgot" className="text-primary-500">
                        Forgot your password?
                      </Link>
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" variant="primary" disabled={isPending} className="mt-5 w-full">
              Sign in
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignInPage

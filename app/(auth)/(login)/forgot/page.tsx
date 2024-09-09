"use client"

import { startTransition, useState, useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { forgotPassword } from "@/actions/forgotPassword"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/useToast"
import { ResetSchema } from "@/schemas"

const ForgotPasswordPage = () => {
  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      forgotPassword(values).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
      })
    })

    toast({ title: "We sent instructions to your email address", position: "bottom-right" })
  }

  return (
    <div className="form-container m-auto w-[35%] max-lg:mt-12 max-lg:w-[100%]">
      <div className="flex flex-col items-center justify-center max-md:mt-2">
        <div className="text-center text-[32px] font-bold text-primary-900">Forgot password?</div>
        <div className="mt-2 text-center text-sm text-grey-800">
          Enter your email address and we`ll send you the instructions on how to reset your password.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[32px] w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-primary-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your email address"
                      type="email"
                      className="mt-[6px] rounded-[12px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={isPending}
              className="my-[20px] w-full cursor-pointer rounded-3xl border bg-primary-500 py-2 text-center text-white hover:bg-primary-500/80"
            >
              Email Me a Reset Link
            </Button>
          </form>
        </Form>

        <div className="flex justify-center">
          <Link className="text-sm text-primary-500" href="/sign-in">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

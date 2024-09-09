"use client"

import { startTransition, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { newPassword } from "@/actions/newPassword"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import PasswordInput from "@/components/PasswordInput"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { useToast } from "@/components/ui/useToast"
import { NewPasswordSchema } from "@/schemas"

const NewPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error)
        if (!data?.error) {
          setSuccess("Password successfully updated")
          setTimeout(() => {
            router.push("/sign-in") // Redirect to sign-in after 3 seconds
          }, 3000)
        }
      })
    })

    toast({ title: "Password successfully updated", position: "bottom-right" })
  }

  return (
    <div className="form-container m-auto w-[35%] max-lg:mt-12 max-lg:w-[100%]">
      <div className="flex flex-col items-center justify-center max-md:mt-2">
        <div className="mb-[32px] text-center text-[32px] font-bold text-primary-900">Enter a new password</div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-[32px]">
                  <FormLabel className="text-sm text-primary-900">Password *</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="Enter your new password"
                      className="mt-[6px] rounded-[12px]"
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
                <FormItem className="mb-[32px]">
                  <FormLabel className="mt-[20px] text-sm text-primary-900">Repeat * </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="Confirm your new password"
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
              className="mt-4 w-full cursor-pointer rounded-3xl border bg-primary-500 py-2 text-center text-white hover:bg-primary-500/80"
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default NewPasswordPage

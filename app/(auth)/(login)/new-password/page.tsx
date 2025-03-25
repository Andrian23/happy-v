"use client"

import { startTransition, Suspense, useState, useTransition } from "react"
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

const NewPasswordPageContent = () => {
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
      <div className="flex flex-col items-center justify-center max-md:mt-8">
        <div className="text-primary-900 mb-[32px] text-center text-[32px] font-bold">Reset your password</div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-[32px]">
                  <FormLabel className="text-primary-900 text-sm">New password*</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="Enter new password"
                      className="mt-[6px] rounded-[8px]"
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
                  <FormLabel className="text-primary-900 mt-[20px] text-sm">Confirm new password* </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="Enter a new password again"
                      className="mt-[6px] rounded-[8px]"
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
              className="bg-primary-900 hover:bg-primary-900/80 mt-4 w-full cursor-pointer rounded-3xl border py-2 text-center text-white"
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

const NewPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordPageContent />
    </Suspense>
  )
}

export default NewPasswordPage

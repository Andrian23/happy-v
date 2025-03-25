"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { RegisterFirstSchema } from "@/schemas"

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
      policy: false,
      newsletter: true,
      marketing: true,
    },
  })

  const onSubmitStorage = (values: z.infer<typeof RegisterFirstSchema>) => {
    localStorage.setItem("formData", JSON.stringify(values))
  }

  const onSubmit = (values: z.infer<typeof RegisterFirstSchema>) => {
    setError("")
    setSuccess("")

    onSubmitStorage(values)

    router.push("/sign-up-2")
  }

  return (
    <SignUpLayout currentStep={0}>
      <div className="text-primary-900 text-center text-[32px] font-bold">Let’s Set Up Your Profile</div>
      <div className="text-grey-800 mt-[8px] text-center text-sm">
        To get started, we just need a few details from you. This helps us personalize your experience and connect you
        with the right opportunities.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[32px] w-full">
          <div className="my-1 mb-[20px] flex items-center justify-between">
            <div className="w-[49%]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-900 text-sm">
                      First name<span className="text-error-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your first name"
                        type="text"
                        className="rounded-[8px]"
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
                    <FormLabel className="text-primary-900 text-sm">
                      Last name<span className="text-error-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your last name"
                        type="text"
                        className="rounded-[8px]"
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
            name="telephone"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormLabel className="text-primary-900 text-sm">
                  Phone number<span className="text-error-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter your phone number"
                    type="text"
                    className="rounded-[8px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <section>
            <FormField
              control={form.control}
              name="policy"
              render={({ field }) => (
                <FormItem className="mb-[20px]">
                  <div className="bg-grey-200 flex items-center justify-start rounded-2xl p-4">
                    <FormControl>
                      <Checkbox className="CheckboxRoot" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="text-primary-900 ml-2 flex flex-wrap items-center gap-1 text-sm">
                      <span>I agree to the Happy V</span>
                      <Button variant="link" asChild className="text-primary-900 h-4 px-0 font-normal">
                        <Link
                          href="https://happyv.com/policies/terms-of-service"
                          target="_blank"
                          className="text-primary-900 h-4 font-semibold underline"
                        >
                          Terms of Service
                        </Link>
                      </Button>
                      <span>and</span>
                      <Button variant="link" asChild className="text-primary-900 h-4 px-0 font-normal">
                        <Link
                          href="https://happyv.com/policies/privacy-policy"
                          target="_blank"
                          className="text-primary-900 h-4 font-semibold underline"
                        >
                          Privacy Policy
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <div className="flex items-start justify-start px-4">
                  <FormControl>
                    <Checkbox className="CheckboxRoot" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="text-primary-900 ml-2 text-sm">
                    I agree to receive Happy V newsletter with thoughtful content for woman's wellness - you can
                    unsubscribe in one click
                  </div>
                </div>
                <FormMessage className="ml-4" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketing"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <div className="flex items-start justify-start px-4">
                  <FormControl>
                    <Checkbox className="CheckboxRoot" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="text-primary-900 ml-2 text-sm">
                    I agree to receive account updates and other marketing emails
                  </div>
                </div>
                <FormMessage className="ml-4" />
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
            Next: Choose your sign-up method
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpPage

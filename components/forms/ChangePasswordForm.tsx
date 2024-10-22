"use client"

import React, { Dispatch, SetStateAction, startTransition, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { resetPasswordSettings } from "@/actions/passwordSettings"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import PasswordInput from "@/components/PasswordInput"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { ResetPasswordSettings } from "@/schemas"

interface ChangePasswordFormProps {
  setIsProfileUpdated: Dispatch<SetStateAction<boolean>>
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ setIsProfileUpdated }) => {
  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof ResetPasswordSettings>>({
    resolver: zodResolver(ResetPasswordSettings),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmitValues = (values: z.infer<typeof ResetPasswordSettings>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      resetPasswordSettings(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
        if (data.success) {
          setIsProfileUpdated(true)
        }
      })
    })
  }

  return (
    <div className="mt-4 w-full max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitValues)}>
          <div className="">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} disabled={isPending} placeholder="Enter your current password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-3">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="mt-[20px]">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} disabled={isPending} placeholder="Enter new password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Repeat New Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} disabled={isPending} placeholder="Repeat new password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-5">
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending} variant="primary">
              Apply changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

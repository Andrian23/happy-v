import React, { useCallback } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { type ReplyData, replySchema } from "@/schemas/reply"

import { TextEditor } from "../TextEditor"
import { Button } from "../ui/Button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/Form"

type ReplyFormProps = {
  onSubmit: (data: ReplyData) => void
  defaultValues?: ReplyData
}

export const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit, defaultValues = { content: "" } }) => {
  const form = useForm<ReplyData>({ resolver: zodResolver(replySchema), defaultValues })

  const handleSubmit = useCallback(
    (data: ReplyData) => {
      onSubmit(data)
      form.reset()
    },
    [onSubmit, form]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 grid gap-5 rounded-2xl bg-grey-200 p-5">
        <h3 className="text-xl font-bold text-primary-900">Reply</h3>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextEditor value={field.value} onChange={(content) => field.onChange(content)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="primary" className="ml-auto min-w-24">
          Send
        </Button>
      </form>
    </Form>
  )
}

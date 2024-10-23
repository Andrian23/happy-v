import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { TopicType } from "@prisma/client"

import { Ask } from "@/icons/Ask"
import { Telegram } from "@/icons/Telegram"
import { cn } from "@/lib/utils"
import { type TopicData, topicSchema } from "@/schemas/topic"

import { TextEditor } from "../TextEditor"
import { Button } from "../ui/Button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/Form"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"

type TopicDialogProps = React.PropsWithChildren & {
  onSubmit: (data: TopicData) => void
  defaultValues?: TopicData
}

export const TopicDialog: React.FC<TopicDialogProps> = ({
  children,
  onSubmit,
  defaultValues = { type: TopicType.ASK, title: "", content: "" },
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const form = useForm<TopicData>({
    resolver: zodResolver(topicSchema),
    defaultValues,
  })

  const handleSubmit = useCallback(
    (data: TopicData) => {
      onSubmit(data)
      setIsOpened(false)
    },
    [onSubmit]
  )

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-primary-900">
          <DialogTitle className="text-2xl font-bold text-primary-900">Create a New Topic</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-5 px-4 pb-6 lg:px-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select the category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className="grid gap-3 lg:grid-cols-2 lg:gap-4"
                    >
                      <Label
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-xl border border-grey-400 p-3 font-medium",
                          field.value === TopicType.ASK && "border-primary-500"
                        )}
                      >
                        <Ask />
                        Ask the Community
                        <RadioGroupItem value={TopicType.ASK} className="ml-auto" />
                      </Label>

                      <Label
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-xl border border-grey-400 p-3 font-medium",
                          field.value === TopicType.SUGGESTION && "border-primary-500"
                        )}
                      >
                        <Telegram />
                        Suggestion Box
                        <RadioGroupItem value={TopicType.SUGGESTION} className="ml-auto" />
                      </Label>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Briefly describe the topic" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TextEditor value={field.value} onChange={(content) => field.onChange(content)} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button variant="primary" type="submit" className="max-lg:w-full lg:ml-auto">
              Create topic
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

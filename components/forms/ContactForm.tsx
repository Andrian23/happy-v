import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"

import { Button } from "../ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/Form"
import { Input } from "../ui/Input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Textarea } from "../ui/Textarea"

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void
  className?: string
}

export const schema = z.object({
  fullName: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
})

export type ContactFormData = z.infer<typeof schema>

const selectOptions = [
  { value: "shipping_order_status", label: "Shipping / Order status" },
  { value: "suggestion", label: "Suggestion" },
  { value: "return", label: "Return" },
  { value: "product_questions", label: "Product Questions" },
  { value: "canceled_order", label: "Canceled Order" },
  { value: "product_complaint", label: "Product Complaint" },
  { value: "adverse_event", label: "Adverse Event" },
  { value: "other", label: "Other" },
]

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, className }) => {
  const form = useForm<ContactFormData>({ resolver: zodResolver(schema) })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-5", className)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="mt-2 w-full rounded-xl">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {selectOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message*</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help?" className="h-[175px] resize-none" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button variant="primary" type="submit" className="w-full">
          Send
        </Button>
      </form>
    </Form>
  )
}

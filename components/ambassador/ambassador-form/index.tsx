"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import PageTopicSecond from "@/components/PageTopicSecond"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { cooperations } from "@/constants/cooperations"
import { CooperationSchema } from "@/schemas"
import { useCooperationStore } from "@/stores/cooperation"

const AmbassadorForm = () => {
  const router = useRouter()

  const { selectedTitles, addTitle, removeTitle } = useCooperationStore()

  const form = useForm<z.infer<typeof CooperationSchema>>({
    resolver: zodResolver(CooperationSchema),
    defaultValues: {
      selectedTitles: selectedTitles || [],
      isConfirmed: false,
    },
  })

  const handleCheckboxChange = (title: string, checked: boolean) => {
    const currentTitles = form.getValues("selectedTitles")

    if (checked) {
      if (!currentTitles.includes(title)) {
        form.setValue("selectedTitles", [...currentTitles, title])
        addTitle(title)
      }
    } else {
      form.setValue(
        "selectedTitles",
        currentTitles.filter((t) => t !== title)
      )
      removeTitle(title)
    }
  }

  const onSubmit = () => {
    router.push("/ambassador_form/set")
  }

  return (
    <div className="my-2.5 w-full lg:px-4">
      <div className="max-lg:hidden lg:block">
        <PageTopicSecond name="Back" link="/ambassador" enable={false} />
      </div>

      <div className="mt-7">
        <div className="text-primary-900 text-2xl font-semibold">Choose Areas of Cooperation</div>
        <div className="text-primary-900/60 text-sm font-normal">
          Choose the areas in which you are ready to cooperate with Happy V
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-full lg:px-4">
            <Accordion type="multiple" className="text-primary-900">
              {cooperations.map((item) => (
                <AccordionItem key={item.title} value={item.title} className="border-grey-400 border-b py-3">
                  <FormField
                    control={form.control}
                    name="selectedTitles"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex w-full grow items-center gap-3">
                          <FormControl>
                            <Checkbox
                              id={item.title}
                              checked={field.value.includes(item.title)}
                              onCheckedChange={(checked) => {
                                handleCheckboxChange(item.title, checked as boolean)
                              }}
                            />
                          </FormControl>
                          <AccordionTrigger className="w-full grow text-sm lg:text-base">{item.title}</AccordionTrigger>
                        </div>
                        <AccordionContent className="bg-grey-200 mb-3 ml-8 max-w-3xl rounded-2xl p-4">
                          {item.content}
                        </AccordionContent>
                      </FormItem>
                    )}
                  />
                </AccordionItem>
              ))}
            </Accordion>

            {form.formState.errors.selectedTitles && (
              <p className="text-destructive mt-2 text-sm font-medium">
                {form.formState.errors.selectedTitles.message}
              </p>
            )}

            <FormField
              control={form.control}
              name="isConfirmed"
              render={({ field }) => (
                <FormItem className="border-grey-400 mt-4 flex w-full items-center justify-start rounded-2xl border p-4">
                  <FormControl>
                    <Checkbox
                      id="confirmCheckbox"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <div className="ml-4 flex w-120 flex-col gap-2">
                    <FormLabel className="text-primary-900 text-sm font-normal">
                      By becoming an ambassador of Happy V, I confirm that during cooperation with Happy V I will not
                      cooperate with other competing brands.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="mt-5 flex w-full items-center justify-end">
              <Button variant="primary" type="submit" disabled={!form.watch("isConfirmed")}>
                Confirm & Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AmbassadorForm

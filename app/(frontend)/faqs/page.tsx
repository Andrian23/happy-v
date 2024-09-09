"use client"

import { useRouter } from "next/navigation"

import PageTopic from "@/components/PageTopic"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { Button } from "@/components/ui/Button"

const FaqsPage = () => {
  const router = useRouter()

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <div className="hidden lg:block">
        <PageTopic name="FAQs" description="Find answers to your questions" />
      </div>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:gap-28">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold text-primary-900">Most Frequency Questions</div>
          <div className="text-sm text-grey-800">
            If you have additional questions or questions to which you did not find an answer, please contact Us
          </div>
          <Button variant="secondary" className="mr-auto" onClick={() => router.push("/contact")}>
            Contact us
          </Button>
        </div>

        <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <AccordionItem
              key={i}
              value={`${i}`}
              className="rounded-xl border border-grey-400 p-4 text-primary-900 transition-colors duration-300 [&[data-state=open]]:bg-grey-200"
            >
              <AccordionTrigger className="font-base p-0">Question {i + 1}</AccordionTrigger>
              <AccordionContent className="mt-2 p-0 text-sm">
                Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam.
                Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim
                semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat
                gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default FaqsPage

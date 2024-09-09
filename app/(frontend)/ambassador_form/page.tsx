"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import PageTopicSecond from "@/components/PageTopicSecond"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"

const cooperations = [
  {
    title: "Social Media Platforms",
    content:
      "Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam. Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.",
  },
  {
    title: "Press Related Articles",
    content:
      "Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam. Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.",
  },
  {
    title: "Website Feature Including Images and Quotes",
    content:
      "Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam. Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.",
  },
  {
    title: "Answering Customer Questions",
    content:
      "Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam. Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.",
  },
  {
    title: "Attending Events Representing Happy V",
    content:
      "Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam. Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.",
  },
  {
    title: "Organic Content for YouTube",
    content:
      "Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam. Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.",
  },
  {
    title: "Product Development Opportunities",
    content:
      "Lorem ipsum dolor sit amet consectetur. Neque nec velit suscipit pellentesque commodo dui molestie quam. Cras lorem imperdiet ac elementum. Mollis cursus sed diam convallis. Proin id amet aliquet orci enim semper pretium. At imperdiet amet maecenas ipsum. Porttitor scelerisque eu aenean nisl. Netus feugiat gravida tincidunt non lorem molestie integer mauris scelerisque. Cras ut.",
  },
]

const AmbassadorFormPage = () => {
  const router = useRouter()
  const [isChecked, setIsChecked] = useState(false)
  const [selectedTitles, setSelectedTitles] = useState<string[]>([])

  const handleCheckboxChange = (title: string, checked: boolean) => {
    setSelectedTitles((prev) => (checked ? [...prev, title] : prev.filter((t) => t !== title)))
  }

  const handleConfirm = () => {
    if (isChecked) {
      localStorage.setItem("selectedTitles", JSON.stringify(selectedTitles))
      router.push("/ambassador_form/set")
    }
  }

  return (
    <div className="my-2.5 w-full lg:px-4">
      <div className="max-lg:hidden lg:block">
        <PageTopicSecond name="Back" link="/ambassador" enable={false} />
      </div>

      <div className="mt-7">
        <div className="text-2xl font-semibold text-primary-900">Choose Areas of Cooperation</div>
        <div className="text-sm font-normal text-primary-900/60">
          Choose the areas in which you are ready to cooperate with Happy V
        </div>

        <div className="mt-4 w-full lg:px-4">
          <Accordion type="multiple" className="text-primary-900">
            {cooperations.map((item) => (
              <AccordionItem key={item.title} value={item.title} className="border-b border-grey-400 py-3">
                <div className="flex w-full grow items-center gap-3">
                  <Checkbox
                    checked={selectedTitles.includes(item.title)}
                    onCheckedChange={(checked) => handleCheckboxChange(item.title, checked as boolean)}
                  />
                  <AccordionTrigger className="w-full grow text-sm lg:text-base">{item.title}</AccordionTrigger>
                </div>
                <AccordionContent className="mb-3 ml-8 max-w-3xl rounded-2xl bg-grey-200 p-4">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-4 flex w-full items-center justify-start rounded-2xl border border-grey-400 p-4">
            <Checkbox id="test" checked={isChecked} onCheckedChange={(checked) => setIsChecked(!!checked)} />
            <div className="ml-4 w-[480px] text-sm font-normal text-primary-900">
              By becoming an ambassador of Happy V I confirm that during cooperation with Happy V I will not cooperate
              with other competing brands
            </div>
          </div>
          <div className="mt-5 flex w-full items-center justify-end">
            <Button variant="primary" onClick={handleConfirm} disabled={!isChecked}>
              Confirm & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmbassadorFormPage

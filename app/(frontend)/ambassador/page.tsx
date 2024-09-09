"use client"

import { Fragment, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import PageTopic from "@/components/PageTopic"
import { Button } from "@/components/ui/Button"
import { useLocalStorage } from "@/hooks"
import ambassadorLogo1 from "@/public/Ambassador_1.svg"
import ambassadorLogo2 from "@/public/Ambassador_2.svg"
import ambassadorLogo3 from "@/public/Ambassador_3.svg"
import ambassadorLogo4 from "@/public/Ambassador_4.svg"
import ambassadorImage from "@/public/ambassador_image.png"
import ambassadorLineImage from "@/public/AmbassadorLine.svg"
import confirmedOrderImage from "@/public/Confirmed_Order.svg"
import isConfirmedImage from "@/public/isConfirmed.svg"
import pdfIcon from "@/public/PDF_Format.svg"

const steps = [
  {
    image: ambassadorLogo1,
    alt: "",
    title: "Choose the direction In which you want to cooperate",
    description:
      "We offer several directions in which we can cooperate, choose the most productive and convenient for you",
  },
  {
    image: ambassadorLogo2,
    title: "Share links to your social media pages ",
    description:
      "If you chose the direction of promotion in social media or YouTube, please share links to your pages or YouTube channel",
  },
  {
    image: ambassadorLogo3,
    title: "Expect a message from our managers",
    description:
      "Our managers will check your application as soon as possible and send you a contract in digital form with all the details",
  },
  {
    image: ambassadorLogo4,
    title: "Congratulations! You are a Happy V Ambassador",
    description: "And now you are the new ambassador of the Happy V Brand",
  },
]

const AmbassadorPage = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ambassadorRequest] = useLocalStorage<boolean>("AmbassadorRequest", false)
  const [isConfirmed] = useLocalStorage<boolean>("isConfirmed", false)
  const isLocalStorageEmpty = useMemo(() => ambassadorRequest, [ambassadorRequest])

  const handleDownloadClick = () => {
    const link = document.createElement("a")
    link.href = "/path/to/your/PDF.pdf"
    link.download = "contract.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      {!isLocalStorageEmpty && (
        <>
          <div className="max-lg:hidden lg:block">
            <PageTopic name="Become an Ambassador" />
          </div>
          <div className="max-lg:block lg:hidden">
            <div className="text-2xl font-semibold text-primary-900">
              Would You Like to Become a More Active Partner of Happy V?
            </div>
            <div className="mt-4 text-sm font-normal text-grey-800">
              Great, become a Happy V ambassador, promote your favorite brand on social media and at professional events
              and earn extra income from Happy V.
            </div>
            <div className="mt-6">
              <Button variant="primary" onClick={() => router.push("/ambassador_form")}>
                Become an Ambassador
              </Button>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-start max-lg:block">
            <div>
              <Image src={ambassadorImage} alt="Ambassador" className="h-[336px] w-[412px] object-cover" />
            </div>
            <div className="max-lg:hidden lg:ml-[73px] lg:block lg:w-[450px]">
              <div className="text-2xl font-semibold leading-8 text-primary-900">
                Would You Like to Become a More Active Partner of Happy V?
              </div>
              <div className="mt-4 text-sm font-normal text-grey-800">
                Great, become a Happy V ambassador, promote your favorite brand on social media and at professional
                events and earn extra income from Happy V.
              </div>
              <div className="mt-6">
                <Button variant="primary" onClick={() => router.push("/ambassador_form")}>
                  Become an Ambassador
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-13">
            <div className="text-xl font-bold text-primary-900">How it Works</div>
            <div className="mt-6 flex flex-col justify-between lg:flex-row">
              {steps.map((step, index) => (
                <Fragment key={index}>
                  <div className="relative flex gap-4 lg:basis-1/5 lg:flex-col">
                    <div className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-grey-200">
                      <Image src={step.image} alt="Ambassador_" className="h-8 w-8" />
                    </div>
                    <div className="grid gap-y-1.5">
                      <div className="text-sm font-semibold text-primary-900">{step.title}</div>
                      <div className="text-sm text-grey-800">{step.description}</div>
                    </div>
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="relative flex h-13 w-14 shrink-0 justify-center lg:w-16 lg:items-center">
                      <div className="absolute h-0.5 w-14 rotate-90 lg:right-3 lg:w-52 lg:rotate-0">
                        <Image src={ambassadorLineImage} alt="Ambassador_" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center">
              <Button variant="primary" onClick={() => router.push("/ambassador_form")}>
                Become an Ambassador
              </Button>
            </div>
          </div>
        </>
      )}
      {isLocalStorageEmpty && (
        <>
          <div className="max-lg:hidden lg:block">
            <PageTopic name="Become an Ambassador" />
          </div>
          {isConfirmed && (
            <div className="flex w-full items-center justify-center max-lg:h-[50vh] lg:h-[95vh]">
              <div className="text-center">
                <Image src={isConfirmedImage} alt="Order Confirmed" className="mx-auto block h-[94px] w-[94px]" />
                <div className="mt-8 font-semibold text-primary-900 max-lg:text-[28px] lg:text-[32px]">
                  You a Happy V Ambassador
                </div>
                <div className="mt-2 font-light text-grey-800 max-lg:text-sm lg:text-sm">
                  If you want to change the terms of cooperation or stop cooperation, please contact us
                </div>
                <div className="mt-4 flex items-center justify-center max-lg:block">
                  <div
                    className="cursor-pointer rounded-full bg-primary-500 px-3 py-2 text-sm font-normal text-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Show a copy of the contract
                  </div>
                  <div className="cursor-pointer rounded-full border border-grey-400 bg-white px-[62px] py-2 text-sm font-normal text-primary-900 max-lg:mt-4 lg:ml-2">
                    Contact us
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isConfirmed && (
            <div className="flex w-full items-center justify-center max-lg:h-[50vh] lg:h-[95vh]">
              <div className="text-center">
                <Image src={confirmedOrderImage} alt="Order Confirmed" className="mx-auto block h-[94px] w-[94px]" />
                <div className="mt-8 font-semibold text-primary-900 max-lg:text-[28px] lg:text-[32px]">
                  Your request has been successfully sent
                </div>
                <div className="mt-2 font-light text-primary-900 max-lg:text-sm lg:text-sm">
                  Our managers will review your application and contact you as soon as possible in the email you
                  provided example@email.com
                </div>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-70">
              <div className="mb-2 flex h-auto w-full items-center justify-between p-4">
                <div className="flex items-center">
                  <Image src={pdfIcon} alt="pdf" className="h-5 w-5" />
                  <div className="ml-2 text-white">Copy of the ambassador contract</div>
                </div>
                <div className="flex items-center">
                  <div
                    className="mt-2 flex h-auto w-full cursor-pointer items-center justify-center rounded-full border border-grey-400 bg-grey-400 px-4 py-2"
                    onClick={handleDownloadClick}
                  >
                    <div className="text-sm">Download</div>
                  </div>
                  <div className="ml-4">
                    <X color="#fff" onClick={() => setIsModalOpen(false)} className="cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="flex h-full w-full items-center justify-center rounded-lg p-4">
                <div className="h-full w-full"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AmbassadorPage

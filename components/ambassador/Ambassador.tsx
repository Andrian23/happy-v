"use client"

import { FC, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

import ContractModal from "./ContractModal"
import StatusMessage from "./StatusMessage"

const steps = [
  {
    image: ambassadorLogo1,
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

const Ambassador: FC = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ambassadorRequest] = useLocalStorage<boolean>("AmbassadorRequest", false)
  const [isConfirmed] = useLocalStorage<boolean>("isConfirmed", false)

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
      <div className="hidden md:block">
        <PageTopic name="Become an Ambassador" />
      </div>
      {ambassadorRequest ? (
        <>
          {isConfirmed ? (
            <StatusMessage
              image={isConfirmedImage}
              title="You a Happy V Ambassador"
              description="If you want to change the terms of cooperation or stop cooperation, please contact us"
              actions={
                <>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                    size="sm"
                    className="w-full rounded-full"
                  >
                    Show a copy of the contract
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full rounded-full">
                    Contact us
                  </Button>
                </>
              }
            />
          ) : (
            <StatusMessage
              image={confirmedOrderImage}
              title="Your request has been successfully sent"
              description="Our managers will review your application and contact you as soon as possible in the email you
                  provided example@email.com"
            />
          )}

          {isModalOpen && <ContractModal onClose={() => setIsModalOpen(false)} onDownload={handleDownloadClick} />}
        </>
      ) : (
        <>
          <div className="mt-5 flex flex-col-reverse items-start justify-start gap-5 lg:flex-row lg:items-center lg:gap-16">
            <div className="relative aspect-5/4 w-full max-w-md overflow-hidden rounded-3xl">
              <Image src={ambassadorImage} alt="Ambassador" className="object-cover" fill />
            </div>
            <div className="w-full lg:max-w-md">
              <h3 className="text-primary-900 text-2xl leading-8 font-semibold">
                Would You Like to Become a More Active Partner of Happy V?
              </h3>
              <p className="text-grey-800 mt-4 text-sm font-normal">
                Great, become a Happy V ambassador, promote your favorite brand on social media and at professional
                events and earn extra income from Happy V.
              </p>
              <div className="mt-6">
                <Button variant="primary" onClick={() => router.push("/ambassador_form")}>
                  Become an Ambassador
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-13">
            <h3 className="text-primary-900 text-xl font-bold">How it Works</h3>
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:gap-4">
              {steps.map(({ image, title, description }, index) => (
                <div className="flex flex-1 gap-4 lg:basis-1/5 lg:flex-col" key={title}>
                  <div className="relative flex flex-col items-center gap-2 lg:flex-row lg:gap-4">
                    <div className="bg-grey-200 relative z-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
                      <Image src={image} alt="Ambassador_" className="h-8 w-8" />
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="relative flex h-13 w-14 shrink-0 justify-center lg:h-auto lg:w-full lg:flex-1">
                        <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 lg:right-0 lg:left-0 lg:w-full lg:rotate-0">
                          <Image src={ambassadorLineImage} alt="Ambassador_" fill className="object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex max-w-full flex-col gap-y-1.5 lg:max-w-52">
                    <h4 className="text-primary-900 text-sm font-semibold">{title}</h4>
                    <p className="text-grey-800 text-sm">{description}</p>
                  </div>
                </div>
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
    </div>
  )
}

export default Ambassador

"use client"

import { FC, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import PageTopic from "@/components/PageTopic"
import { Button } from "@/components/ui/Button"
import { useLocalStorage } from "@/hooks"
import { partnerHowItWorks } from "@/mock-data/partnerHowItWorks"
import ambassadorLineImage from "@/public/AmbassadorLine.svg"
import confirmedOrderImage from "@/public/Confirmed_Order.svg"
import isConfirmedImage from "@/public/isConfirmed.svg"
import partnerImage from "@/public/partner-image.png"

import ContractModal from "./ContractModal"
import StatusMessage from "./StatusMessage"

const BecomePartner: FC = () => {
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
        <PageTopic name="Become a Practitioner Partner" isBorderBottomPresent />
      </div>
      {ambassadorRequest ? (
        <>
          {isConfirmed ? (
            <StatusMessage
              image={isConfirmedImage}
              title="You a Happy V BecomePartner"
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
          <div className="mt-6 flex flex-col items-start justify-start gap-8 md:mt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="w-full lg:max-w-120">
              <h3 className="text-primary-900 text-3xl leading-9.5 font-semibold">
                Want to Help Empower People to Improve Their Vaginal Health?
              </h3>
              <p className="text-grey-850 mt-3 text-sm leading-5 font-medium md:mt-4">
                By becoming a Happy V Practitioner Partner, you will be able to use your expertise to help real people
                struggling with vaginal infections.
              </p>
              <div className="mt-5 md:mt-6">
                <Button variant="primary" onClick={() => router.push("/ambassador_form")}>
                  Become a Partner
                </Button>
              </div>
            </div>
            <div className="relative aspect-[1.35] w-full max-w-full overflow-hidden rounded-2xl lg:max-w-114">
              <Image src={partnerImage} alt="BecomePartner" className="object-cover" fill />
            </div>
          </div>
          <div className="mt-13">
            <h3 className="text-primary-900 text-xl font-semibold md:text-2xl">How it Works</h3>
            <div className="mt-6 flex flex-col gap-7.5 md:gap-4 lg:flex-row lg:gap-4">
              {partnerHowItWorks.map(({ image, title, description }, index) => (
                <div className="flex flex-1 gap-4 md:gap-6 lg:basis-1/5 lg:flex-col" key={title}>
                  <div className="relative flex flex-col items-center gap-2 lg:flex-row lg:gap-4">
                    <div className="bg-grey-200 relative z-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
                      <Image src={image} alt="Ambassador_" className="h-8 w-8" />
                    </div>
                    {index !== partnerHowItWorks.length - 1 && (
                      <div className="relative flex h-13 w-14 shrink-0 justify-center lg:h-auto lg:w-full lg:flex-1">
                        <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 lg:right-0 lg:left-0 lg:w-full lg:rotate-0">
                          <Image src={ambassadorLineImage} alt="Ambassador_" fill className="object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex max-w-full flex-col gap-y-2 lg:max-w-52">
                    <h4 className="text-primary-900 leading-5 font-semibold">{title}</h4>
                    <p className="text-grey-850 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7.5 flex items-center justify-center md:mt-6">
              <Button variant="primary" onClick={() => router.push("/ambassador_form")} className="w-full md:w-fit">
                Become a Partner
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default BecomePartner

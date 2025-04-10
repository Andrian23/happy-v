"use client"

import { FC, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Label } from "@radix-ui/react-label"

import { updatePartnerStatus, updateUserVerificationStatus } from "@/actions/super-admin/participant"
import { getUserById } from "@/actions/user"
import ContractModal from "@/components/ambassador/ContractModal"
import PageTopicSecond from "@/components/PageTopicSecond"
import DeclineProfileModal from "@/components/super-admin/DeclineProfileModal"
import StatusBadge from "@/components/super-admin/StatusBadge"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/useToast"
import { cooperations } from "@/mock-data/cooperations"
import { professionalInfo } from "@/mock-data/professionalInfo"
import { socialLinks } from "@/mock-data/socialLinks"
import {
  PartnerStatus,
  PartnerStatusReverseMap,
  VerificationUserStatus,
  VerificationUserStatusReverseMap,
} from "@/models/participants"
import { User } from "@/models/user"

interface ApprovalProfileProps {
  userId: string
  userType: "ambassador" | "partner"
  backLink: string
  backLinkText: string
}

const ApprovalProfile: FC<ApprovalProfileProps> = ({ userId, userType, backLink, backLinkText }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPendingUser, setIsPendingUser] = useState(false)
  const { toast } = useToast()

  const isAmbassador = userType === "ambassador"

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return

      try {
        const response = await getUserById(userId)
        setUser(response)

        const profileStatus = isAmbassador ? response?.verificationStatus : response?.partnerStatus

        const pendingStatus = isAmbassador
          ? VerificationUserStatusReverseMap[VerificationUserStatus.PENDING_REVIEW]
          : PartnerStatusReverseMap[PartnerStatus.PENDING_REVIEW]

        setIsPendingUser(profileStatus === pendingStatus)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }

    fetchUser()
  }, [userId, userType])

  const handleUpdateUserStatus = async (status: VerificationUserStatus | PartnerStatus, declineReason?: string) => {
    try {
      setIsSubmitting(true)
      if (isAmbassador) {
        await updateUserVerificationStatus(userId, status as VerificationUserStatus, declineReason)
      } else {
        await updatePartnerStatus(userId, status as PartnerStatus, declineReason)
      }

      toast({
        title: `Request ${status === PartnerStatus.ACTIVE ? "approved" : "declined"}`,
        position: "bottom-right",
        successIcon: true,
      })

      router.push(`/super-admin/${isAmbassador ? "ambassadors" : "partners"}?status=pending`)
    } catch (error) {
      console.error("Failed to update user status:", error)
    } finally {
      setIsSubmitting(false)
      setDeletingId(null)
    }
  }

  const onSubmit = () => {
    handleUpdateUserStatus("ACTIVE" as VerificationUserStatus | PartnerStatus)
  }

  const handleDeclineUser = (declineReason?: string) => {
    handleUpdateUserStatus("DECLINED" as VerificationUserStatus | PartnerStatus, declineReason)
  }

  const handleDownloadClick = () => {
    const link = document.createElement("a")
    link.href = "/path/to/your/PDF.pdf"
    link.download = "contract.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenDeletingModal = (clientId: string | number | null | undefined) => {
    if (clientId) {
      setDeletingId(clientId)
    }
  }

  return (
    <div className="h-full w-full lg:px-4">
      {isModalOpen && <ContractModal onClose={() => setIsModalOpen(false)} onDownload={handleDownloadClick} />}
      <DeclineProfileModal
        isOpen={deletingId === userId}
        onClose={() => setDeletingId(null)}
        onConfirm={(declineReason: string) => handleDeclineUser(declineReason)}
      />
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageTopicSecond name={backLinkText} link={backLink} enable={false} />
          {!isPendingUser && (
            <StatusBadge
              status={isAmbassador ? user?.verificationStatus : user?.partnerStatus}
              date={isAmbassador ? user?.verificationDate : user?.partnerStatusDate}
            />
          )}
        </div>
        <div className="mt-6 mb-3 flex flex-1 items-start justify-between max-lg:block">
          <div className="w-3/5 max-lg:mt-8 max-lg:w-full">
            <div className="text-primary-900 text-xl font-semibold">Professional Info</div>
            <div className="border-grey-400 mt-3.5 rounded-2xl border p-5 max-lg:block">
              <div className="transition duration-300">
                <div className="flex max-h-full flex-col gap-5 transition-all duration-700">
                  <div className="flex flex-col gap-5 lg:flex-row">
                    {professionalInfo.slice(0, 2).map(({ key, label }) => (
                      <div key={key} className="w-full">
                        <Label className="text-primary-900 text-sm font-semibold">{label}</Label>
                        <Input
                          readOnly
                          value={user ? user[key] || "" : "Loading..."}
                          className="text-primary-800 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm read-only:bg-blue-50"
                        />
                      </div>
                    ))}
                  </div>
                  {professionalInfo.slice(2).map(({ key, label }) => (
                    <div key={key} className="w-full">
                      <Label className="text-primary-900 text-sm font-semibold">{label}</Label>
                      <Input
                        readOnly
                        value={user ? user[key] || "" : "Loading..."}
                        className="text-primary-800 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm read-only:bg-blue-50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {userType === "partner" && (
              <>
                <div className="text-primary-900 mt-10 text-xl font-semibold">Social Media Pages</div>
                <div className="border-grey-400 mt-3.5 rounded-2xl border p-5 max-lg:block">
                  <div className="transition duration-300">
                    <div className="flex max-h-full flex-col gap-5 transition-all duration-700">
                      {socialLinks.map(({ key, label }) => (
                        <div key={key} className="w-full">
                          <Label className="text-primary-900 text-sm font-semibold">{label}</Label>
                          <Input
                            readOnly
                            value={""}
                            className="text-primary-800 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm read-only:bg-blue-50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-[35%] max-lg:mt-8 max-lg:w-full">
            <div className="text-primary-900 text-xl font-semibold">Credentials</div>
            <div className="border-grey-400 mt-3.5 rounded-2xl border bg-blue-50 p-13">
              <div className="flex flex-col gap-3 transition duration-300">
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="bg-grey-300 text-grey-800 flex h-52 w-full items-center justify-between rounded-lg border-2 border-gray-100 p-4 text-sm"
                >
                  <div className="flex w-full items-center justify-start">
                    <div className="ml-2 w-full text-center text-sm">No Document</div>
                  </div>
                </div>
              </div>
            </div>

            {userType === "partner" && (
              <>
                <div className="text-primary-900 mt-10 text-[20px] font-semibold">Selected areas of cooperation</div>
                <div className="border-grey-400 bg-grey-100 mt-3.5 rounded-2xl border p-5">
                  {cooperations.map((cooperation, index) => (
                    <div key={index} className="mb-5 flex items-center justify-start">
                      <Checkbox defaultChecked disabled />
                      <div className="text-grey-800 ml-3 text-sm font-normal">{cooperation.title}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {isPendingUser && (
          <div className="border-grey-400 bg-grey-100 mt-3.5 mb-3 w-full rounded-[20px] border p-3 max-md:mb-3.5">
            <div className="flex w-44 items-center gap-2 justify-self-end">
              <Button
                variant="primary"
                size="sm"
                className="bg-primary-900 hover:bg-primary-900/80 w-full rounded-full"
                onClick={() => onSubmit()}
                disabled={isSubmitting}
              >
                Approve
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red hover:bg-red/80 w-full rounded-full"
                onClick={() => handleOpenDeletingModal(userId)}
                disabled={isSubmitting}
              >
                Decline
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApprovalProfile

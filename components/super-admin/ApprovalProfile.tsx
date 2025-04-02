"use client"

import { FC, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { Label } from "@radix-ui/react-label"

import { getUserById } from "@/actions/user"
import { User } from "@/models/user"

import ContractModal from "../ambassador/ContractModal"
import PageTopicSecond from "../PageTopicSecond"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

import DeclineProfileModal from "./DeclineProfileModal"

type ProfessionalInfo = {
  key: keyof Pick<
    User,
    "name" | "email" | "lastName" | "type_proffesion" | "place_work" | "practical_size" | "telephone"
  >
  label: string
}

const professionalInfo: ProfessionalInfo[] = [
  {
    key: "name",
    label: "First Name",
  },
  {
    key: "lastName",
    label: "Last Name",
  },
  {
    key: "type_proffesion",
    label: "Type of professional",
  },
  {
    key: "practical_size",
    label: "Practice size",
  },
  {
    key: "place_work",
    label: "Place of Work",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "telephone",
    label: "Phone Number",
  },
]

const ApprovalProfile: FC = () => {
  const pathname = usePathname()
  const id = pathname.split("/").pop()
  const [user, setUser] = useState<User | null>(null)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        console.error("User ID is undefined")
        return
      }
      try {
        const response = await getUserById(id)
        setUser(response)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }

    fetchUser() // Remove the redundant check and call fetchUser directly
  }, [id])

  const onSubmit = async () => {
    try {
      console.log("Approve user with ID:", user?.id)
      // await approveUser(user.id).then((response: { success?: string, data?: User, error?: string}) => {
      //   if (response.success) {
      //     router.push("/super-admin")
      //   }
      // })
    } catch (error) {
      console.error("Failed to submit data:", error)
    }
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

  const handleDeclineUser = (userId?: string, declineReason?: string) => {
    try {
      console.log("Decline user with ID:", userId, declineReason)
      // await declineUser({ userId, declineReason}).then((response: { success?: string, error?: string}) => {
      //   if (response.success) {
      //     router.push("/super-admin")
      //   }
      // })
    } catch (error) {
      console.error("Failed to submit data:", error)
    }
  }

  return (
    <div className="h-full w-full lg:px-4">
      {isModalOpen && <ContractModal onClose={() => setIsModalOpen(false)} onDownload={handleDownloadClick} />}
      <DeclineProfileModal
        isOpen={deletingId === user?.id}
        onClose={() => setDeletingId(null)}
        onConfirm={(declineReason: string) => handleDeclineUser(user?.id, declineReason)}
      />
      <div className="flex h-full flex-col">
        <PageTopicSecond name="Back to Ambassadors hub" link="/super-admin/ambassador" enable={false} />
        <div className="mt-6 flex flex-1 items-start justify-between max-lg:block">
          <div className="w-3/5 max-lg:mt-8 max-lg:w-full">
            <div className="text-primary-900 text-[20px] font-semibold">Professional Info</div>
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
          </div>

          <div className="w-[35%] max-lg:mt-8 max-lg:w-full">
            <div className="text-primary-900 text-[20px] font-semibold">Credentials</div>
            <div className="border-grey-400 mt-3.5 rounded-2xl border bg-blue-50 p-13">
              <div className="flex flex-col gap-3 transition duration-300">
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="bg-grey-300 text-grey-800 flex h-52 w-full items-center justify-between rounded-lg border-2 border-gray-100 p-4 text-sm"
                >
                  <div className="flex w-full items-center justify-start">
                    {/* {user?.document ? (
                      <Image src={documentIcon} alt="Document" className="h-4.5 w-4.5" />
                    ) : ( */}
                    <div className="ml-2 w-full text-center text-sm">No Document</div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-grey-400 bg-grey-100 mt-3.5 w-full rounded-[20px] border p-3">
          <div className="flex w-44 items-center gap-2 justify-self-end">
            <Button
              variant="primary"
              size="sm"
              className="bg-primary-900 hover:bg-primary-900/80 w-full rounded-full"
              onClick={() => onSubmit()}
            >
              Approve
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red hover:bg-red/80 w-full rounded-full"
              onClick={() => handleOpenDeletingModal(user?.id)}
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalProfile

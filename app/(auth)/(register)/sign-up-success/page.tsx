"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import { SignUpLayout } from "@/components/SignUpLayout"
import confirmedOrderImage from "@/public/Confirmed_Order.svg"

const SignUpSuccessPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const userEmail = session?.user?.email

  const handleBackToHome = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/sign-in")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <SignUpLayout currentStep={4}>
      <div className="flex items-center justify-center">
        <Image src={confirmedOrderImage} alt="Check" className="h-[130px] w-[130px]" />
      </div>
      <div className="text-primary-900 mt-[32px] text-center text-[32px] font-bold">Well done!</div>
      <div className="text-primary-900 mt-2 text-center text-sm">
        Happy V will review your credentials, usually this will take up to 2 business days, and then we will notify you
        of the result to the email address you provided <span className="font-semibold">{userEmail || ""}</span>
      </div>
      <div
        onClick={handleBackToHome}
        className="border-primary-900 text-primary-900 mt-[32px] cursor-pointer rounded-full border px-[32px] py-[8px] text-center text-sm font-normal"
      >
        Back to Home Page
      </div>
    </SignUpLayout>
  )
}

export default SignUpSuccessPage

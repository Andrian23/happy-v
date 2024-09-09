"use client"

import Image from "next/image"
import Link from "next/link"

import { SignUpLayout } from "@/components/SignUpLayout"
import confirmedOrderImage from "@/public/Confirmed_Order.svg"

const SignUpSuccessPage = () => (
  <SignUpLayout currentStep={4}>
    <div className="flex items-center justify-center">
      <Image src={confirmedOrderImage} alt="Check" className="h-[130px] w-[130px]" />
    </div>
    <div className="mt-[32px] text-center text-[32px] font-bold text-primary-900">Well done!</div>
    <div className="mt-2 text-center text-sm text-primary-900">
      Before activating your account, we have to check your professional credentials, we will immediately notify you
      about the result to your e-mail: exame@email.com
    </div>
    <Link
      href="/sign-in"
      className="mt-[32px] cursor-pointer rounded-full border border-grey-400 px-[32px] py-[8px] text-center text-sm font-normal text-primary-900"
    >
      Back to Home Page
    </Link>
  </SignUpLayout>
)

export default SignUpSuccessPage

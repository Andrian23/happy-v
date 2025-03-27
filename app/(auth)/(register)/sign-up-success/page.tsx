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
    <div className="text-primary-900 mt-[32px] text-center text-[32px] font-bold">Well done!</div>
    <div className="text-primary-900 mt-2 text-center text-sm">
      Happy V will review your credentials, usually this will take up to 2 business days, and then we will notify you of
      the result to the email address you provided <span className="font-semibold">example@email.com</span>
    </div>
    <Link
      href="/sign-in"
      className="border-primary-900 text-primary-900 mt-[32px] cursor-pointer rounded-full border px-[32px] py-[8px] text-center text-sm font-normal"
    >
      Back to Home Page
    </Link>
  </SignUpLayout>
)

export default SignUpSuccessPage

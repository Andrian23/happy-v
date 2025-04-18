"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"

const SignUpReviewPage = () => {
  const router = useRouter()
  const [newsletterChecked, setNewsletterChecked] = useState(false)
  const [marketingChecked, setMarketingChecked] = useState(false)

  const handleAgreeAndCreate = () => {
    if (newsletterChecked && marketingChecked) {
      router.push("/sign-up-success")
    } else {
      console.log("Please agree to all terms to create an account.")
    }
  }

  return (
    <SignUpLayout currentStep={3}>
      <div className="text-primary-900 text-center text-[32px] font-bold">Review our terms</div>
      <div className="text-grey-800 mt-2 text-sm">Last review our terms and launch account</div>

      <div className="bg-grey-200 text-primary-900 mt-[32px] mb-[20px] rounded-lg p-[16px] text-sm">
        By creating an account, I agree to the Happy V{" "}
        <Link href="https://happyv.com/policies/terms-of-service" target="_blank" className="text-primary-500">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="https://happyv.com/policies/privacy-policy" target="_blank" className="text-primary-500">
          Privacy Policy
        </Link>
      </div>

      <div className="my-[8px] px-[18px]">
        <div className="flex items-start justify-start">
          <Checkbox
            className="CheckboxRoot"
            checked={newsletterChecked}
            onCheckedChange={(checked) =>
              setNewsletterChecked(checked === "indeterminate" ? newsletterChecked : checked)
            }
          />
          <div className="text-primary-900 ml-2 lg:text-sm">
            I agree to receive Happy V newsletter with thoughtful content for woman’s wellness - you can unsubscribe in
            one click
          </div>
        </div>
        <div className="my-[8px] flex items-start justify-start">
          <Checkbox
            className="CheckboxRoot"
            checked={marketingChecked}
            onCheckedChange={(checked) => setMarketingChecked(checked === "indeterminate" ? marketingChecked : checked)}
          />
          <div className="text-primary-900 ml-2 lg:text-sm">
            I agree to receive account updates and other marketing emails
          </div>
        </div>

        <Button
          className="mt-8 w-full"
          variant="primary"
          disabled={!newsletterChecked || !marketingChecked}
          onClick={handleAgreeAndCreate}
        >
          Agree to Terms & Create Account
        </Button>
      </div>
    </SignUpLayout>
  )
}

export default SignUpReviewPage

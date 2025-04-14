"use client"

import { useEffect, useState } from "react"

import { createReferralCode, getUserReferralCode } from "@/actions/affiliate"
import PageTopic from "@/components/PageTopic"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useToast } from "@/components/ui/useToast"

const AffiliatePage = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referralLink, setReferralLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReferralCode()
  }, [])

  const fetchReferralCode = async () => {
    setIsLoading(true)
    try {
      const { code, link } = await getUserReferralCode()

      if (code && link) {
        setReferralCode(code)
        setReferralLink(link)
      } else {
        await generateNewCode()
      }
    } catch (err) {
      handleError(err as { message: string })
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewCode = async () => {
    setIsLoading(true)
    try {
      await createReferralCode()

      const { code, link } = await getUserReferralCode()

      if (code && link) {
        setReferralCode(code)
        setReferralLink(link)
        toast({
          title: "Success",
          description: "Referral code generated successfully!",
          position: "bottom-right",
        })
      } else {
        throw new Error("Failed to retrieve generated code details")
      }
    } catch (err) {
      handleError(err as { message: string })
    } finally {
      setIsLoading(false)
    }
  }

  const handleError = (err: { message: string }) => {
    const errorMessage = err?.message || "Something went wrong with referral link generation"
    setError(errorMessage)
    toast({
      title: "Error",
      description: errorMessage,
      position: "bottom-right",
    })
    console.error("Referral code error:", err)
  }

  const handleCopyDiscountCode = () => {
    if (referralCode) navigator.clipboard.writeText(referralCode)
    toast({ title: "Discount code copied to clipboard", position: "bottom-right" })
  }

  const handleCopyAffiliateLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
      toast({ title: "Affiliate link copied to clipboard", position: "bottom-right" })
    }
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic
        name="Affiliate link & Discount code (15% off)"
        description="You can share this discount code and affiliate link with your patients via email or social media."
      />

      {error && (
        <div className="flex h-64 flex-col items-center justify-center p-8">
          <p className="text-primary-900 mb-4">An error occurred. Please contact support.</p>
        </div>
      )}

      {!error && (
        <div className="bg-grey-200 mt-5 flex flex-col gap-6 rounded-2xl max-lg:p-4 lg:w-[70%] lg:p-6">
          <div className="flex flex-col gap-1.5">
            <Label>Discount code</Label>
            <div className="flex flex-col gap-1.5 lg:flex-row">
              <Input value={isLoading ? "Loading..." : referralCode || "No code yet"} readOnly disabled={isLoading} />
              <div className="text-primary-800 text-sm leading-5 font-medium lg:hidden">
                Patient must enter this code at checkout on HappyV.com
              </div>
              <Button
                className="mt-0.5 w-full lg:mt-0 lg:max-w-[100px]"
                variant="primary"
                onClick={handleCopyDiscountCode}
                disabled={isLoading || !referralCode}
              >
                Copy code
              </Button>
            </div>
            <div className="text-primary-800 hidden text-sm leading-5 font-medium lg:block">
              Patient must enter this code at checkout on HappyV.com
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Affiliate link</Label>
            <div className="flex flex-col gap-1.5 lg:flex-row">
              <Input value={isLoading ? "Loading..." : referralLink || "No link yet"} readOnly disabled={isLoading} />
              <div className="text-primary-800 text-sm leading-5 font-medium lg:hidden">
                This discount will be applied at checkout when customers enter this link.
              </div>
              <Button
                className="mt-0.5 w-full lg:mt-0 lg:max-w-[100px]"
                variant="primary"
                onClick={handleCopyAffiliateLink}
                disabled={isLoading || !referralLink}
              >
                Copy link
              </Button>
            </div>
            <div className="text-primary-800 hidden text-sm leading-5 font-medium lg:block">
              This discount will be applied at checkout when customers enter this link.
            </div>
          </div>

          {isLoading && (
            <div className="my-4 flex items-center justify-center">
              <div className="border-primary-800 h-8 w-8 animate-spin rounded-full border-t-2 border-b-2"></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AffiliatePage

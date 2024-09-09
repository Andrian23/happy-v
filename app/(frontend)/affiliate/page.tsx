"use client"

import PageTopic from "@/components/PageTopic"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useToast } from "@/components/ui/useToast"

const AffiliatePage = () => {
  const { toast } = useToast()

  const handleCopyDiscountCode = () => {
    navigator.clipboard.writeText("HappyDrTessmerTruck")
    toast({ title: "Discount code copied to clipboard" })
  }

  const handleCopyAffiliateLink = () => {
    navigator.clipboard.writeText("http://happyv.com/discount/HappyDRTessmerTuck")
    toast({ title: "Affiliate link copied to clipboard" })
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <PageTopic
        name="Affiliate link & Discount code (15% off)"
        description="You can share this discount code and affiliate link with your patients via email or social media."
      />

      <div className="mt-5 flex flex-col gap-6 rounded-2xl bg-grey-200 max-lg:p-4 lg:w-[70%] lg:p-6">
        <div className="flex flex-col gap-1.5">
          <Label>Discount code</Label>
          <div className="flex flex-col gap-1.5 lg:flex-row">
            <Input value="HappyDrTessmerTruck" readOnly />
            <div className="text-sm font-medium leading-5 text-primary-800 lg:hidden">
              Patient must enter this code at checkout on HappyV.com
            </div>
            <Button
              className="mt-0.5 w-full lg:mt-0 lg:max-w-[100px]"
              variant="primary"
              onClick={handleCopyDiscountCode}
            >
              Copy code
            </Button>
          </div>
          <div className="hidden text-sm font-medium leading-5 text-primary-800 lg:block">
            Patient must enter this code at checkout on HappyV.com
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Affiliate link</Label>
          <div className="flex flex-col gap-1.5 lg:flex-row">
            <Input value="http://happyv.com/discount/HappyDRTessmerTuck" readOnly />
            <div className="text-sm font-medium leading-5 text-primary-800 lg:hidden">
              This discount will be applied at checkout when customers enter this link.
            </div>
            <Button
              className="mt-0.5 w-full lg:mt-0 lg:max-w-[100px]"
              variant="primary"
              onClick={handleCopyAffiliateLink}
            >
              Copy link
            </Button>
          </div>
          <div className="hidden text-sm font-medium leading-5 text-primary-800 lg:block">
            This discount will be applied at checkout when customers enter this link.
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliatePage

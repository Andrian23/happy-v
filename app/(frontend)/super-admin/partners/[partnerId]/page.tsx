import ApprovalProfile from "@/components/super-admin/ApprovalProfile"

const PartnerPage = async ({ params }: { params: Promise<{ partnerId: string }> }) => {
  const userId = (await params).partnerId

  return (
    <ApprovalProfile
      userId={userId}
      userType="partner"
      backLink="/super-admin/partners?status=pending"
      backLinkText="Back to Partners hub"
    />
  )
}

export default PartnerPage

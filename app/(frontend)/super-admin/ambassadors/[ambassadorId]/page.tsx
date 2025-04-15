import ApprovalProfile from "@/components/super-admin/ApprovalProfile"

const AmbassadorPage = async ({ params }: { params: Promise<{ ambassadorId: string }> }) => {
  const userId = (await params).ambassadorId

  return (
    <ApprovalProfile
      userId={userId}
      userType="ambassadors"
      backLink="/super-admin/ambassadors?status=pending"
      backLinkText="Back to Ambassadors hub"
    />
  )
}

export default AmbassadorPage

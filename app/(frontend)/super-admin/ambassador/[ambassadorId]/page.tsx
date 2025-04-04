import ApprovalProfile from "@/components/super-admin/ApprovalProfile"

const AmbassadorPage = async ({ params }: { params: Promise<{ ambassadorId: string }> }) => {
  const userId = (await params).ambassadorId

  return <ApprovalProfile userId={userId} />
}

export default AmbassadorPage

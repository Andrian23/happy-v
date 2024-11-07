import Assets from "@/app/features/assets/Assets"

export default function MarketingPage() {
  return (
    <Assets
      title="Assets & Education Assets"
      description="Get access to essential marketing and education materials"
      tabs={["Product one-pagers", "Product brochures", "Publication list", "Studies"]}
      assetsByTab={{
        "Product one-pagers": [
          {
            preview: "/One-Pager_D_Mannose_Preview_Image.jpg",
            file: "/files/One-Pager_D Mannose - Cranberry Capsules.pdf",
            type: "pdf",
          },
          {
            preview: "/One-Pager_D_Mannose_Stick_Packs_Image_Preview.jpg",
            file: "/files/One-Pager_D Mannose - Cranberry Stick Packs.pdf",
            type: "pdf",
          },
          {
            preview: "/One-Pager_Prebiotic_Preview_Image.png",
            file: "/files/One-Pager_Prebiotic and Probiotic.pdf",
            type: "pdf",
          },
        ],
        "Product brochures": [],
        "Publication list": [],
        Studies: [],
      }}
    />
  )
}

import Assets from "@/app/features/assets/Assets"

export default function SocialPage() {
  return (
    <Assets
      title="Social Media Assets"
      description="Get access to social media assets for share"
      tabs={["Gifs", "Images", "Videos", "Social media calendar"]}
      assetsByTab={{
        Gifs: [],
        Images: [],
        Videos: [],
      }}
      isFormatMenuPresent={false}
    />
  )
}

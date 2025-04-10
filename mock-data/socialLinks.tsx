import { SocialLink } from "@/models/socialLinks"
import facebookIcon from "@/public/Facebook.svg"
import globeIcon from "@/public/Globe.svg"
import instagramIcon from "@/public/Instagram.svg"
import xIcon from "@/public/X.svg"
import youtubeIcon from "@/public/Youtube.svg"

export const socialLinks: SocialLink[] = [
  {
    key: "websiteLink",
    label: "Website link",
    placeholder: "Paste the link to your website",
    alt: "Globe",
    icon: globeIcon,
  },
  {
    key: "facebookLink",
    label: "Facebook link",
    placeholder: "Paste the link to your Facebook page",
    alt: "Document",
    icon: facebookIcon,
  },
  {
    key: "instagramLink",
    label: "Instagram link",
    placeholder: "Paste the link to your Instagram page",
    alt: "Document",
    icon: instagramIcon,
  },
  {
    key: "twitterLink",
    label: "X link (Twitter)",
    placeholder: "Paste the link to your X (Twitter) page",
    alt: "Document",
    icon: xIcon,
  },
  {
    key: "youtubeLink",
    label: "YouTube link",
    placeholder: "Paste the link to your YouTube channel",
    alt: "Document",
    icon: youtubeIcon,
  },
]

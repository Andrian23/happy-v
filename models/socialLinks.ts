import { AmbassadorLinks } from "./ambassador"

export type SocialLink = {
  key: keyof AmbassadorLinks
  label: string
  placeholder: string
  alt: string
  icon: string
}

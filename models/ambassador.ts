export interface AmbassadorLinks {
  twitterLink: string
  websiteLink: string
  youtubeLink: string
  facebookLink: string
  instagramLink: string
}

export interface Ambassador {
  id: string
  userId: string
  ambassadorLinks: AmbassadorLinks
  selectedTitles: string[]
  createdAt: string
  updatedAt: string
  status: "no-active" | "active"
}

export interface User {
  id: string
  name: string | null
  lastName: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  telephone: string | null
  type_proffesion: string | null
  place_work: string | null
  practical_size: string | null
  role: string | null
  createdAt: Date | null
  updatedAt: Date | null
  isTwoFactorEnable: boolean
  stripeCustomerId?: string | null
}

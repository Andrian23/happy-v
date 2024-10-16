import { type DefaultSession } from "next-auth"

import { UserRole } from "@prisma/client"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
  id: string
  defaultShippingAddress?: number | null
}

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: ExtendedUser
  }
}

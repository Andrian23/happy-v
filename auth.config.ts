import type { NextAuthConfig } from "next-auth"

import { UserRole } from "@prisma/client"

import type { User } from "@/models/user"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = (user as User).role
        token.defaultShippingAddress = (user as User).defaultShippingAddress
        token.telephone = (user as User).telephone
      }
      return token
    },
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (typeof token.defaultShippingAddress === "number" && session.user) {
        session.user.defaultShippingAddress = token.defaultShippingAddress || null
      }

      if (token.telephone && session.user) {
        session.user.telephone = token.telephone as string
      }

      return session
    },
    authorized: ({ auth }) => !!auth,
  },
  providers: [],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
}

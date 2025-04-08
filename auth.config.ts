import type { NextAuthConfig } from "next-auth"

import { UserRole } from "@prisma/client"

import type { ApprovalUserStatus, PartnerStatus } from "@/models/participants"

import { User } from "./models/user"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
  },
  callbacks: {
    jwt: ({ token, user, session, trigger }) => {
      if (user) {
        token.role = (user as User).role
        token.defaultShippingAddress = (user as User).defaultShippingAddress
        token.telephone = (user as User).telephone
        token.signUpStep3Completed = (user as User).signUpStep3Completed
        token.signUpStep4Completed = (user as User).signUpStep4Completed
        token.approvalStatus = (user as User).approvalStatus
        token.partnerStatus = (user as User).partnerStatus
      }

      if (trigger === "update" && session?.data?.user) {
        if (session.data.user.signUpStep3Completed) {
          token.signUpStep3Completed = session.data.user.signUpStep3Completed
        }

        if (session.data.user.signUpStep4Completed) {
          token.signUpStep4Completed = session.data.user.signUpStep4Completed
        }

        if (session.data.user.approvalStatus) {
          token.approvalStatus = session.data.user.approvalStatus
        }

        if (session.data.user.partnerStatus) {
          token.partnerStatus = session.data.user.partnerStatus
        }
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

      if (typeof token.signUpStep3Completed === "boolean" && session.user) {
        session.user.signUpStep3Completed = token.signUpStep3Completed
      }

      if (typeof token.signUpStep4Completed === "boolean" && session.user) {
        session.user.signUpStep4Completed = token.signUpStep4Completed
      }

      if (token.approvalStatus && session.user) {
        session.user.approvalStatus = token.approvalStatus as ApprovalUserStatus
      }

      if (token.partnerStatus && session.user) {
        session.user.partnerStatus = token.partnerStatus as PartnerStatus
      }
      return session
    },
    authorized: ({ auth }) => !!auth,
  },
  providers: [],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
}

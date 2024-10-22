import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"

import { sendLoginNotification } from "@/actions/emailEvents"

import { getUserById } from "./data/user"
import { db } from "./lib/db"
import authConfig from "./auth.config"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
    async createUser({ user }) {
      const fullName = user?.name || ""
      const [firstName, lastName] = fullName.split(" ")

      await db.user.update({
        where: { id: user.id },
        data: {
          name: firstName || null,
          lastName: lastName || null,
          emailVerified: new Date(),
          role: UserRole.USER,
        },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email || "" },
        })

        if (user.email) {
          try {
            await sendLoginNotification({ email: user.email })
          } catch (error) {
            console.error("Failed to send login notification:", error)
          }
        }

        if (!existingUser) {
          return true
        }
      }

      if (account?.provider !== "credentials") return true

      if (!user.id) {
        return "No user ID"
      }

      if (account?.provider === "credentials" && user.email) {
        try {
          await sendLoginNotification({ email: user.email })
        } catch (error) {
          console.error("Failed to send login notification:", error)
        }
      }

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (typeof token.defaultShippingAddress === "number" && session.user) {
        session.user.defaultShippingAddress = token.defaultShippingAddress || null
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role

      token.defaultShippingAddress = existingUser.defaultShippingAddress || null

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})

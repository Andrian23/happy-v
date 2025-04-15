import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"

import { sendLoginNotification } from "@/actions/emailEvents"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { LoginSchema } from "@/schemas"

import { authConfig } from "./auth.config"

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  Credentials({
    async authorize(credentials) {
      const validatedFields = LoginSchema.safeParse(credentials)

      if (validatedFields.success) {
        const { email, password } = validatedFields.data

        const user = await getUserByEmail(email)

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) return user
      }

      return null
    },
  }),
]

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
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
          signUpStep3Completed: false,
          signUpStep4Completed: false,
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
    jwt: authConfig.callbacks?.jwt || (({ token }) => token),
    session: authConfig.callbacks?.session || (({ session }) => session),
  },
})

import { NextRequest, NextResponse } from "next/server"
import NextAuth from "next-auth"

import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "@/routes"

import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

const queueActivityUpdate = (userEmail: string, req: NextRequest) => {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const host = req.headers.get("host") || "localhost:3000"
  const url = `${protocol}://${host}/api/user/activity?userEmail=${userEmail}`

  fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.error("Background activity update failed:", err))
}

export default auth((req) => {
  const { nextUrl } = req
  const userEmail = req.auth?.user?.email

  if (nextUrl.pathname.startsWith("/api/cron")) {
    return NextResponse.next()
  }

  if (userEmail) {
    queueActivityUpdate(userEmail, req)
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isAuthRoute) {
    return userEmail ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)) : NextResponse.next()
  }

  if (!userEmail && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

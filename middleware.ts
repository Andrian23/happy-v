import { NextResponse } from "next/server"
import NextAuth, { User } from "next-auth"

import {
  ADMIN_LOGIN_REDIRECT,
  adminPrefix,
  adminRoutes,
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  profileRegistrationRoutes,
  profileRegistrationSteps,
  publicRoutes,
} from "@/routes"

import { authConfig } from "./auth.config"

export const { auth } = NextAuth(authConfig)

const queueActivityUpdate = (userEmail: string, req: Request) => {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const host = req.headers.get("host") || "localhost:3000"
  const url = `${protocol}://${host}/api/user/activity?userEmail=${userEmail}`

  fetch(url, {
    method: "POST",
    cache: "no-store",
  }).catch((err) => console.error("Background activity update failed:", err))
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userEmail = req.auth?.user?.email
  const userRole = req.auth?.user?.role
  const isActiveStatusUser = userRole === "ADMIN" || req.auth?.user?.verificationStatus === "ACTIVE"

  if (nextUrl.pathname.startsWith("/api/cron")) {
    return NextResponse.next()
  }

  if (nextUrl.pathname.startsWith("/api/user/activity")) {
    return NextResponse.next()
  }

  if (isLoggedIn && userEmail) {
    queueActivityUpdate(userEmail, req)
  }

  const isSuperAdminRoute = nextUrl.pathname.startsWith(adminPrefix)
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  const isAdminRoute = adminRoutes.some((route) => nextUrl.pathname.startsWith(route))
  const isProfileStepsRoute = profileRegistrationRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isAuthRoute) {
    if (isLoggedIn && !isProfileStepsRoute && isActiveStatusUser) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
  }

  if (userRole === "ADMIN" && !isSuperAdminRoute) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl))
  }

  if (isAdminRoute && !isPublicRoute && !isAuthRoute) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/sign-in", nextUrl))
    }
  }

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  const uncompletedSteps: string[] = []
  profileRegistrationSteps.forEach((step) => {
    const user = req.auth?.user as User
    if (!user?.[step.name as keyof typeof user]) {
      uncompletedSteps.push(step.route)
    }
  })

  if (isLoggedIn && !isAuthRoute && uncompletedSteps.length > 0) {
    return NextResponse.redirect(new URL(uncompletedSteps[0], nextUrl))
  }

  if (isLoggedIn && !isActiveStatusUser && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-up-success", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

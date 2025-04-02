export const publicRoutes = ["/", "/new-verification"]

export const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/auth-error",
  "/forgot",
  "/new-password",
  "/sign-up-2",
  "/sign-up-3",
  "/sign-up-4",
  "/sign-up-success",
]

export const apiAuthPrefix = "/api/auth"

export const adminRoutes = ["/super-admin"]

export const adminPrefix = "/super-admin"

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"
export const ADMIN_LOGIN_REDIRECT = "/super-admin"

export const profileRegistrationSteps: { route: string; name: string }[] = [
  {
    route: "/sign-up-3",
    name: "signUpStep3Completed",
  },
  {
    route: "/sign-up-4",
    name: "signUpStep4Completed",
  },
]

export const profileRegistrationRoutes = ["/sign-up-success", ...profileRegistrationSteps.map((step) => step.route)]

import * as z from "zod"

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
})

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine(
      (password) => {
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /[0-9]/.test(password)
        const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
          return false
        }

        return true
      },
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
      }
    ),
  name: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  telephone: z
    .string()
    .min(10, { message: "Phone must be at least 10 digits" })
    .max(15, { message: "Phone must be less than 15 digits" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
  type_proffesion: z.string().min(1, {
    message: "Type profession is required",
  }),
  practical_size: z.string().min(1, {
    message: "Practice size is required",
  }),
  place_work: z.string().min(1, {
    message: "Place work is required",
  }),
  policy: z.boolean().refine((val) => val === true, {
    message: "Policy confirmation is required",
  }),
  newsletter: z.boolean().optional(),
  marketing: z.boolean().optional(),
})

export const RegisterFirstSchema = z.object({
  name: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  telephone: z.string().min(1, {
    message: "Phone number is required",
  }),
  policy: z.boolean().refine((val) => val === true, {
    message: "Please agree to ToS and Privacy Policy before continuing",
  }),
  newsletter: z.boolean().optional(),
  marketing: z.boolean().optional(),
})

export const RegisterSecondSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine(
      (password) => {
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /[0-9]/.test(password)
        const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
          return false
        }

        return true
      },
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
      }
    ),
})

export const RegisterThirdSchema = z.object({
  type_proffesion: z.string().min(1, {
    message: "Type profession is required",
  }),
  practical_size: z.string().min(1, {
    message: "Practice size is required",
  }),
  place_work: z.string().min(1, {
    message: "Place work is required",
  }),
})

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .refine(
        (password) => {
          const hasUpperCase = /[A-Z]/.test(password)
          const hasLowerCase = /[a-z]/.test(password)
          const hasNumbers = /[0-9]/.test(password)
          const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)

          if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
            return false
          }

          return true
        },
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don’t match. Please double-check and try again",
    path: ["confirmPassword"],
  })

export const ResetPasswordSettings = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required",
    }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .refine(
        (password) => {
          const hasUpperCase = /[A-Z]/.test(password)
          const hasLowerCase = /[a-z]/.test(password)
          const hasNumbers = /[0-9]/.test(password)
          const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)

          if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
            return false
          }

          return true
        },
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don’t match. Please double-check and try again",
    path: ["confirmPassword"],
  })

export const MarketingAssetsSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image URL is required",
  }),
  format: z.string().min(1, {
    message: "Format is required",
  }),
  type: z.string().min(1, {
    message: "Type is required",
  }),
  title: z.string().min(1, {
    message: "Title is required",
  }),
})

export const SocialAssetsSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image URL is required",
  }),
  format: z.string().min(1, {
    message: "Format is required",
  }),
  type: z.string().min(1, {
    message: "Type is required",
  }),
  title: z.string().min(1, {
    message: "Title is required",
  }),
})

export const CooperationSchema = z.object({
  selectedTitles: z.array(z.string()),
  isConfirmed: z.boolean().refine((value) => value, {
    message: "Please confirm the terms to proceed.",
  }),
})

export const ShippingAddressSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(100, { message: "Address must be less than 100 characters" }),
  apartmentSuite: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }).max(50, { message: "City must be less than 50 characters" }),
  country: z
    .string()
    .min(1, { message: "Country is required" })
    .max(50, { message: "Country must be less than 50 characters" }),
  postalZipCode: z
    .string()
    .min(5, { message: "Postal code must be at least 5 characters" })
    .max(10, { message: "Postal code must be less than 10 characters" })
    .regex(/^\d{5}(?:[-\s]\d{4})?$/, { message: "Invalid postal code format" }),
  stateProvince: z.string().min(1, { message: "Province is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone must be at least 10 digits" })
    .max(15, { message: "Phone must be less than 15 digits" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
  isDefault: z.boolean(),
})

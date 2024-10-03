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

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    lastName: z.string().min(1, {
      message: "Name is required",
    }),
    telephone: z.string().min(1, {
      message: "Telephone is required",
    }),
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const RegisterFirstSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Name is required",
  }),
  type_proffesion: z.string().min(1, {
    message: "Type profession is required",
  }),
  practical_size: z.string().min(1, {
    message: "Practice size is required",
  }),
  place_work: z.string().min(1, {
    message: "Place work is required",
  }),
  telephone: z.string().min(1, {
    message: "Telephone is required",
  }),
})

export const NewPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Це вказує, де показувати повідомлення про помилку
  })

export const ResetPasswordSettings = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required",
    }),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Це вказує, де показувати повідомлення про помилку
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

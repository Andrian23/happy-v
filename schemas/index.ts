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

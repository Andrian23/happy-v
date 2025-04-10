import { User } from "@/models/user"

export type ProfessionalInfo = {
  key: keyof Pick<
    User,
    "name" | "email" | "lastName" | "type_proffesion" | "place_work" | "practical_size" | "telephone"
  >
  label: string
}
